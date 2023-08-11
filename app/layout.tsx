"use client";

import { usePathname } from "next/navigation";
import { Providers } from "@/redux/provider";
import "@/i18/i18";
import Header from "@/components/Layouts/Header";
import QueryProvider from "@/utils/QueryProvider";
import { isAuthPages } from "@/utils/utils";
import "@fabrikant-masraff/masraff-core/dist/blocks/blocks.css";
import "./globals.css";
import { UserProvider } from "@/context/user";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <UserProvider>
            <Providers>
              {isAuthPages(pathname) ? children : <Header>{children}</Header>}
            </Providers>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
