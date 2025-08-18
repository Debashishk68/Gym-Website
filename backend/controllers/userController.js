const Client = require("../models/clientModel");
const invoiceModel = require("../models/invoiceModel");
const planModel = require("../models/planModel");
const mongoose = require("mongoose");
const getPublicIdFromUrl = require("../utils/genPublicId");
const cloudinary = require("cloudinary").v2;

const addClient = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      fathersname,
      age,
      gender,
      plan,
      planPrice,
      emergencyContact,
      createdAt,
      status,
      address,
      discount,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !fullname ||
      !email ||
      !phone ||
      !age ||
      !fathersname ||
      !gender ||
      !plan ||
      !planPrice ||
      // !emergencyContact ||
      !status ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startDate = createdAt ? new Date(createdAt) : new Date();
    const membershipDeadline = new Date(startDate);

    if (plan.trim().toLowerCase() === "platinum") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 12);
    } else if (plan.trim().toLowerCase() === "gold") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 6);
    } else if (plan.trim().toLowerCase() === "standard") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 3);
    } else if (plan.trim().toLowerCase() === "basic") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 1);
    } else {
      console.error("Invalid plan selected");
    }

    const existingClient = await Client.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Client with this email or phone already exists" });
    }

    // Access uploaded file from multer (Cloudinary)
    const file = req.file;
    // if (!file) {
    //   return res.status(400).json({ message: "Profile picture is required" });
    // }

    // const profilePicUrl = file.path;

    // Create new client
    const newClient = new Client({
      fullname,
      email,
      phone,
      fathersname,
      profilePic: file?.path || null,
      age,
      gender,
      plan,
      planPrice,
      emergencyContact,
      status,
      address,
      discount,
      notes,
      membershipDeadline,
      createdAt,
    });

    await newClient.save();

    const memberId = await Client.findOne({ email });

    const newInvoice = new invoiceModel({
      memberId: memberId._id,
      name: fullname,
      amount: planPrice,
      date: createdAt,
      status: status,
      discount: discount || 0,
      whatsappNumber: phone,
    });
    await newInvoice.save();

    return res.status(201).json({
      message: "Client added successfully",
      client: newClient,
    });
  } catch (error) {
    console.error("Error adding client:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding client" });
  }
};
const editClient = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullname,
      email,
      phone,
      fathersname,
      age,
      gender,
      plan,
      planPrice,
      emergencyContact,
      discount,
      status,
      address,
      notes,
      renewPlan,
      renewDate,
    } = req.body;

    // Check for required fields
    const requiredFields = [
      fullname,
      email,
      phone,
      fathersname,
      age,
      gender,
      plan,
      planPrice,
      status,
      address,
    ];

    if (
      requiredFields.some(
        (field) => field === undefined || field === null || field === ""
      )
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find existing client
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Check for duplicate email or phone (excluding current client)
    if (client.email !== email || client.phone !== phone) {
      const existingClient = await Client.findOne({
        $or: [{ email }, { phone }],
        _id: { $ne: id },
      });

      if (existingClient) {
        return res.status(400).json({
          message: "Another client with this email or phone already exists",
        });
      }
    }

    // Update profile picture if uploaded
    if (req.file?.path) {
      client.profilePic = req.file.path;
    }

    // Update all client fields
    client.fullname = fullname;
    client.email = email;
    client.phone = phone;
    client.age = age;
    client.fathersname = fathersname;
    client.gender = gender;
    client.emergencyContact = emergencyContact;
    client.status = status;
    client.address = address;
    client.notes = notes;

    // Handle plan renewal if applicable
    if (renewPlan === true || renewPlan === "true") {
      const planLower = plan.trim().toLowerCase();
      const startDate = new Date(renewDate);
      const membershipDeadline = new Date(startDate);

      switch (planLower) {
        case "platinum":
          membershipDeadline.setMonth(startDate.getMonth() + 12);
          break;
        case "gold":
          membershipDeadline.setMonth(startDate.getMonth() + 6);
          break;
        case "standard":
          membershipDeadline.setMonth(startDate.getMonth() + 3);
          break;
        case "basic":
          membershipDeadline.setMonth(startDate.getMonth() + 1);
          break;
        default:
          return res.status(400).json({ message: "Invalid plan selected" });
      }

      client.plan = plan;
      client.planPrice = planPrice;
      client.membershipDeadline = membershipDeadline;
      

      // Create invoice
      const newInvoice = new invoiceModel({
        memberId: client._id,
        name: fullname,
        amount: planPrice,
        date: Date.now(),
        status: status,
        whatsappNumber: phone,
        discount:discount
      });
      await newInvoice.save();
    }

    await client.save();

    return res.status(200).json({
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating client" });
  }
};
const members = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // default limit is 5
    const clients = await Client.find().sort({ createdAt: -1 });

    return res.status(200).json({
      clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching clients" });
  }
};
const membersInfo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Client ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({ client });
  } catch (error) {
    console.error("Error fetching client info:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching client info" });
  }
};

