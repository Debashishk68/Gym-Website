const Client = require("../models/clientModel");
const invoiceModel = require("../models/invoiceModel");
const planModel = require("../models/planModel");
const mongoose = require("mongoose");
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
      status,
      address,
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
      !emergencyContact ||
      !status ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startDate = new Date();
    const membershipDeadline = new Date(startDate);

    if (plan.trim().toLowerCase() === "platinum") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 12);
    } else if (plan.trim().toLowerCase() === "gold") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 6);
    } else if (plan.trim().toLowerCase() === "standard") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 3);
    } else if (plan.trim().toLowerCase() === "base") {
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
    if (!file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const profilePicUrl = file.path;

    // Create new client
    const newClient = new Client({
      fullname,
      email,
      phone,
      fathersname,
      profilePic: profilePicUrl,
      age,
      gender,
      plan,
      planPrice,
      emergencyContact,
      status,
      address,
      notes,
      membershipDeadline,
    });

    await newClient.save();

    const memberId = await Client.findOne({email})

    const newInvoice = new invoiceModel({
      memberId:memberId._id,
      name: fullname,
      amount: planPrice,
      date: Date.now(),
      status: status,
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
      status,
      address,
      notes,
      renewPlan,
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
      !emergencyContact ||
      !status ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const startDate = new Date();
    const membershipDeadline = new Date(startDate);

    if (plan.trim().toLowerCase() === "platinum") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 12);
    } else if (plan.trim().toLowerCase() === "gold") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 6);
    } else if (plan.trim().toLowerCase() === "standard") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 3);
    } else if (plan.trim().toLowerCase() === "base") {
      membershipDeadline.setMonth(membershipDeadline.getMonth() + 1);
    } else {
      console.error("Invalid plan selected");
    }

    // Find client
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // If email or phone is changed, check for duplicate
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

    // Handle profile image (optional)
    if (req.file) {
      client.profilePic = req.file.path; // Uploaded via multer + cloudinary
    }

    // Update fields
    client.fullname = fullname;
    client.email = email;
    client.phone = phone;
    client.age = age;
    client.fathersname = fathersname;
    client.gender = gender;
    client.plan = plan;
    client.planPrice = planPrice;
    client.emergencyContact = emergencyContact;
    client.status = status;
    client.address = address;
    client.notes = notes;
    if (renewPlan) {
      client.membershipDeadline = membershipDeadline;
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
    const clients = await Client.find()
      .sort({ createdAt: -1 }) // latest first
      .limit(limit);

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
    const clients = await Client.find();

    res.send({
      clients: clients.length || 0,
      revenue: clients.reduce((total, client) => {
        return total + (client.planPrice || 0);
      }, 0),
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching clients" });
  }
};
const revenueChart = async (req, res) => {
  try {
    const monthlyRevenue = await Client.aggregate([
      {
        $addFields: {
          monthNum: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$monthNum",
          totalRevenue: { $sum: "$planPrice" },
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
          totalRevenue: 1,
        },
      },
      {
        $sort: { monthNum: 1 },
      },
    ]);

    const weeklyRevenue = await Client.aggregate([
      {
        $addFields: {
          dayOfMonth: { $dayOfMonth: "$createdAt" },
        },
      },
      {
        $addFields: {
          week: {
            $concat: [
              "Week ",
              {
                $toString: {
                  $ceil: { $divide: ["$dayOfMonth", 7] },
                },
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$week",
          totalRevenue: { $sum: "$planPrice" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dailyRevenue = await Client.aggregate([
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
          totalRevenue: { $sum: "$planPrice" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Convert to object format like { "2025-07-01": 1500, ... }
    const revenueByDay = {};
    dailyRevenue.forEach(({ _id, totalRevenue }) => {
      revenueByDay[_id] = totalRevenue;
    });

    // Convert to object format like { "Week 1": 1500, ... }
    const revenueByWeek = {};
    weeklyRevenue.forEach(({ _id, totalRevenue }) => {
      revenueByWeek[_id] = totalRevenue;
    });

    // Convert array to object like { Jan: 1500, Feb: 2100, ... }
    const revenueByMonth = {};
    monthlyRevenue.forEach(({ month, totalRevenue }) => {
      revenueByMonth[month] = totalRevenue;
    });

    res.send({ revenueByMonth, revenueByWeek, dailyRevenue });
  } catch (error) {
    console.error("Revenue Error:", error);
    res.status(500).json({ message: "Error calculating monthly revenue." });
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
      await cloudinary.uploader.destroy(client.profilePic);
    }

    // Delete client from DB
    await Client.findByIdAndDelete(clientId);

    return res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return res.status(500).json({ message: "Server error while deleting client" });
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
  deleteClient
};
