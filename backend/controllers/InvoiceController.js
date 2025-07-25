const invoiceModel = require("../models/invoiceModel");
const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf-node");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const getInvoices = async (req, res) => {
  // const memberId = req.id.user;

  try {
    const invoices = await invoiceModel.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error.message);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

const generateInvoicePdf = async (req, res) => {
  try {
    const invoice = req.body;
    const formattedDate = new Date(invoice.date).toLocaleDateString("en-IN");

    const logoPath = path.join(__dirname, "../assets/logo.png");
    const logoData = fs.readFileSync(logoPath).toString("base64");

    const invoiceData = await invoiceModel
      .findById(invoice._id)
      .populate("memberId"); 
    console.log(invoiceData.memberId.address)

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            .header { display: flex; align-items: center; justify-content: space-between; }
            .header img { height: 80px; filter: grayscale(100%); }
            .title { font-size: 28px; font-weight: bold; }
            .info, .footer { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
            .footer { margin-top: 40px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="data:image/png;base64,${logoData}" alt="Logo" />
            <div class="title">Invoice</div>
          </div>

          <div class="info">
            <p><strong>From:</strong> Iron Core Fitness Center<br>
               123 Iron Street, Muscle Area, Jamshedpur, 831001, India</p>

            <p><strong>To:</strong> ${invoice.name}<br>
               ${invoiceData.memberId.address || "Not Provided"},
              
    </p>

            <p><strong>Invoice ID:</strong> ${
              invoice._id?.slice(0, 8).toUpperCase() || "IN2434345"
            }</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.description || "Gym Membership Plan"}</td>
                <td>1</td>
                <td>${invoice.amount || 0}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p><strong>Payment Status:</strong> ${
              invoice.status || "Pending"
            }</p>
            <p><strong>Contact:</strong> +91 ${invoice.whatsappNumber}</p>
          </div>
        </body>
      </html>
    `;

    // Generate PDF buffer
    const options = { format: "A4" };
    const file = { content: htmlContent };
    const buffer = await pdf.generatePdf(file, options);

    // Upload PDF to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // ✅ Must be 'raw' for PDFs
          folder: "invoices",
          public_id: `invoice_${invoice._id}`,
          format: "pdf",
          use_filename: true,
          type: "upload",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // Success response
    return res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (err) {
    console.error("PDF generation/upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate and upload invoice",
    });
  }
};

module.exports = { getInvoices, generateInvoicePdf };
