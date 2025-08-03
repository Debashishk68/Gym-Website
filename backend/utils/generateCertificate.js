const { createCanvas, loadImage } = require("@napi-rs/canvas");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const fetchImage = async (urlOrPath) => {
  if (urlOrPath.startsWith("http")) {
    const response = await axios.get(urlOrPath, { responseType: "arraybuffer" });
    return await loadImage(Buffer.from(response.data));
  } else {
    return await loadImage(path.resolve(urlOrPath));
  }
};

// Draw helper
const drawText = (ctx, text, x, y, fontSize = 40, color = "#000", align = "center") => {
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};

// 🎓 CERTIFICATE GENERATOR
const generateCertificate = async (name, course, date, weightcategory, weightlift, place, profileImagePath) => {
  const baseImagePath = path.resolve(__dirname, "templates", "base.png");

  if (!fs.existsSync(baseImagePath)) throw new Error("base.png not found");
  const baseImage = await loadImage(baseImagePath);

  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0);

  // Optional profile image
  if (profileImagePath) {
    const res = await axios.get(profileImagePath, { responseType: "arraybuffer" });
    const profileBuffer = Buffer.from(res.data);
    const profileImage = await loadImage(profileBuffer);
    ctx.drawImage(profileImage, 80, 80, 180, 180); // top-left profile
  }

  // Certificate text drawing
  drawText(ctx, course, 3000, 1820, 180, "#3A6399");
  drawText(ctx, name, 2200, 2160, 120);
  drawText(ctx, course, 1320, 2330, 80);
  drawText(ctx, date, 2900, 2330, 80);
  drawText(ctx, weightcategory, 2100, 2890, 100);
  drawText(ctx, weightlift, 3500, 2890, 100);
  drawText(ctx, place, 4720, 2890, 100);

  return canvas.toBuffer("image/png");
};

// 🪪 ID CARD GENERATOR
// Generate ID Function
const generateId = async ({
  name,
  fatherName,
  gender,
  mobile,
  address,
  emergencyContact,
  profileImagePath,
}) => {
  try {
    const baseImagePath = path.resolve(__dirname, "templates", "ID.png");

    if (!fs.existsSync(baseImagePath)) throw new Error("ID template not found");

    const baseImage = await loadImage(baseImagePath);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(baseImage, 0, 0);

    // Load and draw profile picture in a circular crop
    if (profileImagePath) {
      const response = await axios.get(profileImagePath, { responseType: "arraybuffer" });
      const profileBuffer = Buffer.from(response.data);
      const profileImage = await loadImage(profileBuffer);

      ctx.save();
      ctx.beginPath();
      ctx.arc(975, 1055, 325, 0, Math.PI * 2); // Circle for profile
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(profileImage, 650, 730, 650, 650); // Draw profile image
      ctx.restore();
    }

    // Draw details
    drawText(ctx, name, 900, 1500, 90);
    drawText(ctx, fatherName, 930, 1910, 80, "#000", "left");
    drawText(ctx, gender, 700, 2060, 80, "#000", "left");
    drawText(ctx, mobile, 930, 2215, 80, "#000", "left");
    drawText(ctx, address, 700, 2360, 80, "#000", "left");
    drawText(ctx, emergencyContact, 730, 3050, 50, "#fff", "left");

    return canvas.toBuffer("image/png");
  } catch (error) {
    console.error("ID generation failed:", error.message);
    throw new Error("ID generation failed.");
  }
};

module.exports = { generateCertificate, generateId };
