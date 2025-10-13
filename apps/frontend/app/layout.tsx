import type { Metadata } from "next";
import { AppProviders } from "../contexts/AppProviders";

export const metadata: Metadata = {
  title: "Bullet Calendar",
  description: "A modern bullet journal calendar application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
