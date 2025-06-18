import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"; // Import ClerkProvider
import Providers from "./providers"; // Import your custom Providers

// Load the Google font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GPTGenius",
  description:
    "GPTGenius: Your AI language companion. Powered by OpenAI, it enhances your conversations, content creation, and more!",
};

// RootLayout component
export default function RootLayout({ children }) {
  return (
    // Ensure the frontendApi is set from the environment variable
    <ClerkProvider
      frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Providers>{children}</Providers> {/* Wrap children with Providers */}
        </body>
      </html>
    </ClerkProvider>
  );
}
