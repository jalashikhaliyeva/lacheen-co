import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ProductProvider } from "@/shared/context/ProductContext";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { I18nextProvider } from "react-i18next";
import i18n from "../locales/i18n";

import Spinner from "@/components/Spinner";
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      if (url !== router.asPath) {
        setLoading(true);
      }
    };

    const handleRouteChangeEnd = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);
    router.events.on("routeChangeError", handleRouteChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
      router.events.off("routeChangeError", handleRouteChangeEnd);
    };
  }, [router]);

  return (
    <>
      {loading && <Spinner />}
      <I18nextProvider i18n={i18n}>
        <ProductProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </ProductProvider>
      </I18nextProvider>
    </>
  );
}
