import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error(
        "NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables"
    );
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function translateWithGemini(
    text: string,
    targetLanguage: string
) {
    const geminiModel = "gemini-2.0-flash-lite";
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: geminiModel });

        // Create the prompt
        const prompt = `Please translate this text into ${targetLanguage} language. Maintain the original formatting and page structure. Here's the text:\n\n${text}`;

        // Generate content
        const result = await model.generateContent(prompt);
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
