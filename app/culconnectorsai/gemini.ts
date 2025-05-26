/**
 * Configuration and utility functions for Google's Gemini AI API integration
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

// Validate environment variable
if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error(
        "NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables"
    );
}

// Initialize Gemini API client with API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

/**
 * Translates text using Gemini AI model
 * @param text - The text to translate
 * @param targetLanguage - The target language code
 * @param customPrompt - Custom prompt for translation
 * @returns Promise<string> - The translated text
 * @throws Error if translation fails
 */
export async function translateWithGemini(
    text: string,
    targetLanguage: string,
    customPrompt: string
) {
    const geminiModel = "gemini-2.0-flash-lite";
    try {
        // Initialize the Gemini model
        const model = genAI.getGenerativeModel({ model: geminiModel });

        // Generate translation using custom prompt
        const result = await model.generateContent(customPrompt);
        const response = await result.response;
        const translation = response.text();

        return translation;
    } catch (error) {
        console.error("Translation error:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to translate text: ${error.message}`);
        }
        throw new Error("Failed to translate text");
    }
}
