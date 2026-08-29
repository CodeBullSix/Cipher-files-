import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Test prompt",
    });
    console.log("Success:", response.text);
  } catch (err) {
    console.error("Gemini Error:", err.status, err.message);
  }
}
test();
