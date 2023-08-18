"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useUserState } from "@/context/user";
import Image from "next/image";
import i18n from "@/i18/i18";
import {
  MasraffColorType,
  MasraffTheme,
} from "@fabrikant-masraff/masraff-core";
import {
  MaButton,
  MaInput,
  MaGridRow,
  MaGrid,
} from "@fabrikant-masraff/masraff-react";
import "../globals.css";

export default function Login() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useUserState();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoginLoading(true);
    const user = {
      grant_type: "password",
      username: email,
      password: password,
      client_id: "adminApp",
    };

    login(user);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/expense");
      setTimeout(() => {
        setLoginLoading(false);
      }, 1000);
    }
  }, [isAuthenticated]);

  return (
    <div
      className={
        "full-screen login-background ma-display-flex ma-display-flex-align-items-center ma-display-flex-justify-content-center"
      }
    >
      <MaGrid rows={4} style={{ width: "33%", height: "33%" }}>
        <MaGridRow>
          <div className={"image-container ma-size-margin-bottom-32"}>
            <Image
              src="/logo.png"
              fill
              alt="masraff logo"
              className="image"
              priority
            />
          </div>
        </MaGridRow>

        <MaGridRow>
          <form onSubmit={handleSubmit}>
            {!loginLoading ? (
              <>
                <MaInput
                  placeholder={t("labels.email")}
                  className="ma-display-fullwidth ma-size-margin-bottom-16"
                  fullWidth
                  value={email}
                  onMaChange={(el) => setEmail(el.target.value)}
                ></MaInput>
                <MaInput
                  placeholder={t("labels.password")}
                  className="ma-display-fullwidth"
                  type="password"
                  fullWidth
                  value={password}
                  onMaInput={(el) => setPassword(el.target.value)}
                  theme={MasraffTheme.light}
                  shouldSelectValueOnFocus
                ></MaInput>
                <MaButton
                  fullWidth
                  type="submit"
                  colorType={MasraffColorType.Primary}
                  onMaClick={handleSubmit}
                  className="ma-size-margin-top-32"
                >
                  {i18n.t("labels.login")}
                </MaButton>
              </>
            ) : (
              <div style={{ marginTop: "60px" }} className="book">
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
            )}
          </form>
        </MaGridRow>
      </MaGrid>
    </div>
  );
}
