"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import i18n from "@/i18/i18";
//import { isAuthenticated, loginAsync } from "@/redux/features/user";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
import { useUserState } from "@/context/user";

export default function Login() {
  const dispatch = useAppDispatch();
  const { login, isAuthenticated } = useUserState();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = {
      grant_type: "password",
      username: email,
      password: password,
      client_id: "adminApp",
    };

    //dispatch(loginAsync(user));
    login(user);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/expense");
    }
  }, [isAuthenticated]);

  return (
    <div
      className={
        "full-screen login-background ma-display-flex ma-display-flex-align-items-center ma-display-flex-justify-content-center"
      }
    >
      <MaGrid rows={4} style={{ width: "50%", height: "50%" }}>
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
            <MaInput
              placeholder="e-mail"
              className="ma-display-fullwidth ma-size-margin-bottom-16"
              fullWidth
              value={email}
              onMaChange={(el) => setEmail(el.target.value)}
            ></MaInput>
            <MaInput
              placeholder="password"
              className="ma-display-fullwidth"
              type="password"
              fullWidth
              value={password}
              onMaChange={(el) => setPassword(el.target.value)}
              theme={MasraffTheme.light}
            ></MaInput>
            <MaButton
              fullWidth
              type="submit"
              colorType={MasraffColorType.Primary}
              className="ma-size-margin-top-32"
            >
              {i18n.t("labels.login")}
            </MaButton>
          </form>
        </MaGridRow>
      </MaGrid>
    </div>
  );
}
