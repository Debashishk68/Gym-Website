const Client = require("../models/clientModel");
const mongoose = require("mongoose");

const addClient = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
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
    membershipDeadline.setMonth(membershipDeadline.getMonth() + 2);

    // Check for duplicate
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
      profilePic: profilePicUrl,
      age,
      gender,
      plan,
      planPrice,
      emergencyContact,
      status,
      address,
      notes,
      membershipDeadline
    });

    await newClient.save();

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
    const yearlyRevenue = await Client.aggregate([
      {
        $addFields: {
          year: { $year: "$joinedAt" },
        },
      },
      {
        $group: {
          _id: "$year",
          totalRevenue: { $sum: "$planPrice" },
        },
      },
      {
        $sort: { _id: 1 }, // sort by year ascending
      },
    ]);

    res.send(yearlyRevenue);
  } catch (error) {
    console.error("Revenue Error:", error);
    res.status(500).json({ message: "Error calculating revenue." });
  }
};

module.exports = { addClient, dashboard, members, membersInfo, revenueChart };
