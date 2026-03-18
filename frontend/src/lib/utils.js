import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 * @param  {...any} inputs - Class names or conditional class objects
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Russian locale with spaces
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export function formatPrice(num) {
  return Math.round(num).toLocaleString("ru-RU");
}

/**
 * Delay execution
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if device is mobile
 * @returns {boolean} - True if mobile device
 */
export const isMobile = () => {
  return window.innerWidth < 768;
};

/**
 * Scroll to element smoothly
 * @param {string} id - Element ID to scroll to
 */
export const scrollToElement = (id) => {
  const element = document.querySelector(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};