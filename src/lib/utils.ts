import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setItem(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}

export function getItem(key: string): string | null {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {
    console.log(error);
    return null;
  }
}