const dashboard = async (req, res) => {
  try {
    const clients = await Client.find().lean();
    const invoices = await invoiceModel.find().lean();

    const totalRevenue = invoices.reduce((total, invoice) => {
      return total + (Number(invoice.amount) || 0);
    }, 0);

    res.json({
      clients: clients.length || 0,
      revenue: totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching dashboard data" });
  }
};

const revenueChart = async (req, res) => {
  try {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    // ================== MONTHLY REVENUE ==================
    const monthlyRevenueData = await invoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear, $lte: today },
        },
      },
      {
        $addFields: {
          yearMonth: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          netAmount: {
            $subtract: ["$amount", { $ifNull: ["$discount", 0] }],
          },
        },
      },
      {
        $group: {
          _id: "$yearMonth",
          totalRevenue: { $sum: "$netAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill 12 months
    function getLast12Months() {
      const months = [];
      const date = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        months.push({
          month: d.toLocaleString("default", { month: "short" }),
          yearMonth: key,
          totalRevenue: 0,
        });
      }
      return months;
    }

    const monthsTemplate = getLast12Months();
    const revenueMap = new Map(
      monthlyRevenueData.map((r) => [r._id, r.totalRevenue])
    );
    const monthlyRevenue = monthsTemplate.map((m) => ({
      month: m.month,
      totalRevenue: revenueMap.get(m.yearMonth) || 0,
    }));

    // ================== WEEKLY REVENUE ==================
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 27);

    const weeklyRevenue = await invoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: fourWeeksAgo },
        },
      },
      {
        $addFields: {
          isoWeek: { $isoWeek: "$createdAt" },
          isoYear: { $isoWeekYear: "$createdAt" },
          netAmount: {
            $subtract: ["$amount", { $ifNull: ["$discount", 0] }],
          },
        },
      },
      {
        $group: {
          _id: { week: "$isoWeek", year: "$isoYear" },
          totalRevenue: { $sum: "$netAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      {
        $addFields: {
          week: {
            $concat: [
              "Week ",
              { $toString: "$_id.week" },
              " (",
              { $toString: "$_id.year" },
              ")",
            ],
          },
        },
      },
      { $project: { _id: 0, week: 1, totalRevenue: 1 } },
    ]);

    // ================== DAILY REVENUE ==================
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const dailyRevenueData = await invoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $addFields: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          netAmount: {
            $subtract: ["$amount", { $ifNull: ["$discount", 0] }],
          },
        },
      },
      {
        $group: {
          _id: "$date",
          totalRevenue: { $sum: "$netAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill 7 days
    function getLast7Days() {
      const days = [];
      const date = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(date);
        d.setDate(date.getDate() - i);
        const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
        days.push({
          date: key,
          totalRevenue: 0,
        });
      }
      return days;
    }

    const daysTemplate = getLast7Days();
    const dailyMap = new Map(
      dailyRevenueData.map((r) => [r._id, r.totalRevenue])
    );
    const dailyRevenue = daysTemplate.map((d) => ({
      date: d.date,
      totalRevenue: dailyMap.get(d.date) || 0,
    }));

    // ================== RESPONSE ==================
    res.json({
      monthlyRevenue,
      weeklyRevenue,
      dailyRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching revenue data" });
  }
};

const addPlan = async (req, res) => {
  try {
    const { name, durations } = req.body;

    // Validation
    if (!name || !durations || !Array.isArray(durations)) {
      return res
        .status(400)
        .json({ message: "Name and durations are required" });
    }

    const existing = await planModel.findOne({ name });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Plan with this name already exists" });
    }

    const newPlan = await planModel.create({
      name,
      durations,
    });

    return res.status(201).json({
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    console.error("Error adding plan:", error);
    res.status(500).json({ message: "Server error while adding plan" });
  }
};
const getPlans = async (req, res) => {
  try {
    const plans = await planModel.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    console.error("Error fetching plans:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching plans",
    });
  }
};
const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Delete image from Cloudinary
    if (client.profilePic) {
      const publicId = getPublicIdFromUrl(client.profilePic);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete client from DB
    await Client.findByIdAndDelete(clientId);

    return res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting client" });
  }
};

const clientJoinChart = async (req, res) => {
  try {
    const now = new Date();

    // Dates
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6); // includes today

    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(now.getDate() - 27); // 4 weeks = 28 days

    // Monthly Joins (no filter, show all months)
    const monthlyJoins = await Client.aggregate([
      {
        $addFields: {
          monthNum: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$monthNum",
          totalJoins: { $sum: 1 },
        },
      },
      {
        $addFields: {
          monthName: {
            $arrayElemAt: [
              [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              "$_id",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$monthName",
          totalJoins: 1,
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Weekly Joins (last 4 weeks)
    const weeklyJoins = await Client.aggregate([
      {
        $match: {
          createdAt: { $gte: fourWeeksAgo },
        },
      },
      {
        $addFields: {
          week: {
            $concat: [
              "Week ",
              {
                $toString: {
                  $ceil: {
                    $divide: [
                      {
                        $subtract: [
                          { $dayOfYear: "$createdAt" },
                          { $dayOfYear: fourWeeksAgo },
                        ],
                      },
                      7,
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$week",
          totalJoins: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Daily Joins (last 7 days)
    const dailyJoins = await Client.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $addFields: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          totalJoins: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format the data
    const joinsByMonth = {};
    monthlyJoins.forEach(({ month, totalJoins }) => {
      joinsByMonth[month] = totalJoins;
    });

    const joinsByWeek = {};
    weeklyJoins.forEach(({ _id, totalJoins }) => {
      joinsByWeek[_id] = totalJoins;
    });

    res.send({ joinsByMonth, joinsByWeek, dailyJoins });
  } catch (error) {
    console.error("Client Join Error:", error);
    res.status(500).json({ message: "Error calculating client join trends." });
  }
};

module.exports = {
  addClient,
  dashboard,
  members,
  membersInfo,
  revenueChart,
  editClient,
  addPlan,
  getPlans,
  deleteClient,
  clientJoinChart,
};
