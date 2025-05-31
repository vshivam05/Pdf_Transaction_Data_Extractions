import pdf from "pdf-parse";
import fs from "fs/promises";

/**
 * Extracts a field value from lines, starting at startKeywords, stopping at nextFieldKeywords.
 */

function getFieldInline(lines, keywords) {
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lowerKeywords.some(k => lower.includes(k))) {
      const afterColon = line.split(/[:：]/)[1]?.trim();
      if (afterColon) return afterColon;
    }
  }
  return "";
}

function getFieldBetween(lines, startKeywords, nextKeywords = []) {
  const lowerStart = startKeywords.map(k => k.toLowerCase());
  const lowerNext = nextKeywords.map(k => k.toLowerCase());

  let isCapturing = false;
  let collected = [];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (!isCapturing) {
      if (lowerStart.some(k => lowerLine.includes(k))) {
        isCapturing = true;
        // Extract content after colon if exists
        const afterColon = line.split(/[:：]/)[1]?.trim();
        if (afterColon) collected.push(afterColon);
      }
    } else {
      if (lowerNext.some(k => lowerLine.includes(k))) break; // Stop at next field
      collected.push(line);
    }
  }

  return collected.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Splits text into transaction blocks based on document number patterns.
 */
function splitIntoTransactionBlocks(lines) {
  const blocks = [];
  let current = [];

  for (const line of lines) {
    if (/^\d{2,4}\/\d{4}$/.test(line.trim())) {
      if (current.length) blocks.push(current);
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current);
  return blocks;
}

/**
 * Extracts a structured transaction object from a block of lines.
 */

function getFieldAfterHeadingBlock(lines, headingKeywords = [], stopKeywords = [], maxLines = 3) {
  const lowerHeadings = headingKeywords.map(k => k.toLowerCase());
  const lowerStops = stopKeywords.map(k => k.toLowerCase());

  let startIndex = -1;

  // Find start of the field (heading)
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    if (lowerHeadings.some(k => lowerLine.includes(k))) {
      startIndex = i + 1;
      break;
    }
  }

  if (startIndex === -1) return "";

  // Collect lines until we hit next keyword or maxLines
  let valueLines = [];
  for (let i = startIndex; i < lines.length && valueLines.length < maxLines; i++) {
    const lowerLine = lines[i].toLowerCase();
    if (lowerStops.some(k => lowerLine.includes(k))) break;
    valueLines.push(lines[i]);
  }

  return valueLines.join(" ").trim();
}

