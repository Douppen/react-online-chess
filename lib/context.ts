import { User } from "firebase/auth";
import { createContext } from "react";

export const UserContext = createContext<{
  user: User | null | undefined;
  username: string | null;
}>({ user: null, username: null });
