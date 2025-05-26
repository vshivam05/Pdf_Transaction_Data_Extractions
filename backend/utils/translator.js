import axios from "axios";

async function translateText(text) {
  if (!text) return "";
  const res = await axios.post(
    "https://translation.googleapis.com/language/translate/v2",
    {},
    {
      params: {
        q: text,
        target: "en",
        key: process.env.GOOGLE_API_KEY,
      },
    }
  );
  return res.data.data.translations[0].translatedText;
}

export default async function translate(transactions) {
  return await Promise.all(
    transactions.map(async (tx) => {
      return {
        ...tx,
        buyerName: await translateText(tx.buyerName),
        sellerName: await translateText(tx.sellerName),
        village: await translateText(tx.village),
        scheduleRemarks: await translateText(tx.scheduleRemarks),
        documentRemarks: await translateText(tx.documentRemarks),
      };
    })
  );
}
