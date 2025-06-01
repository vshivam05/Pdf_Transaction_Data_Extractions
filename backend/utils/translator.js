// import axios from "axios";

// async function translateText(text) {
//   if (!text) return "";

//   try {
//     const response = await axios.post(
//       "https://translation.googleapis.com/language/translate/v2",
//       null,
//       {
//         params: {
//           q: text,
//           target: "en",
//           key: process.env.API_KEY,
//         },
//       }
//     );

//     return response.data.data.translations[0].translatedText;
//   } catch (error) {
//     console.error(
//       "Error translating:",
//       text,
//       error.response?.data || error.message
//     );
//     return text;
//   }
// }

// // Translate only first N transactions
// const TRANSLATION_LIMIT = 2;

// export default async function translate(transactions) {
//   if (!Array.isArray(transactions)) {
//     console.error(
//       "Expected an array, but got:",
//       typeof transactions,
//       transactions
//     );
//     return [];
//   }

//   return await Promise.all(
//     transactions.map(async (tx, index) => {
//       if (index >= TRANSLATION_LIMIT) return tx; // skip translation

//       return {
//         ...tx,
//         village: await translateText(tx.village),
//         scheduleRemarks: await translateText(tx.boundaryDetails),
//         documentRemarks: await translateText(tx.documentRemarks),
//         considerationValue: await translateText(tx.considerationValue),
//         propertyExtent: await translateText(tx.propertyExtent),
//         scheduleRemarks: await translateText(tx.scheduleRemarks),
//       };
//     })
//   );
// }


import axios from "axios";

async function translateText(text) {
  if (!text) return "";

  try {
    const response = await axios.post(
      "https://translation.googleapis.com/language/translate/v2",
      null,
      {
        params: {
          q: text,
          target: "en",
          key: process.env.API_KEY,
        },
      }
    );

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(
      "Error translating:",
      text,
      error.response?.data || error.message
    );
    return text; // Return original text if translation fails
  }
}

// Limit of transactions to translate
const TRANSLATION_LIMIT = 20;

export default async function translate(transactions) {
  if (!Array.isArray(transactions)) {
    console.error(
      "Expected an array, but got:",
      typeof transactions,
      transactions
    );
    return [];
  }

  return await Promise.all(
    transactions.map(async (tx, index) => {
      if (index >= TRANSLATION_LIMIT) {
        // Skip translation for transactions beyond the limit
        return tx;
      }

      return {
        ...tx,
        village: await translateText(tx.village),
        boundaryDetails: await translateText(tx.boundaryDetails),
        documentRemarks: await translateText(tx.documentRemarks),
        considerationValue: await translateText(tx.considerationValue),
        propertyExtent: await translateText(tx.propertyExtent),
        scheduleRemarks: await translateText(tx.scheduleRemarks),
      };
    })
  );
}

