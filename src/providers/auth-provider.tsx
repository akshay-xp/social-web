import { ReactNode, createContext, useState } from "react";

type Auth = {
  accessToken: string;
};

type AuthProviderPRops = {
  children: ReactNode;
};

type AuthProviderState = {
  auth: Auth;
  setAuth: (auth: Auth) => void;
};

const initialState: AuthProviderState = {
  auth: { accessToken: "" },
  setAuth: () => null,
};

export const AuthContext = createContext<AuthProviderState>(initialState);

export const AuthProvider = ({ children }: AuthProviderPRops) => {
  const [auth, setAuth] = useState<Auth>({ accessToken: "" });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
