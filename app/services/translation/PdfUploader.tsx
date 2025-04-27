"use client";

import { useState, useCallback, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";

export default function PdfUploader() {
    useEffect(() => {
        // Initialize PDF.js worker in useEffect to avoid SSR issues
        const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    }, []);

    const [extractedText, setExtractedText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [copySuccess, setCopySuccess] = useState(false);

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
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");
                fullText += `Page ${pageNum}:\n${pageText}\n\n`;
            }
            return fullText;
        } catch (error) {
            throw new Error("Failed to extract text from PDF");
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

            try {
                // Create URL for PDF preview
                const fileUrl = URL.createObjectURL(file);
                setPdfUrl(fileUrl);

                const text = await extractTextFromPdf(file);
                setExtractedText(text);
                setCurrentPage(1);
            } catch (error) {
                setError("Failed to process PDF file");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(extractedText);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
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

            {isLoading && (
                <div className="text-center">
                    <p className="text-gray-600">Processing PDF...</p>
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

            {extractedText && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">
                            Extracted Text:
                        </h3>
                        <button
                            onClick={handleCopyText}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {copySuccess ? "Copied!" : "Copy All Text"}
                        </button>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <p className="whitespace-pre-wrap">{extractedText}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
