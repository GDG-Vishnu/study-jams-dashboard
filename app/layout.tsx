import "./globals.css";
import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });
const inter = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Google Cloud Cohort 2 - Lab Solutions",
  description:
    "Find and share YouTube video solutions for Google Cloud Platform lab exercises",
  keywords: ["Google Cloud", "GCP", "Lab Solutions", "YouTube", "Cohort 2"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </body>
    </html>
  );
}