function parseTransactionBlock(lines) {
  return {
    documentNumber: lines.find(l => /^\d{2,4}\/\d{4}$/.test(l.trim())) || "",
    executionDate: lines.find(l => /\d{2}-[A-Za-z]{3}-\d{4}/.test(l)) || "",
    registrationDate: lines.filter(l => /\d{2}-[A-Za-z]{3}-\d{4}/.test(l))[1] || "",
nature: getFieldBetween(
  lines,
  ["Nature", "தன்மை", "Nature/தன்ைம"],
  ["Name of Executant", "Name of Executant(s)", "எழுதிக்கொடுத்தவர்", "எழுதிக்ெகாடுத்தவர்"]
),

sellerName: getFieldBetween(
  lines,
  ["Name of Executant", "Name of Executant(s)", "எழுதிக்கொடுத்தவர்", "எழுதிக்ெகாடுத்தவர்"],
  ["Name of Claimant", "Name of Claimant(s)", "எழுதி வாங்கியவர்"]
),

buyerName: getFieldBetween(
  lines,
  ["Name of Claimant", "Name of Claimant(s)", "எழுதி வாங்கியவர்"],
  ["Vol.No", "Vol.No & Page. No", "தொகுதி எண்"]
),

volPage: getFieldBetween(
  lines,
  ["Vol.No", "Vol.No & Page. No", "தொகுதி எண்"],
  ["Consideration Value", "கிமாற்றுத் தொகை"]
),

    considerationValue: getFieldBetween(lines, ["Consideration Value", "கிமாற்றுத் தொகை"], ["Market Value", "மதிப்பு"]),
    marketValue: getFieldBetween(lines, ["Market Value", "மதிப்பு"], ["PR Number", "முந்தைய ஆவண எண்"]),
    prNumber: getFieldBetween(lines, ["PR Number", "முந்தைய ஆவண எண்"], ["Document Remarks", "ஆவண குறிப்புகள்"]),
    documentRemarks: getFieldBetween(lines, ["Document Remarks", "ஆவண குறிப்புகள்"], ["Property Type", "சொத்தின் வகை"]),
    propertyType: getFieldBetween(lines, ["Property Type", "சொத்தின் வகை"], ["Property Extent", "விஸ்தீர்ணம்"]),
    propertyExtent: getFieldBetween(lines, ["Property Extent", "விஸ்தீர்ணம்"], ["Village", "கிராமம்"]),
    village: getFieldBetween(lines, ["Village", "கிராமம்"], ["Survey No", "புல எண்"]),
    surveyNumber: getFieldBetween(lines, ["Survey No", "புல எண்"], ["Plot No", "மைன எண்"]),
    // plotNumber: getFieldBetween(lines, ["Plot No", "மைன எண்"], ["எல்லை விபரங்கள்", "Boundary"]),
   plotNumber: getFieldBetween(lines, ["Plot No", "மைன எண்"], ["எல்லை விபரங்கள்", "Boundary", "Schedule Remarks", "சொத்து விவரம்"]),
  
  // Debug logs to verify extracted fields
  // Commenting out debug logs to avoid cluttering output
  // console.log("Extracted nature:", getFieldBetween(
  //   lines,
  //   ["Nature", "தன்மை", "Nature/தன்ைம"],
  //   ["Name of Executant", "Name of Executant(s)", "எழுதிக்கொடுத்தவர்", "எழுதிக்ெகாடுத்தவர்"]
  // ));
  // console.log("Extracted sellerName:", getFieldBetween(
  //   lines,
  //   ["Name of Executant", "Name of Executant(s)", "எழுதிக்கொடுத்தவர்", "எழுதிக்ெகாடுத்தவர்"],
  //   ["Name of Claimant", "Name of Claimant(s)", "எழுதி வாங்கியவர்"]
  // ));
  // console.log("Extracted buyerName:", getFieldBetween(
  //   lines,
  //   ["Name of Claimant", "Name of Claimant(s)", "எழுதி வாங்கியவர்"],
  //   ["Vol.No", "Vol.No & Page. No", "தொகுதி எண்"]
  // ));
  // console.log("Extracted plotNumber:", getFieldBetween(lines, ["Plot No", "மைன எண்"], ["எல்லை விபரங்கள்", "Boundary", "Schedule Remarks", "சொத்து விவரம்"]));
boundaryDetails: getFieldBetween(
  lines,
  ["எல்லை விபரங்கள்", "Boundary", "எல்ைல விபரங்கள்"],  // ← include misspelling seen in text
  ["Schedule Remarks", "சொத்து விவரம்"]
),
scheduleRemarks: getFieldBetween(lines, ["Schedule Remarks", "சொத்து விவரம்"], []),

  };
}

export default async function parsePDF(file) {
  let dataBuffer;

  if (Buffer.isBuffer(file)) {
    dataBuffer = file;
  } else if (typeof file === "string") {
    try {
      await fs.access(file);
      dataBuffer = await fs.readFile(file);
    } catch (err) {
      console.error("File read error:", err);
      return [];
    }
  } else {
    throw new Error("Invalid input type");
  }

  const { text } = await pdf(dataBuffer);
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  const blocks = splitIntoTransactionBlocks(lines);
  const transactions = blocks.map(parseTransactionBlock);

  console.log("✅ Extracted", transactions.length, "transactions");
  return transactions;
}
