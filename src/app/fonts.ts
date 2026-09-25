import localFont from "next/font/local";

export const inter = localFont({
  src: "../../public/fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  fallback: ["Arial", "sans-serif"],
});

export const comfortaa = localFont({
  src: "../../public/fonts/Comfortaa/Comfortaa-VariableFont_wght.ttf",
  variable: "--font-comfortaa",
  display: "swap",
  weight: "300 700",
  fallback: ["Arial", "sans-serif"],
});
