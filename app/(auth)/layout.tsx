import { Inter } from "next/font/google";

import "../globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

//used for search engine optimization
export const metadata = {
  title: "Radiate",
  description: "A Next.js 13 Meta Social Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: "bg-primary-500 hover:bg-primary-400",
        },
      }}
    >
      <html lang="en">
        <body className={`{inter.className} bg-dark-1 `}>
          <div className="w-full flex justify-center items-center min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
