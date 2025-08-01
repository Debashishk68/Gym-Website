// Utility to convert numbers to words (basic)
function convertToWords(amount) {
  const words = require("number-to-words");
  return words.toWords(amount).replace(/\b\w/g, (c) => c.toUpperCase());
}

module.exports = convertToWords;