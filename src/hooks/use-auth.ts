import { useContext } from "react";
import { AuthContext } from "../providers/auth-provider";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return context;
};

export type AuthContext = ReturnType<typeof useAuth>;
