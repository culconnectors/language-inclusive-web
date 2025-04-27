"use client";

import { useState, useCallback, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import { languages } from "./languages";
import { translateWithGemini } from "./gemini";

export default function PdfUploader() {
    useEffect(() => {
        // Initialize PDF.js worker in useEffect to avoid SSR issues
        const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    }, []);

    const [extractedText, setExtractedText] = useState<string>("");
    const [translatedText, setTranslatedText] = useState<string>("");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
    const [isLoading, setIsLoading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState<string>("");
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [copySuccess, setCopySuccess] = useState(false);

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
            setTotalPages(pdf.numPages);

            let fullText = "";
            // Extract text from all pages
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = formatExtractedText(textContent.items);

                // Add page separator only if there's more than one page
                if (pdf.numPages > 1) {
                    fullText += `Page ${pageNum}:\n${pageText}\n`;
                } else {
                    fullText += pageText;
                }
            }
            return fullText;
        } catch (error) {
            throw new Error("Failed to extract text from PDF");
        }
    };

    const translateText = async (text: string, targetLanguage: string) => {
        setIsTranslating(true);
        setError("");

        try {
            const selectedLangName =
                languages.find((lang) => lang.code === targetLanguage)?.name ||
                targetLanguage;
            const translation = await translateWithGemini(
                text,
                selectedLangName
            );
            setTranslatedText(translation);
        } catch (error) {
            setError("Failed to translate text. Please try again.");
            console.error(error);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            if (file.type !== "application/pdf") {
                setError("Please upload a PDF file");
                return;
            }

            setIsLoading(true);
            setError("");
            setCopySuccess(false);
            setTranslatedText("");

            try {
                // Create URL for PDF preview
                const fileUrl = URL.createObjectURL(file);
                setPdfUrl(fileUrl);

                const text = await extractTextFromPdf(file);
                setExtractedText(text);
                setCurrentPage(1);

                // Automatically start translation
                await translateText(text, selectedLanguage);
            } catch (error) {
                setError("Failed to process PDF file");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        [selectedLanguage]
    );

    const handleLanguageChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);
        if (extractedText) {
            await translateText(extractedText, newLanguage);
        }
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

    // Cleanup URL on unmount
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-md mb-4">
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
                        <p className="text-xs text-gray-500">PDF files only</p>
                    </div>
                    <input
                        id="pdf-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>

            {(isLoading || isTranslating) && (
                <div className="text-center">
                    <p className="text-gray-600">
                        {isLoading
                            ? "Processing PDF..."
                            : "Translating text..."}
                    </p>
                </div>
            )}

            {error && <div className="text-center text-red-500">{error}</div>}

            {pdfUrl && !isLoading && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">PDF Preview:</h3>
                    <div className="w-full max-w-2xl mx-auto h-[500px] border border-gray-200 rounded-lg overflow-hidden">
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full"
                            title="PDF Preview"
                        />
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-2">
                        Page {currentPage} of {totalPages}
                    </p>
                </div>
            )}

            {(extractedText || translatedText) && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">
                            Extracted and Translated Text:
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleCopyText(extractedText)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Copy Original
                            </button>
                            <button
                                onClick={() => handleCopyText(translatedText)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Copy Translation
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-2">
                                Original Text:
                            </h4>
                            <p className="whitespace-pre-wrap">
                                {extractedText}
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-2">
                                Translated Text:
                            </h4>
                            <p className="whitespace-pre-wrap">
                                {translatedText || "Translation in progress..."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
