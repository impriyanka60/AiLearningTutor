
const Tesseract = require('tesseract.js');
const fs = require('fs');

exports.runOCR = async (file) => {
  const buffer = file.data;
  const result = await Tesseract.recognize(buffer, 'eng');
  return result.data.text;
};
