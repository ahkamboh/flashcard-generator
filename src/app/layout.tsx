import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deck Mind",
  description: "Ai FlashCard Maker || Coming Soon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism,
        variables: { colorPrimary: "#3371FF" },
      }}
    >
      
      <html lang="en">
        <body className={inter.className}>{children}</body>
      <div className="absolute bottom-0 m-7 right-0">
      <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8", // Smaller avatar size
                  userButtonPopoverCard: "bg-white shadow-lg", // Card styling
                },
              }}
            /></div> 
      </html>
    </ClerkProvider>
  );
}
