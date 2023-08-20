import "./globals.css";

import { Suspense } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProductDataContext from "@/context/ProductContext";
import ToasterContext from "@/context/ToasterContext";
// import { ThemeProvider } from "@/context/ThemeProvider";

import CartBase from "./cart/CartBase";
import SearchBase from "./search/SearchBase";
import CustomIcons from "./utils/CustomIcons";
import SideBarBase from "./sidebar/SideBarBase";

import NextTopLoader from "nextjs-toploader";
import ScrollToTopButton from "./components/ScrollToTop";
import CustomCursor from "./components/CustomCursor";
import SmoothScroller from "./components/SmoothScroller";
import { MyThemeContextProvider } from "@/store/MyThemeContextProvider";
// import Providers from "./providers";

export const metadata = {
  title: "My Nemesis 6.0",
  description:
    "Full Stack page offering product market display based on ethio machineries",
};

export default function RootLayout({ children }) {
  // const theme = hasCookie("Theme") && getCookie("Theme");
  // const currentTheme = theme && theme !== undefined ? theme : "light";
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* <Providers> */}
        <MyThemeContextProvider>
          <SmoothScroller />
          <ProductDataContext>
            {/* <ThemeProvider attribute="class"> */}
            <CustomIcons>
              <CustomCursor>
                <ToasterContext />
                <div className="flex flex-col justify-between h-full overflow-x-hidden no-scrollbar overflow-y-auto overscroll-y-none relative transition-all ease-in-out duration-1000">
                  <CartBase>
                    <SearchBase>
                      <Navbar />
                    </SearchBase>
                    <NextTopLoader showSpinner={false} />
                  </CartBase>
                  <div className="text-sm text-neutral-800 dark:text-neutral-200 z-30">
                    <Suspense>
                      <SideBarBase />
                    </Suspense>
                  </div>
                  <ScrollToTopButton>
                    <div className={`min-h-screen`}>{children}</div>
                  </ScrollToTopButton>
                  <div className="w-full">
                    <Footer />
                  </div>
                </div>
              </CustomCursor>
            </CustomIcons>
            {/* </ThemeProvider> */}
          </ProductDataContext>
        </MyThemeContextProvider>
        {/* </Providers> */}
      </body>
    </html>
  );
}
