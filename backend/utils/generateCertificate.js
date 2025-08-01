const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const generateCertificate = async (
  name,
  course,
  date,
  weightcategory,
  weightlift,
  place
) => {
  const baseImagePath = path.join(__dirname, "templates", "base.png");
  if (!fs.existsSync(baseImagePath)) throw new Error("Base image not found.");

  const svgOverlay = `
    <svg width="5000" height="2000" xmlns="http://www.w3.org/2000/svg">
      <style>
        text { font-family: sans-serif; }
      </style>
      <text x="3000" y="200" text-anchor="middle" font-size="200" fill="#3A6399">${course}</text>
      <text x="2200" y="440" text-anchor="middle" font-size="170" fill="#000000">${name}</text>
      <text x="1320" y="630" text-anchor="middle" font-size="110" fill="#000000">${course}</text>
      <text x="2900" y="630" text-anchor="middle" font-size="100" fill="#000000">${date}</text>
      <text x="2100" y="1190" text-anchor="middle" font-size="120" fill="#000000">${weightcategory}</text>
      <text x="3500" y="1190" text-anchor="middle" font-size="120" fill="#000000">${weightlift}</text>
      <text x="4720" y="1190" text-anchor="middle" font-size="120" fill="#000000">${place}</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svgOverlay);

  const certificateBuffer = await sharp(baseImagePath)
    .composite([{ input: svgBuffer, top: 1700, left: 0 }])
    .png()
    .toBuffer();

  return certificateBuffer;
};

const generateId = async ({
  id,
  name,
  time,
  fatherName,
  gender,
  mobile,
  address,
  emergencyContact,
  profileImagePath,
}) => {
  const baseImagePath = path.join(__dirname, "templates", "ID.png");

  if (!fs.existsSync(baseImagePath)) {
    throw new Error("ID template not found.");
  }

  let profileImageBuffer;
  try {
    const response = await axios.get(profileImagePath, {
      responseType: "arraybuffer",
    });
    profileImageBuffer = Buffer.from(response.data);
  } catch (error) {
    throw new Error("Failed to fetch profile image from Cloudinary.");
  }

  const profileCircle = await sharp(profileImageBuffer)
    .resize(650, 650)
    .composite([
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg"><circle cx="325" cy="325" r="325" fill="white"/></svg>`
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const svgOverlay = `
    <svg width="1600" height="3000" xmlns="http://www.w3.org/2000/svg">
      <style>
        text { font-family: sans-serif; fill: #000000; }
      </style>
      <text x="900" y="600" text-anchor="middle" font-size="90" font-weight="bold">${name}</text>
      <text x="930" y="1010" font-size="80">${fatherName}</text>
      <text x="700" y="1156" font-size="80">${gender}</text>
      <text x="930" y="1315" font-size="80">${mobile}</text>
      <text x="700" y="1460" font-size="80">${address}</text>
      <text x="730" y="2150" font-size="80" fill="#FFFFFF">${emergencyContact}</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svgOverlay);

  const finalBuffer = await sharp(baseImagePath)
    .composite([
      { input: profileCircle, left: 650, top: 730 },
      { input: svgBuffer, top: 900, left: 0 },
    ])
    .png()
    .toBuffer();

  return finalBuffer;
};

module.exports = { generateCertificate, generateId };
