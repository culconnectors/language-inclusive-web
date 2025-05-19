/**
 * Helper function to convert BigInt to string for serialization
 * @param data Any data that might contain BigInt values
 * @returns The same data with BigInt values converted to strings
 */
const serializeData = (data: any) => {
    return JSON.parse(
        JSON.stringify(data, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
};

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

module.exports = { serializeData };
