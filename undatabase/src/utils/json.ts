/**
 * Utility functions for JSON handling
 */

/**
 * Safely parses JSON without throwing errors
 */
export function safeJSONParse(text: string, defaultValue: any = {}) {
  try {
    return JSON.parse(text)
  }
  catch (e) {
    return defaultValue
  }
}

/**
 * Simple logger utility for adapter debugging
 */
export const logger = {
  info: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
}

/**
 * Generates a unique ID string
 * Used as the default ID generator for adapters
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
    + Math.random().toString(36).substring(2, 15)
}
