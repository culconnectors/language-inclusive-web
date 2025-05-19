"use client";

import { useState, useCallback, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import { languages } from "./languages";
import { translateWithGemini } from "./gemini";
import { useTheme } from "@/app/hooks/useTheme";

type Service = "translate" | "summarise";

export default function PdfUploader() {
    const { isDarkMode } = useTheme();
    useEffect(() => {
        // Initialize PDF.js worker in useEffect to avoid SSR issues
        const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    }, []);

    const [extractedText, setExtractedText] = useState<string>("");
    const [translatedText, setTranslatedText] = useState<string>("");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
    const [selectedService, setSelectedService] =
        useState<Service>("translate");
    const [isLoading, setIsLoading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [copySuccess, setCopySuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string>("");

    useEffect(() => {
        // Cleanup URL when component unmounts or when file changes
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const formatExtractedText = (items: any[]) => {
        let formattedText = "";
        let lastY = -1;
        let lineText = "";

        // Sort items by Y position (top to bottom) and then X position (left to right)
        const sortedItems = [...items].sort((a, b) => {
            if (Math.abs(a.transform[5] - b.transform[5]) > 5) {
                return b.transform[5] - a.transform[5]; // Y position
            }
            return a.transform[4] - b.transform[4]; // X position
        });

        for (const item of sortedItems) {
            const y = item.transform[5];
            const text = item.str.trim();

            if (!text) continue;

            // If this is a new line (Y position differs significantly)
            if (lastY !== -1 && Math.abs(y - lastY) > 5) {
                formattedText += lineText.trim() + "\n";
                lineText = "";
            }

            // Add appropriate spacing between words
            if (lineText && !lineText.endsWith("-")) {
                lineText += " ";
            }
            lineText += text;
            lastY = y;
        }

        // Add the last line
        if (lineText) {
            formattedText += lineText.trim() + "\n";
        }

        return formattedText;
    };

    const extractTextFromPdf = async (file: File) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            let fullText = "";
            // Extract text from all pages
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = formatExtractedText(textContent.items);

                // Add page separator
                fullText += `[Page ${pageNum}]\n${pageText}\n`;
            }
            return fullText;
        } catch (error) {
            throw new Error("Failed to extract text from PDF");
        }
    };

    const getGeminiPrompt = (
        text: string,
        targetLanguage: string,
        service: Service
    ) => {
        console.log("Service selected:", service); // Debug log
        const prompt =
            service === "translate"
                ? `Translate the following text into ${targetLanguage} language, using a style similar to Google Translate. Preserve the original formatting and page structure exactly. UNDER NO CIRCUMSTANCES SHOULD YOU USE ANY SPECIAL FORMATTING SUCH AS MARKDOWN SYMBOLS (FOR EXAMPLE, BOLD, ITALICS, OR HEADINGS). ONLY USE NORMAL CAPITALIZATION AND SPACING FOR EMPHASIS OR HEADINGS. THIS IS A STRICT REQUIREMENT, AND IT MUST BE FOLLOWED. DO NOT INCLUDE ANY ADDITIONAL COMMENTARY—ONLY OUTPUT THE TRANSLATED TEXT. Here is the text: ${text}`
                : `Summarize the following text concisely in ${targetLanguage} language, using simple and easy-to-understand language. Begin the summary with a brief description, in 1-2 sentences, of what the text is about. Then, highlight the important points and key information. Maintain the original formatting and page structure. UNDER NO CIRCUMSTANCES SHOULD YOU USE ANY SPECIAL FORMATTING SUCH AS MARKDOWN SYMBOLS (FOR EXAMPLE, BOLD, ITALICS, OR HEADINGS). ONLY USE NORMAL CAPITALIZATION AND SPACING FOR EMPHASIS OR HEADINGS. THIS IS A STRICT REQUIREMENT, AND IT MUST BE FOLLOWED. DO NOT INCLUDE ANY ADDITIONAL COMMENTARY—ONLY OUTPUT THE SUMMARY. Here is the text: ${text}`;
        console.log("Generated prompt:", prompt); // Debug log
        return prompt;
    };

    const processText = async (
        text: string,
        targetLanguage: string,
        service: Service
    ) => {
        setIsTranslating(true);
        setError("");
        console.log("Processing text with service:", service); // Debug log

        try {
            const selectedLangName =
                languages.find((lang) => lang.code === targetLanguage)?.name ||
                targetLanguage;
            const prompt = getGeminiPrompt(text, selectedLangName, service);
            console.log("Using prompt:", prompt); // Debug log
            const result = await translateWithGemini(
                text,
                selectedLangName,
                prompt
            );
            setTranslatedText(result);
        } catch (error) {
            setError("Failed to process text. Please try again.");
            console.error(error);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file");
            return;
        }

        // Cleanup old URL if exists
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }

        // Create new URL for PDF preview
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
        setSelectedFile(file);
        setFileName(file.name);
        setError("");
    };

    const handleSubmit = async () => {
        // Validation
        if (!selectedFile) {
            setError("Please upload a PDF file first");
            return;
        }
        if (!selectedLanguage) {
            setError("Please select a target language");
            return;
        }
        if (!selectedService) {
            setError("Please select a service (translate or summarise)");
            return;
        }

        try {
            // Check PDF page count
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            if (pdf.numPages > 5) {
                setError("PDF must not exceed 5 pages");
                return;
            }

            setIsLoading(true);
            setError("");
            setCopySuccess(false);
            setTranslatedText("");

            const text = await extractTextFromPdf(selectedFile);
            setExtractedText(text);
            await processText(text, selectedLanguage, selectedService);
        } catch (error) {
            setError("Failed to process PDF file");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLanguageChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);
    };

    const handleCopyText = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            setError("Failed to copy text");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-md space-y-4">
                    <div>
                        <label
                            htmlFor="language-select"
                            className={`block text-sm font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                        >
                            Select Target Language
                        </label>
                        <select
                            id="language-select"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            className={`block w-full rounded-md ${
                                isDarkMode
                                    ? "bg-gray-800 border-gray-700 text-gray-300"
                                    : "bg-white border-gray-300 text-gray-700"
                            } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                        >
                            {languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="service-select"
                            className={`block text-sm font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                        >
                            Select Service
                        </label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setSelectedService("translate")}
                                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                                    selectedService === "translate"
                                        ? "bg-[#FABB20] text-white"
                                        : isDarkMode
                                        ? "bg-gray-800 text-gray-300 hover:bg-[#FABB20] hover:text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-[#FABB20] hover:text-white"
                                }`}
                            >
                                Translate
                            </button>
                            <button
                                onClick={() => setSelectedService("summarise")}
                                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                                    selectedService === "summarise"
                                        ? "bg-[#FABB20] text-white"
                                        : isDarkMode
                                        ? "bg-gray-800 text-gray-300 hover:bg-[#FABB20] hover:text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-[#FABB20] hover:text-white"
                                }`}
                            >
                                Summarise
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-4">
                    <label
                        htmlFor="pdf-upload"
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${
                            isDarkMode
                                ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                        }`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <p
                                className={`mb-2 text-sm ${
                                    isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                }`}
                            >
                                <span className="font-semibold">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>
                            <p
                                className={`text-xs ${
                                    isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                }`}
                            >
                                PDF files only
                            </p>
                        </div>
                        <input
                            id="pdf-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileSelect}
                        />
                    </label>
                </div>

                {pdfUrl && (
                    <div className="w-full mt-4">
                        <iframe
                            src={`${pdfUrl}`}
                            className={`w-full h-[600px] border rounded-lg ${
                                isDarkMode
                                    ? "border-gray-700"
                                    : "border-gray-200"
                            }`}
                            title="PDF Preview"
                        />
                    </div>
                )}

                {fileName && (
                    <div className="mt-4 text-center">
                        <p
                            className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            Current file:{" "}
                            <span className="font-medium">{fileName}</span>
                        </p>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isLoading || isTranslating}
                    className="mt-4 px-6 py-2 bg-[#FABB20] text-white rounded-md hover:bg-[#FABB20]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading || isTranslating
                        ? "Processing..."
                        : "Process PDF"}
                </button>
            </div>

            {error && <div className="text-center text-red-500">{error}</div>}

            {(extractedText || translatedText) && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3
                            className={`text-lg font-semibold ${
                                isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                        >
                            {selectedService === "translate"
                                ? "Translated Text:"
                                : "Summarised Text:"}
                        </h3>
                        <button
                            onClick={() => handleCopyText(translatedText)}
                            className="px-4 py-2 bg-[#FABB20] text-white rounded-md hover:bg-[#FABB20]/90 transition-colors"
                        >
                            Copy Text
                        </button>
                    </div>
                    <div
                        className={`p-4 rounded-lg border ${
                            isDarkMode
                                ? "bg-gray-800 border-gray-700 text-gray-300"
                                : "bg-white border-gray-200 text-gray-900"
                        }`}
                    >
                        <div className="h-[400px] overflow-y-auto">
                            <p className="whitespace-pre-wrap pr-4">
                                {translatedText ||
                                    (isTranslating ? "Processing..." : "")}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
