const Supplement = require("../models/supplimentModel");
const SupplementSale = require("../models/sale");
const { generateSupplementInvoicePdf } = require("./InvoiceController");

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
      return res
        .status(404)
        .json({ success: false, message: "Supplement not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplement deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete supplement",
      error: error.message,
    });
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
      return res
        .status(404)
        .json({ success: false, message: "Supplement not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplement updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update supplement",
      error: error.message,
    });
  }
};

const sellingData = async (req, res) => {
  try {
    const sales = await SupplementSale.find({})
      .sort({ createdAt: -1 })
      .select(
        "customerName mobileNumber supplementName quantity total invoicePdf createdAt amountDue"
      ); // select only necessary fields for performance

    return res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching supplement sales:", error);
    return res.status(500).json({
      message: "Failed to fetch sales data",
      error: error.message,
    });
  }
};
const sellSupplement = async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      email,
      weight,
      modeOfPayment,
      amountPaid = 0,
      supplements = [],
    } = req.body;
    console.log(req.body)
    // Validate main fields
    if (!customerName || !mobileNumber || !modeOfPayment || supplements.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let total = 0;
    let totalDiscount = 0;
    const supplementIdList = [];
    const supplementNameList = [];

    // Loop through each supplement
    for (const item of supplements) {
      const {
        supplementId,
        name,
        quantity,
        mrp,
        discountPercent = 0,
      } = item;

      if (!supplementId || !quantity || !mrp) {
        return res.status(400).json({ message: "Invalid supplement data" });
      }

      const supplement = await Supplement.findById(supplementId);
      if (!supplement) {
        return res.status(404).json({ message: `Supplement not found: ${name}` });
      }

      if (supplement.stock < quantity) {
        return res.status(400).json({
          message: `Only ${supplement.stock} units left for ${supplement.name}`,
        });
      }

      // Price calculation
      const discountPerUnit = (mrp * discountPercent) / 100;
      const unitPrice = mrp - discountPerUnit;
      const itemTotal = unitPrice * quantity;
      const itemDiscount = discountPerUnit * quantity;

      total += itemTotal;
      totalDiscount += itemDiscount;

      // Reduce stock
      supplement.stock -= quantity;
      await supplement.save();

      // Collect for sale record
      supplementIdList.push(supplementId);
      supplementNameList.push(name);
    }

    const amountDue = total - amountPaid;

    // Save sale record
    const sale = new SupplementSale({
      customerName,
      mobileNumber,
      emailAddress: email,
      weightKg: weight,
      supplementName: supplementNameList,
      supplementId: supplementIdList,
      quantity: supplements.reduce((sum, s) => sum + s.quantity, 0),
      modeOfPayment: modeOfPayment,
      mrp: 0, // Irrelevant here, could be averaged if needed
      discountPercent: 0,
      unitPrice: 0,
      total,
      totalDiscount,
      amountPaid,
      amountDue,
    });

    await sale.save();

    return res.status(201).json({
      message: "Supplements sold successfully",
      data: sale,
    });

  } catch (error) {
    console.error("Sell Supplement Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addSuppliment,
  getAllSupplements,
  deleteSupplement,
  updateSupplement,
  getSupplementById,
  sellSupplement,
  sellingData,
};
