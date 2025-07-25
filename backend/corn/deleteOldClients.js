const cron = require("node-cron");
const Client = require("../models/clientModel");
const cloudinary = require("cloudinary").v2;

// Schedule job: runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  const fiveYearsAgo = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000);

  const oldClients = await Client.find({ createdAt: { $lte: fiveYearsAgo } });

  for (const client of oldClients) {
    // console.log(client.profilePic)
    // Remove from Cloudinary
    if (client.profilePic) {
      const publicId = client.profilePic
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0]; // "gym-members/pchipxcroki2nfhmv0zv"
      const del = await cloudinary.uploader.destroy(publicId);
      console.log("delete", del);
    }

    // Remove from DB
    await Client.findByIdAndDelete(client._id);
    console.log(`Deleted client ${client.fullname}`);
  }
});
