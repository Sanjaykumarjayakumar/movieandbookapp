import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyB-3pB2C_2p2j3Gg9H3r4e5f6g7h8i9j0";

let genAI;

try {
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set in the environment.");
  }
  genAI = new GoogleGenerativeAI(apiKey);
} catch (error) {
  console.error("Failed to initialize GoogleGenerativeAI:", error);
  genAI = null; // Set genAI to null so the app can handle the error state
}

export default genAI;
