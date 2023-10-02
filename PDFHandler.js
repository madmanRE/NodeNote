const pdf = require("pdfkit");
const fs = require("fs");
const he = require("he");

function removeHtmlTagsAndDecodeEntities(html) {
  const text = he.decode(html.replace(/<[^>]*>/g, ""));
  return text;
}

function createPDF(id, text) {
  const newPDF = new pdf();
  newPDF.pipe(fs.createWriteStream(`${id}.pdf`));

  newPDF.font("arial.ttf").fontSize(12).text(removeHtmlTagsAndDecodeEntities(text), { encoding: "utf8" });

  newPDF.end();
  return `${id}.pdf`;
}

module.exports = createPDF;
