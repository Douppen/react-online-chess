import { TextInput } from "@mantine/core";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import debounce from "lodash.debounce";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserContext } from "../lib/context";

const ChooseUsername = () => {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooShort, setTooShort] = useState(false);

  const { user } = useContext(UserContext);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userDoc = doc(db, "users", user!.uid);
      const usernameDoc = doc(db, "usernames", formValue);

      const batch = writeBatch(db);
      batch.set(
        userDoc,
        {
          username: formValue,
          photoURL: user?.photoURL,
          displayName: user?.displayName,
          email: user?.email,
        },
        { merge: true }
      );

      batch.set(
        usernameDoc,
        { uid: user!.uid, createdAt: serverTimestamp() },
        { merge: true }
      );
      batch.commit();
    } catch (err) {
      throw new Error(
        "Error when writing username and user to database. User might not exist."
      );
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
      setTooShort(true);
    }

    if (val.length >= 3) {
      setTooShort(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(db, "usernames", username);
        const usernameDoc = await getDoc(ref);
        if (!usernameDoc.exists()) {
          // Username is not taken
          setIsValid(true);
          setLoading(false);
        } else {
          setIsValid(false);
          setLoading(false);
        }
      }
    }, 500),
    []
  );

  return (
    <div className="mx-auto w-[80vw] max-w-md mt-[5vh] border-2 p-6 rounded-xl relative border-tertiary">
      <div className="flex-col flex items-center">
        <p className="text-xl mb-4 text-primary">Please choose a username</p>
        <form
          className="flex space-x-1 mb-4"
          action="submit"
          onSubmit={onSubmit}
        >
          <TextInput
            placeholder="thegrandmaster"
            onChange={onChange}
            value={formValue}
          />
          <button
            type="submit"
            className={`${!isValid ? "disabled" : "button"} px-2`}
            disabled={!isValid}
          >
            Choose
          </button>
        </form>
        <UsernameMessage
          username={formValue}
          isValid={isValid}
          loading={loading}
          tooShort={tooShort}
        />
      </div>
    </div>
  );
};

interface MessageProps {
  username: string;
  isValid: boolean;
  loading: boolean;
  tooShort: boolean;
}

function UsernameMessage({
  username,
  isValid,
  loading,
  tooShort,
}: MessageProps) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (username && isValid) {
    return <p className="text-green-900">{username} is available!</p>;
  } else if (username && !isValid && tooShort) {
    return <p className="text-red-900">That username is too short!</p>;
  } else if (username && !isValid) {
    return <p className="text-red-900">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}

export default ChooseUsername;
