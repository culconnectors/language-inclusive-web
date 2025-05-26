"use client";

import { useState, useCallback, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import { languages } from "./languages";
import { translateWithGemini } from "./gemini";
import { Brain, Loader2, InfoIcon } from "lucide-react";

type Service = "translate" | "summarise";

const InfoBox = ({ title, description }: { title: string, description: string }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
            <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">{title}</h3>
                <p className="text-blue-800/80 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

const serviceInfo = {
    translate: {
        title: "Translate",
        description: "Performs a literal translation of the entire document, preserving all content and context. Best used when you need to understand everything in the document, including minor details and specific wording."
    },
    summarise: {
        title: "Summarise",
        description: "Creates a concise summary focusing on the main points and key information. While faster to read, it may omit some details that could be important depending on your needs. Use when you want a quick overview of the content."
    }
};

export default function PdfUploader() {
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
    const [progress, setProgress] = useState(0);
    const [progressStage, setProgressStage] = useState("");

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

    const resetFile = () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
        setPdfUrl("");
        setSelectedFile(null);
        setFileName("");
        setError("");
        setExtractedText("");
        setTranslatedText("");
        setCopySuccess(false);
        // Reset the file input by clearing its value
        const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
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
            setProgress(0);
            setProgressStage("Extracting text from PDF...");

            // Start gradual progress
            let currentProgress = 0;
            const progressInterval = setInterval(() => {
                if (currentProgress < 20) {
                    currentProgress += 2;
                    setProgress(currentProgress);
                }
            }, 100);

            // Extract text
            const text = await extractTextFromPdf(selectedFile);
            setExtractedText(text);
            clearInterval(progressInterval);
            setProgress(20);
            setProgressStage(selectedService === "translate" ? "Translating text..." : "Summarizing text...");

            // Calculate interval timing based on service
            // For translation: 15s = 15000ms, need to go from 20 to 80 (60 steps of 1%)
            // For summarization: 5s = 5000ms, need to go from 20 to 80 (60 steps of 1%)
            const intervalTime = selectedService === "translate" ? 250 : 83; // 15000/60 or 5000/60

            // Start second phase of gradual progress
            currentProgress = 20;
            const secondProgressInterval = setInterval(() => {
                if (currentProgress < 80) {
                    currentProgress += 1;
                    setProgress(currentProgress);
                }
            }, intervalTime);

            // Process text
            await processText(text, selectedLanguage, selectedService);
            clearInterval(secondProgressInterval);
            setProgress(100);
            setProgressStage("Complete!");
        } catch (error) {
            setError("Failed to process PDF file");
            console.error(error);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setProgress(0);
                setProgressStage("");
            }, 1000);
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
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Select Target Language
                        </label>
                        <select
                            id="language-select"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Select Service
                        </label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setSelectedService("translate")}
                                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                                    selectedService === "translate"
                                        ? "bg-[#FABB20] text-white"
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
                                        : "bg-gray-100 text-gray-700 hover:bg-[#FABB20] hover:text-white"
                                }`}
                            >
                                Summarise
                            </button>
                        </div>
                    </div>

                    {selectedService && (
                        <div className="animate-fadeIn">
                            <InfoBox 
                                title={serviceInfo[selectedService].title}
                                description={serviceInfo[selectedService].description}
                            />
                        </div>
                    )}
                </div>

                <div className="w-full mt-4">
                    {!selectedFile ? (
                        <label
                            htmlFor="pdf-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
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
                    ) : null}
                </div>

                {pdfUrl && (
                    <div className="w-full mt-4">
                        <iframe
                            src={`${pdfUrl}`}
                            className="w-full h-[600px] border border-gray-200 rounded-lg"
                            title="PDF Preview"
                        />
                    </div>
                )}

                {fileName && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Current file:{" "}
                            <span className="font-medium">{fileName}</span>
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-4 mt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || isTranslating}
                        className="px-6 py-2 bg-[#FABB20] text-white rounded-md hover:bg-[#FABB20]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading || isTranslating ? (
                            <>
                                Processing
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </>
                        ) : (
                            <>
                                Process
                                <Brain className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {selectedFile && (
                        <button
                            onClick={resetFile}
                            className="px-6 py-2 bg-[#FABB20] text-white rounded-md hover:bg-[#FABB20]/90 transition-colors flex items-center gap-2"
                        >
                            Upload another file
                        </button>
                    )}
                </div>

                {(isLoading || isTranslating) && progress > 0 && (
                    <div className="w-full mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{progressStage}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#FABB20] transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="text-center text-red-500">{error}</div>}

            {(extractedText || translatedText) && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">
                            {selectedService === "translate"
                                ? "Translated Text:"
                                : "Summarised Text:"}
                        </h3>
                        <div className="flex items-center">
                            {copySuccess && (
                                <span className="mr-2 text-green-600 font-medium">
                                    Text copied!
                                </span>
                            )}
                            <button
                                onClick={() => handleCopyText(translatedText)}
                                className="px-4 py-2 bg-[#FABB20] text-white rounded-md hover:bg-[#FABB20]/90 active:bg-[#FABB20]/70 transition-colors"
                            >
                                {selectedService === "translate"
                                    ? "Copy Text"
                                    : "Copy Text"}
                            </button>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
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
