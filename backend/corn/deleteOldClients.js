const cron = require("node-cron");
const Client = require("../models/clientModel");
const invoiceModel = require("../models/invoiceModel");
const supplimentSales = require("../models/sale");
const cloudinary = require("cloudinary").v2;

// Schedule job: runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  const fiveYearsAgo = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000);

  const oldClients = await Client.find({ createdAt: { $lte: fiveYearsAgo } });

  for (const client of oldClients) {
    if (client.profilePic) {
      const publicId = client.profilePic
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0]; // "gym-members/pchipxcroki2nfhmv0zv"
      const del = await cloudinary.uploader.destroy(publicId);
    }

    // Remove from DB
    await Client.findByIdAndDelete(client._id);
  }

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const latestInvoice = await invoiceModel.find({
    createdAt: { $lte: threeDaysAgo },
  });

  for (const invoice of latestInvoice) {
    // Remove from Cloudinary
    if (invoice.invoicepdf) {
      const publicId = invoice.invoicepdf
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      console.log(publicId);
      const del = await cloudinary.uploader
        .destroy(`${publicId}.pdf`, {
          resource_type: "raw",
        })
        .then(async () => {
          await invoiceModel.findOneAndUpdate(
            { _id: invoice._id },
            { $set: { invoicepdf: "" } }
          );
        });
    }
  }

  const suppelimentInvoice = await supplimentSales.find({
    createdAt: { $lte: threeDaysAgo },
  });

  
  for (const invoice of suppelimentInvoice) {
    // Remove from Cloudinary
    if (invoice.invoicePdf) {
      const publicId = invoice.invoicePdf
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      // console.log(publicId);
      const del = await cloudinary.uploader
        .destroy(`${publicId}.pdf`, {
          resource_type: "raw",
        })
        .then(async () => {
          await supplimentSales.findOneAndUpdate(
            { _id: invoice._id },
            { $set: { invoicePdf: "" } }
          );
        });
    }
  }
});
