/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "../../packages/ui/**/*.{js,ts,tsx}", // if you share components across apps
];
export const theme = {
  extend: {},
};
export const plugins = [];
