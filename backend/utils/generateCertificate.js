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
    <svg width="5000" height="2000">
      <text x="3000" y="200" text-anchor="middle" font-family="Times New Roman" font-size="200" fill="#3A6399">${course}</text>
      <text x="2200" y="440" text-anchor="middle" font-family="Times New Roman" font-size="170" fill="#000000">${name}</text>
      <text x="1320" y="630" text-anchor="middle" font-family="Times New Roman" font-size="110" fill="#000000">${course}</text>
      <text x="2900" y="630" text-anchor="middle" font-family="Times New Roman" font-size="100" fill="#000000">${date}</text>
      <text x="2100" y="1190" text-anchor="middle" font-family="Times New Roman" font-size="120" fill="#000000">${weightcategory}</text>
      <text x="3500" y="1190" text-anchor="middle" font-family="Times New Roman" font-size="120" fill="#000000">${weightlift}</text>
      <text x="4720" y="1190" text-anchor="middle" font-family="Times New Roman" font-size="120" fill="#000000">${place}</text>
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
  profileImagePath, // Cloudinary URL
}) => {
  const baseImagePath = path.join(__dirname, "templates", "ID.png");
  const fontPath = path.join(__dirname, "fonts", "Tinos-Regular.ttf");

  if (!fs.existsSync(fontPath)) {
    throw new Error("Font file not found.");
  }
  const fontData = fs.readFileSync(fontPath);
  const fontBase64 = fontData.toString("base64");

  if (!fs.existsSync(baseImagePath)) {
    throw new Error("ID template not found.");
  }

  // Download profile image from Cloudinary
  let profileImageBuffer;
  try {
    const response = await axios.get(profileImagePath, {
      responseType: "arraybuffer",
    });
    profileImageBuffer = Buffer.from(response.data);
  } catch (error) {
    throw new Error("Failed to fetch profile image from Cloudinary.");
  }

  // Circular crop
  const profileCircle = await sharp(profileImageBuffer)
    .resize(650, 650)
    .composite([
      {
        input: Buffer.from(
          `<svg width="650" height="650">
             <circle cx="325" cy="325" r="325" fill="white"/>
           </svg>`
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  // SVG text overlay with embedded font
  const svgOverlay = `
    <svg width="1600" height="3000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style type="text/css">
          @font-face {
            font-family: 'CustomFont';
            src: url('data:font/truetype;charset=utf-8;base64,${fontBase64}') format('truetype');
          }
          .field {
            font-family: 'CustomFont';
            fill: #000;
            font-size: 80px;
          }
          .bold {
            font-family: 'CustomFont';
            font-weight: bold;
            font-size: 90px;
          }
        </style>
      </defs>

      <text x="900" y="600" text-anchor="middle" class="bold">${name}</text>
      <text x="930" y="1010" class="field">${fatherName}</text>
      <text x="700" y="1156" class="field">${gender}</text>
      <text x="930" y="1315" class="field">${mobile}</text>
      <text x="700" y="1460" class="field">${address}</text>
      <text x="730" y="2150" font-family="CustomFont" font-size="80" fill="#FFFFFF">${emergencyContact}</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svgOverlay);

  // Combine base image + profile image + text overlay
  const finalBuffer = await sharp(baseImagePath)
    .composite([
      { input: profileCircle, left: 650, top: 730 },
      { input: svgBuffer, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  return finalBuffer;

  // Optional: Save to file if needed
  // const outputPath = path.join(__dirname, "..", "ids", `${id.replace(/\s/g, "_")}_id_card.png`);
  // await sharp(finalBuffer).toFile(outputPath);
};

module.exports = { generateCertificate, generateId };
