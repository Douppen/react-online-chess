import { User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GameModalProps } from "../types/types";
import { auth, db } from "./firebase";

// Custom hook for retrieving the current user and username whenever the user changes
export function useUserData(): {
  user: User | null | undefined;
  username: string | null;
  authLoading: boolean;
} {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const ref = doc(db, "users", user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
        setIsLoading(false);
      });
    } else {
      setUsername(null);
      setIsLoading(false);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, authLoading: isLoading };
}
