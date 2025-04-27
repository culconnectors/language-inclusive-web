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

    const extractTextFromPdf = async (file: File) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);
            const textContent = await page.getTextContent();
            const text = textContent.items
                .map((item: any) => item.str)
                .join(" ");
            return text;
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

            try {
                const text = await extractTextFromPdf(file);
                setExtractedText(text);
            } catch (error) {
                setError("Failed to process PDF file");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

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

            {extractedText && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">
                        Extracted Text:
                    </h3>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <p className="whitespace-pre-wrap">{extractedText}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
