


// ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

import pdf from "pdf-parse";
import fs from "fs/promises";

function safeMatch(regex, text) {
  const match = regex.exec(text);
  return match?.[1]?.trim() || "";
}

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

function getFieldBetween(
  lines,
  startKeywords,
  nextKeywords = [],
  maxLines = 3
) {
  const lowerStart = startKeywords.map((k) => k.toLowerCase());
  const lowerNext = nextKeywords.map((k) => k.toLowerCase());

  let isCapturing = false;
  let collected = [];
  let linesCaptured = 0;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (!isCapturing) {
      if (lowerStart.some((k) => lowerLine.includes(k))) {
        isCapturing = true;
        // Extract value after colon/Tamil colon
        const afterColon = line.split(/[:：]/)[1]?.trim();
        if (afterColon) {
          collected.push(afterColon);
          linesCaptured++;
        }
        // If no colon found, skip this line and continue capturing
      }
    } else {
      if (lowerNext.some((k) => lowerLine.includes(k))) break;
      // Stop if we encounter another field with colon
      if (/[:：]/.test(line)) break;

      collected.push(line);
      linesCaptured++;
      if (linesCaptured >= maxLines) break;
    }
  }

  return collected.join(" ").replace(/\s+/g, " ").trim();
}

function parseTransactionBlock(lines) {
  const fullText = lines.join("\n");

  return {
    documentNumber: lines.find((l) => /^\d{2,4}\/\d{4}$/.test(l.trim())) || "",
    executionDate:
      safeMatch(/Execution Date[:：]?\s*(\d{2}-[A-Za-z]{3}-\d{4})/, fullText) ||
      lines.find((l) => /\d{2}-[A-Za-z]{3}-\d{4}/.test(l)) ||
      "",
    registrationDate:
      lines.filter((l) => /\d{2}-[A-Za-z]{3}-\d{4}/.test(l))[1] || "",

    nature: getFieldBetween(
      lines,
      ["Nature", "தன்மை", "Nature/தন்ைம"],
      ["Name of Executant", "எழுதிக்கொடுத்தவர்"]
    ),

    sellerName: getFieldBetween(
      lines,
      ["Name of Executant", "எழுதிக்கொடுத்தவர்"],
      ["Name of Claimant", "எழுதி வாங்கியவர்"]
    ),

    buyerName: getFieldBetween(
      lines,
      ["Name of Claimant", "எழுதி வாங்கியவர்"],
      ["Vol.No", "தொகுதி எண்"]
    ),

    volPage: getFieldBetween(
      lines,
      ["Vol.No", "Vol.No & Page. No", "தொகுதி எண்"],
      ["Consideration Value", "கிமாற்றுத் தொகை"]
    ),

    considerationValue: getFieldBetween(
      lines,
      ["Consideration Value", "கிமாற்றுத் தொகை", "ைகமாற்றுத் ெதாைக"],
      ["Market Value", "மதிப்பு", "சந்ைத மதிப்பு"]
    ),

    marketValue: getFieldBetween(
      lines,
      ["Market Value", "மதிப்பு", "சந்ைத మதிப்பு"],
      ["PR Number", "முந்தைய ஆவண எண்", "முந்ைதய ஆவண எண்"]
    ),

    prNumber: getFieldBetween(
      lines,
      ["PR Number", "முந்தைய ஆவண எண்", "முந்ைதய ஆவண எண்"],
      ["Document Remarks", "ஆவண குறிப்புகள்"]
    ),

    documentRemarks: getFieldBetween(
      lines,
      ["Document Remarks", "ஆவண குறிப்புகள்"],
      ["Property Type", "சொத்தின் வகை"]
    ),

    propertyType: getFieldBetween(
      lines,
      ["Property Type", "சொத்தின் வகை"],
      ["Property Extent", "விஸ்தீர்ணம்"]
    ),

    propertyExtent: getFieldBetween(
      lines,
      ["Property Extent", "விஸ்தீர்ணம்"],
      ["Village", "கிராமம்"]
    ),

    village: getFieldBetween(
      lines,
      ["Village", "கிராமம்"],
      ["Survey No", "புல எண்"]
    ),

    surveyNumber: getFieldBetween(
      lines,
      ["Survey No", "புல எண்"],
      ["Plot No", "மைன எண்"]
    ),

    plotNumber: getFieldBetween(
      lines,
      ["Plot No", "மைன எண்"],
      ["Boundary", "எல்லை விபரங்கள்", "Schedule Remarks", "சொத்து விவரம்"]
    ),

    boundaryDetails: getFieldBetween(
      lines,
      ["Boundary", "எல்லை விபரங்கள்", "எல்ைல விபரங்கள்"],
      ["Schedule Remarks", "சொத்து விவரம்"]
    ),

    scheduleRemarks: getFieldBetween(
      lines,
      ["Schedule Remarks", "சொத்து விவரம்"],
      []
    ),
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
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const blocks = splitIntoTransactionBlocks(lines);
  const transactions = blocks.map(parseTransactionBlock);

  console.log("✅ Extracted", transactions.length, "transactions");
  return transactions;
}