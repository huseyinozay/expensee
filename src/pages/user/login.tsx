import {
  MasraffColorType,
  MasraffTheme,
} from "@fabrikant-masraff/masraff-core";
import {
  MaCard,
  MaButton,
  MaSpacer,
  MaInput,
  MaGridRow,
  MaGrid,
  MaGridColumn,
} from "@fabrikant-masraff/masraff-react";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { isAuthenticated, loginAsync, selectUser } from "@/store/user/user";
import { useRouter } from "next/router";
import i18n from "@/plugins/i18n";

export default function Login() {
  const env_ex = process.env.ENV_VARIABLE;
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = {
      grant_type: "password",
      username: email,
      password: password,
      client_id: "adminApp",
    };
    //@ts-ignore
    dispatch(loginAsync(user));
  };
  const isLogedIn = useAppSelector(isAuthenticated);
  if (isLogedIn) {
    router.push("/expense");
  }

  return (
    <div
      className={
        "ma-display-flex ma-display-flex-align-items-center ma-display-flex-justify-content-center all-page login-background"
      }
    >
      <MaGrid rows={4}>
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
