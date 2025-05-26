/**
 * @module lib/utils
 * @description Utility functions for data serialization and class name management.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Serializes data by converting BigInt values to strings.
 * This is necessary because BigInt values cannot be directly serialized to JSON.
 *
 * @param {any} data - The data to be serialized
 * @returns {any} The serialized data with BigInt values converted to strings
 */
export function serializeData(data: any): any {
    if (data === null || data === undefined) {
        return data;
    }

    if (typeof data === "bigint") {
        return data.toString();
    }

    if (Array.isArray(data)) {
        return data.map(serializeData);
    }

    if (typeof data === "object") {
        const result: any = {};
        for (const key in data) {
            result[key] = serializeData(data[key]);
        }
        return result;
    }

    return data;
}

/**
 * Merges class names using clsx and tailwind-merge.
 * This utility combines multiple class names and handles Tailwind CSS class conflicts.
 *
 * @param {...ClassValue[]} inputs - Class names to be merged
 * @returns {string} The merged class names string
 *
 * @example
 * cn("px-2 py-1", "bg-red-500", { "text-white": true })
 * // Returns: "px-2 py-1 bg-red-500 text-white"
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

module.exports = { serializeData };
