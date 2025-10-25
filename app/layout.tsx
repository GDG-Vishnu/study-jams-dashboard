import "./globals.css";
import type { Metadata } from "next";
import { Inter, Open_Sans, Poppins, Figtree, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { DateUpdatedProvider } from "@/components/DateUpdatedContext";

// const inter = Inter({ subsets: ["latin"] });
// const inter = Open_Sans({ subsets: ["latin"] });
// const inter = Poppins({
//   subsets: ["latin"],
//   weight: "500",
// });
// const inter = Figtree({
//   subsets: ["latin"],
// });

const inter = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gen AI Study Jams Cohort 2 - Lab Solutions",
  description:
    "Find and share YouTube video solutions for Gen AI Study Jams lab exercises",
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
        <AuthProvider>
          <DateUpdatedProvider>
            <div className="min-h-screen bg-gray-50">{children}</div>
          </DateUpdatedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
