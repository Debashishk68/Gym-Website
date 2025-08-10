const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// console.log(path.join(__dirname, "fonts", "Tinos-Regular.ttf"))
// Register Roboto_SemiCondensed-Regular font
registerFont(
  path.join(__dirname, "../fonts/Poppins-Regular.ttf"),
  {
    family: "PoppinsCustom",
  }
);


// Helper function to draw styled text
function drawText(
  ctx,
  text,
  x,
  y,
  size = 40,
  color = "#000",
  align = "center"
) {
  ctx.fillStyle = color;
  ctx.font = `${size}px "PoppinsCustom"`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

// Certificate Generator
const generateCertificate = async (
  name,
  course,
  date,
  weightcategory,
  weightlift,
  place,
  level
) => {
  const image = level==="State Level"?"state.png":"destrict.png";
  const baseImagePath = path.resolve(__dirname, "templates", image);

  if (!fs.existsSync(baseImagePath)) throw new Error("base.png not found");

  const baseImage = await loadImage(baseImagePath);

  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0);

  // Draw certificate text
  drawText(ctx, course, 960, 600, 80, "#3A6399");
  drawText(ctx, name, 740, 740, 60);
  drawText(ctx, course, 510, 845, 40);
  drawText(ctx, date, 1520, 845, 38);
  drawText(ctx, weightcategory, 700, 1033, 45);
  drawText(ctx, weightlift, 1130, 1033, 45);
  drawText(ctx, place, 1520, 1033,40);

  return canvas.toBuffer("image/png");
};

// ID Card Generator
const generateId = async ({
  name,
  fatherName,
  gender,
  mobile,
  address,
  emergencyContact,
  profileImagePath,
}) => {
  const baseImagePath = path.resolve(__dirname, "templates", "ID.png");

  if (!fs.existsSync(baseImagePath)) throw new Error("ID.png not found");

  const baseImage = await loadImage(baseImagePath);

  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0);

  // Download and draw profile image in a circle
  if (profileImagePath) {
    const profileRes = await axios.get(profileImagePath, {
      responseType: "arraybuffer",
    });
    const profileBuffer = Buffer.from(profileRes.data);
    const profileImage = await loadImage(profileBuffer);

    ctx.save();
    ctx.beginPath();
    ctx.arc(975, 1055, 325, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(profileImage, 650, 730, 650, 650);
    ctx.restore();
  }

  // Draw ID text
  drawText(ctx, name, 900, 1500, 90);
  drawText(ctx, fatherName, 930, 1910, 80, "#000", "left");
  drawText(ctx, gender, 700, 2060, 80, "#000", "left");
  drawText(ctx, mobile, 930, 2215, 80, "#000", "left");
  drawText(ctx, address, 700, 2360, 80, "#000", "left");
  if (emergencyContact) {
    drawText(ctx, emergencyContact, 730, 3050, 50, "#fff", "left");
  }
  return canvas.toBuffer("image/png");
};

module.exports = {
  generateCertificate,
  generateId,
};
