import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Test prompt",
    });
    console.log("Success:", response.text);
  } catch (err: any) {
    console.error("Gemini Error:", err.message);
  }
}
test();
