import "@/styles/globals.scss";
import "@fabrikant-masraff/masraff-core/dist/blocks/blocks.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../store";
import Head from "next/head";
import Header from "@/layouts/header";
import Login from "./user/login";
import ApiService from "@/services/apiService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MaDateInput } from "@fabrikant-masraff/masraff-react";
import { useRouter } from "next/router";
import "@/plugins/i18n";

const api = new ApiService();
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const isLoggedIn = store.getState().auth.isAuthenticated;
  const [token, setToken]: any = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("access_token"));
  }, []);

  const pathName = useRouter().pathname;
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {pathName.startsWith("/user") ? (
          <Component {...pageProps} />
        ) : (
          <Header>
            <Component {...pageProps} />
          </Header>
        )}
      </QueryClientProvider>
    </Provider>
  );
}
