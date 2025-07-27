const Supplement = require("../models/supplimentModel");
const SupplementSale = require("../models/sale")

const addSuppliment = async (req, res) => {
  try {
    const { name, price, stock, weight, company } = req.body;

    const newSupplement = new Supplement({
      name,
      price,
      stock,
      weight,
      company,
    });

    await newSupplement.save();

    res.status(201).json({
      success: true,
      message: "Supplement added successfully",
      data: newSupplement,
    });
  } catch (error) {
    console.error("Error adding supplement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add supplement",
      error: error.message,
    });
  }
};

const getAllSupplements = async (req, res) => {
  try {
    const supplements = await Supplement.find();

    res.status(200).json({
      success: true,
      data: supplements,
    });
  } catch (error) {
    console.error("Error fetching supplements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch supplements",
      error: error.message,
    });
  }
};

const getSupplementById = async (req, res) => {
  const { id } = req.params; 

  try {
    const supplement = await Supplement.findById(id); 

    if (!supplement) {
      return res.status(404).json({
        success: false,
        message: "Supplement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: supplement,
    });
  } catch (error) {
    console.error("Error fetching supplement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch supplement",
      error: error.message,
    });
  }
};

const deleteSupplement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Supplement.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Supplement not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplement deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete supplement", error: error.message });
  }
};

const updateSupplement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Supplement.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Supplement not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplement updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Failed to update supplement", error: error.message });
  }
};

const sellSupplement = async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      email,
      weight,
      company,
      supplementName,
      supplementId,
      quantity,
      paymentMode,
    } = req.body;
    

    const supplement = await Supplement.findById(supplementId);

    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }

    if (supplement.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // Reduce stock
    supplement.stock -= quantity;
    await supplement.save();

    const sale = new SupplementSale({
      customerName,
      mobileNumber,
      emailAddress:email,
      weightKg:weight,
      company,
      supplementName,
      supplementId,
      quantity,
      modeOfPayment:paymentMode,
    });

    await sale.save();

    res.status(201).json({ message: "Supplement sold successfully", data: sale });
  } catch (error) {
    console.error("Sell Error:", error);
    res.status(500).json({ message: "Failed to sell supplement", error: error.message });
  }
};
module.exports = { addSuppliment , getAllSupplements, deleteSupplement,updateSupplement,getSupplementById,sellSupplement};
