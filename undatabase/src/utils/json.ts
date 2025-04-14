/**
 * Utility functions for JSON handling
 */

/**
 * Safely parses JSON without throwing errors
 */
export function safeJSONParse(text: string, defaultValue: any = {}) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return defaultValue;
  }
}