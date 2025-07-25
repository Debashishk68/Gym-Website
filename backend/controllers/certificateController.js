const {
  generateCertificate,
  generateId,
} = require("../utils/generateCertificate");
const path = require("path");
const Client = require("../models/clientModel");

const generateCertificateHandler = async (req, res) => {
  try {
    const { name, course, date, weightcategory, weightlift, place } = req.body;

    if (!name || !course) {
      return res.status(400).json({ message: "Name and course are required." });
    }

    const certificateBuffer = await generateCertificate(
      name,
      course,
      date,
      weightcategory,
      weightlift,
      place
    );
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${name.replace(/\s/g, "_")}_certificate.png"`
    );
    res.send(certificateBuffer);
  } catch (error) {
    console.error("Certificate Generation Error:", error);
    res.status(500).json({ message: "Failed to generate certificate." });
  }
};

const generateIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Person is not selected." });
    }
    const client = await Client.findById({ _id: id });

    if (!client)
      return res.status(400).json({ message: "Person is not exists." });

    const certificateBuffer = await generateId({
      id,
      name: client.fullname,
      time: client.createdAt,
      fatherName: client.fathersname,
      gender: client.gender,
      mobile: client.phone,
      address: client.address,
      emergencyContact: client.emergencyContact,
      profileImagePath: client.profilePic,
    });
    // const fileName = path.basename(filePath);

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${client.fullname.replace(/\s/g, "_")}_certificate.png"`
    );
   
    res.send(certificateBuffer);
  } catch (error) {
    console.error("Id Generation Error:", error);
    res.status(500).json({ message: "Failed to generate certificate." });
  }
};

module.exports = { generateCertificateHandler, generateIdHandler };
