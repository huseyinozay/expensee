// "use client";

// import { usePathname } from "next/navigation";
// import { Providers } from "@/redux/provider";
// import "@/i18/i18";
// import Header from "@/components/Layouts/Header";
// import QueryProvider from "@/utils/QueryProvider";
// import { isAuthPages } from "@/utils/utils";
// import "@fabrikant-masraff/masraff-core/dist/blocks/blocks.css";
// import "./globals.css";
// import { UserProvider } from "@/context/user";
// import { useEffect, useState } from "react";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   return (
//     <html lang="en">
//       <body>
//         <QueryProvider>
//           <UserProvider>
//             <Providers>
//               {isAuthPages(pathname)
//                 ? isMounted && children
//                 : isMounted && <Header>{children}</Header>}
//             </Providers>
//           </UserProvider>
//         </QueryProvider>
//       </body>
//     </html>
//   );
// }

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
import { useEffect, useState } from "react";
import Masraff from "@/components/MasraffLayout/MasraffLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <UserProvider>
            <Providers>
              {isAuthPages(pathname)
                ? isMounted && children
                : isMounted && <Masraff>{children}</Masraff>}
            </Providers>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

