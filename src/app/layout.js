import { Roboto, Roboto_Slab, Scada } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const scada = Scada({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-scada",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export const metadata = {
  title: "San Francisco Street Gallery",
  description:
    "San Francisco Street Gallery — contemporary art gallery in Santa Fe, New Mexico.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${scada.variable} ${robotoSlab.variable}`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
