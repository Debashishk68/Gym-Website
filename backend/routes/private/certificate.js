const express = require("express");
const { generateCertificateHandler, generateIdHandler } = require("../../controllers/certificateController");
const router = express.Router();

router.post("/generate", generateCertificateHandler);
router.post("/generate-id/:id",generateIdHandler);

module.exports = router;
