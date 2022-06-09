import { onIdTokenChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import nookies from "nookies";

// Custom hook for retrieving the current user and username whenever the user changes
export function useUserData(): {
  user: User | null | undefined;
  username: string | null;
  authLoading: boolean;
} {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, "token", token, { path: "/" });
      }
    });
  }, []);

  return { user, username, authLoading: isLoading };
}
