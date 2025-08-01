const invoiceModel = require("../models/invoiceModel");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const convertToWords = require("../utils/convertToWords");
const saleModel = require("../models/sale");
const supplimentModel = require("../models/supplimentModel");

const getInvoices = async (req, res) => {
  try {
    const invoices = await invoiceModel.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error.message);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

async function launchBrowser() {
  return await puppeteer.launch({
    args: chromium.args,
    executablePath:
      (await chromium.executablePath) || "/usr/bin/chromium-browser",
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  });
}

const generateInvoicePdf = async (req, res) => {
  try {
    const invoice = req.body;
    const formattedDate = new Date(invoice.date).toLocaleDateString("en-IN");

    const logoData = await fetch(
      "https://res.cloudinary.com/dn5z4mi3i/image/upload/v1754045509/Gym-Logo_zu78uv.png"
    )
      .then((res) => res.arrayBuffer())
      .then((buffer) => Buffer.from(buffer).toString("base64"));

    const invoiceData = await invoiceModel
      .findById(invoice._id)
      .populate("memberId");

    const planDurations = {
      Platinum: "12 months",
      Gold: "6 months",
      Standard: "3 months",
    };
    const plan = invoiceData.memberId?.plan;
    const planDuration = planDurations[plan] || "1 month";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
            body { font-family: 'Roboto', sans-serif; padding: 40px; color: #333; font-size: 14px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
            .logo { height: 100px; object-fit: contain; }
            .gym-info { line-height: 0.8; }
            h1 { text-align: center; font-size: 26px; text-transform: uppercase; margin-bottom: 30px; border-bottom: 1px solid #aaa; padding-bottom: 10px; }
            .info-section { margin-bottom: 25px; }
            .info-section p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
            thead th { background-color: #f2f2f2; font-weight: bold; }
            .footer { margin-top: 40px; font-size: 13px; border-top: 1px dashed #aaa; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="gym-info">
              <h2>AB Fitness Gym</h2>
              <p>Joraphatak Road, Dhanbad</p>
              <p>Jharkhand - 826001</p>
              <p>Email:Abfit1999@gmail.com</p>
              <p>Phone: +91 9534349922</p>
            </div>
            <img src="data:image/png;base64,${logoData}" alt="Logo" class="logo" />
          </div>

          <h1>Tax Invoice</h1>
          <div class="info-section">
            <p><strong>Member Name:</strong> ${invoice.name}</p>
            <p><strong>Date of Admission:</strong> ${formattedDate}</p>
            <p><strong>Invoice ID:</strong> ${invoice._id.toUpperCase()}</p>
            <p><strong>Address:</strong> ${
              invoiceData.memberId?.address || "Not Provided"
            }</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Plan Duration</th>
                <th>Qty</th>
                <th>Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>${invoice.description || "Gym Membership Plan"}</td>
                <td>${planDuration}</td>
                <td>1</td>
                <td>${invoice.amount || 0}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align:right;"><strong>Total</strong></td>
                <td><strong>${invoice.amount || 0}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p><strong>Payment Status:</strong> ${
              invoice.status || "Pending"
            }</p>
            <p><strong>Contact (WhatsApp):</strong> +91 ${
              invoice.whatsappNumber
            }</p>
            <p>Thank you for choosing AB Fitness Gym!</p>
          </div>
        </body>
      </html>
    `;

    // Use chromium-compatible Puppeteer
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const buffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    const uploadResponse = await new Promise((resolve, reject) => {
      streamifier.createReadStream(buffer).pipe(
        cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "invoices",
            public_id: `invoice_${invoice._id}`,
            format: "pdf",
            use_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
      );
    });

    await invoiceModel.findByIdAndUpdate(invoice._id, {
      invoicepdf: uploadResponse.secure_url,
    });

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
      error: err.message,
    });
  }
};

const generateSupplementInvoicePdf = async (req, res) => {
  const id = req.params.id;

  try {
    const sale = await saleModel.findById(id);
    if (!sale) throw new Error("Sale not found");

    const suppliment = await supplimentModel.findById(sale.supplementId);
    if (!suppliment) throw new Error("Supplement not found");

    const formattedDate = new Date(sale.date || Date.now()).toLocaleDateString(
      "en-IN"
    );
    const logoData = await fetch(
      "https://res.cloudinary.com/dn5z4mi3i/image/upload/v1754045510/Logo_xzlyug.png"
    )
      .then((res) => res.arrayBuffer())
      .then((buffer) => Buffer.from(buffer).toString("base64"));

    const mrp = sale.mrp || suppliment.price || 0;
    const discountPercent = sale.discountPercent || 0;
    const quantity = sale.quantity || 1;
    const unitPrice = sale.unitPrice || mrp;
    const subtotal = mrp * quantity;
    const totalDiscount = (mrp - unitPrice) * quantity;
    const total = unitPrice * quantity;
    const saved = totalDiscount;

    const receivedAmount = sale.amountPaid || total;

    // Get other unpaid sales for this customer
    const previousDues = await saleModel.find({
      mobileNumber: sale.mobileNumber,
      _id: { $ne: sale._id },
      amountDue: { $gt: 0 },
    });

    const previousDueAmount = previousDues.reduce(
      (acc, curr) => acc + (curr.amountDue || 0),
      0
    );
    const totalPayable = total + previousDueAmount;
    const currentBalance = totalPayable - receivedAmount;

    const htmlContent = `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
            padding: 30px 40px;
            color: #333;
            font-size: 13px;
          }
          .top-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #444;
            padding-bottom: 8px;
            margin-bottom: 20px;
          }
          .left-info {
            font-size: 12px;
            line-height: 1.4;
          }
          .logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }
          h1 {
            text-align: center;
            font-size: 20px;
            margin: 5px 0 15px 0;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            text-transform: uppercase;
          }
          .invoice-info {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            page-break-inside: avoid;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: center;
          }
          thead th {
            background-color: #eee;
            font-weight: bold;
          }
          .footer-summary {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            font-size: 13px;
            page-break-inside: avoid;
          }
          .footer-summary div {
            width: 49%;
          }
          .summary-table td {
            padding: 5px 8px;
          }
          .highlight {
            background: #d9e0df;
            font-weight: bold;
          }
          .terms {
            margin-top: 20px;
            font-size: 12px;
            line-height: 1.5;
          }
          .sign {
            margin-top: 30px;
            text-align: right;
            font-weight: bold;
          }
          .header-text {
            font-size: 26px;
            font-weight: bold;
          }
          ul {
            padding-left: 18px;
          }
        </style>
      </head>
      <body>
        <div class="top-header">
          <div class="left-info">
            <strong class="header-text">AB SUPPLIMENT HUB</strong><br/>
            Howrah Motor Joraphatak Road Dhanbad, Jharkhand<br/>
            Phone: 9534349922<br/>
            Email: Abfit1999@gmail.com<br/>
            GSTIN: 20AEFPS1805N1ZV<br/>
            State: Jharkhand
          </div>
          <img class="logo" src="data:image/png;base64,${logoData}" />
        </div>

        <h1>Tax Invoice</h1>

        <div class="invoice-info">
          <div>
            <p><strong>Bill To:</strong></p>
            <p>${sale.customerName}</p>
            <p>Mobile: ${sale.mobileNumber}</p>
          </div>
          <div>
            <p><strong>Invoice No:</strong> ${
              sale.invoiceNo || `INV${Date.now()}`
            }</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Due</th>
              <th>MRP</th>
              <th>Discount (%)</th>
              <th>Qty</th>
              <th>Price/Unit</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>${suppliment.name}</td>
              <td>₹ ${previousDueAmount.toFixed(2)}</td>
              <td>₹ ${mrp.toFixed(2)}</td>
              <td>${discountPercent}%</td>
              <td>${quantity}</td>
              <td>₹ ${unitPrice.toFixed(2)}</td>
              <td>₹ ${total.toFixed(2)}</td>
            </tr>
            <tr class="highlight">
              <td colspan="4">Total</td>
              <td>₹ ${totalDiscount.toFixed(2)}</td>
              <td>${quantity}</td>
              <td></td>
              <td>₹ ${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer-summary">
          <div>
            <p><strong>Invoice Amount (in words):</strong><br/>${convertToWords(
              totalPayable
            )} only</p>
          </div>
          <div>
            <table class="summary-table">
              <tr><td>Sub Total (Before Discount)</td><td>₹ ${subtotal.toFixed(
                2
              )}</td></tr>
              <tr><td>Discount (${discountPercent}%)</td><td>₹ ${totalDiscount.toFixed(
      2
    )}</td></tr>
              <tr><td>Previous Due</td><td>₹ ${previousDueAmount.toFixed(
                2
              )}</td></tr>
              <tr class="highlight"><td>Total Payable</td><td>₹ ${totalPayable.toFixed(
                2
              )}</td></tr>
              <tr><td>Received</td><td>₹ ${receivedAmount.toFixed(2)}</td></tr>
              <tr><td>Balance (Due)</td><td>₹ ${currentBalance.toFixed(
                2
              )}</td></tr>
            </table>
          </div>
        </div>

        <div class="terms">
          <p><strong>You Saved:</strong> ₹ ${saved.toFixed(2)}</p>
          <p><strong>Previous Due:</strong> ₹ ${previousDueAmount.toFixed(
            2
          )}</p>
          <p><strong>Current Due:</strong> ₹ ${currentBalance.toFixed(2)}</p>
          <p><strong>Mode of Payment:</strong> ${sale.modeOfPayment}</p>
          <p><strong>Terms & Conditions:</strong></p>
          <ul>
            <li>Goods once sold will not be taken back or exchanged.</li>
            <li>Please check the product before leaving the counter.</li>
          </ul>
          <p>Thanks for doing business with us.</p>
        </div>

        <p class="sign">AB SUPPLIMENT HUB<br/><br/>Authorized Signatory</p>
      </body>
    </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const buffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Upload PDF to Cloudinary
    const cloudRes = await new Promise((resolve, reject) => {
      streamifier.createReadStream(buffer).pipe(
        cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "invoices",
            public_id: `invoice_${sale._id}`,
            format: "pdf",
          },
          (err, result) => (err ? reject(err) : resolve(result))
        )
      );
    });

    // Update sale record
    sale.invoicePdf = cloudRes.secure_url;
    sale.amountDue = currentBalance;
    let remainingPayment = receivedAmount;

    for (const due of previousDues) {
      const dueAmount = due.amountDue || 0;

      if (remainingPayment >= dueAmount) {
        due.amountDue = 0; // fully paid
        remainingPayment -= dueAmount;
      } else {
        due.amountDue -= remainingPayment; // partially paid
        remainingPayment = 0;
      }

      await due.save();
      if (remainingPayment <= 0) break;
    }

    // Remaining payment goes to current sale
    const remainingDue = totalPayable - receivedAmount;
    sale.amountDue = Math.max(remainingDue, 0);
    sale.invoicePdf = cloudRes.secure_url;

    await sale.save();

    return res.status(200).json({
      success: true,
      url: cloudRes.secure_url,
      public_id: cloudRes.public_id,
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return res.status(500).json({
      success: false,
      message: "Invoice generation failed",
      error: err.message,
    });
  }
};

module.exports = {
  getInvoices,
  generateInvoicePdf,
  generateSupplementInvoicePdf,
};
