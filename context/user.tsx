import { useState, useContext, createContext, useEffect } from "react";
import ApiService from "@/app/api/route";
import Cookies from "js-cookie";

const api = new ApiService();

interface AuthData {
  grant_type: string;
  username: string;
  password: string;
  client_id: string;
}

export interface User {
  [key: string]: any;
}

export interface AuthState {
  user: User | undefined;
  token: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {},
  token: "",
  isAuthenticated: false,
};

type UserState = {
  user: any;
  userId: string;
  token: string | undefined;
  status: string;
  logoutUser: () => void;
  login: (AuthData: AuthData) => Promise<any>;
  isAuthenticated: boolean;
};

//@ts-ignore
const UserStateContext = createContext<UserState>();

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState("loading");
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [userId, setUserId] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logoutUser = () => {
    window.localStorage.removeItem("nf-session");
    window.location.reload();
  };

  async function login(authData: AuthData) {
    try {
      const response: any = await api.post("token", authData);
      console.log("post token resppp::", response);
      setUser(response);
      setUserId(response.userId);
      setStatus("loaded");
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response));
      Cookies.set("token", response.access_token);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      console.log("err::", err);
      return err.response;
    }
  }
  const state = {
    user,
    userId,
    token,
    status,
    isAuthenticated,
    logoutUser,
    login,
  };

  useEffect(() => {
    if (!user || !token) {
      //@ts-ignore
      setUser(JSON.parse(localStorage.getItem("user")));
      //@ts-ignore
      setUserId(JSON.parse(localStorage.getItem("user"))?.userId);
      //@ts-ignore
      setToken(localStorage.getItem("access_token"));
    }
    //@ts-ignore
    console.log("user::", JSON.parse(localStorage.getItem("user")));
  }, []);

  return (
    <UserStateContext.Provider value={state}>
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const state = useContext(UserStateContext);

  if (state === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }

  return state;
}
