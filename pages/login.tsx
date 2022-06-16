import React from "react";
import { useForm, useToggle, upperFirst } from "@mantine/hooks";
import {
  TextInput,
  PasswordInput,
  Text,
  Button,
  Divider,
  Checkbox,
  Anchor,
  LoadingOverlay,
  PasswordInputProps,
  Loader,
} from "@mantine/core";

import { FcGoogle } from "react-icons/fc";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { getRefinedFirebaseAuthErrorMessage } from "../lib/helpers";
import CustomTextInput from "../components/CustomTextInput";
import ChooseUsername from "../components/ChooseUsername";
import { AuthAction, withAuthUser } from "next-firebase-auth";

function LoginPage() {
  const [type, toggle] = useToggle("Login", ["Login", "Register"]);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);
  const [error, setError] = useState("");
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validationRules: {
      email: (val) => /^\S+@\S+$/.test(val),
      password: (val) => val.length >= 6,
    },
  });

  const emailSignIn = async (email: string, password: string) => {
    if (type === "Login") {
      signInWithEmailAndPassword(auth, email, password)
        .then((credentials) => {
          const user = credentials.user;
          const userDocRef = doc(db, "users", user.uid);

          getDoc(userDocRef).then((doc) => {
            if (!doc.exists()) {
              setDoc(userDocRef, {
                createdAt: serverTimestamp(),
              });
            }
          });
        })
        .catch((err) => {
          if (err.code === "auth/user-not-found") {
            setError(
              "This email has not been registered yet. Consider registering."
            );
          } else if (err.code === "auth/wrong-password") {
            setError("Wrong password");
          } else {
            const message = getRefinedFirebaseAuthErrorMessage(err.message);
            setError(message);
          }
        });
    } else if (type === "Register") {
      createUserWithEmailAndPassword(auth, email, password)
        .then((credentials) => {
          const user = credentials.user;
          const userDocRef = doc(db, "users", user.uid);

          getDoc(userDocRef).then((doc) => {
            if (!doc.exists()) {
              setDoc(userDocRef, {
                createdAt: serverTimestamp(),
              });
            }
          });
        })
        .catch((err) => {
          if (err.code === "auth/email-already-exists") {
            setError("This email is already registered. Consider signing in.");
          } else {
            const message = getRefinedFirebaseAuthErrorMessage(err.message);
            setError(message);
          }
        });
    }
  };

  return (
    <div className="mx-auto w-[80vw] max-w-md mt-[5vh] p-6 rounded-xl relative">
      <LoadingOverlay
        visible={loading}
        overlayOpacity={0.5}
        overlayColor={"hsl(205, 32%, 16%)"}
        className="rounded-2xl"
        loaderProps={{
          size: "xl",
          color: "hsl(200, 50%, 48%)",
        }}
      />
      {user ? (
        username ? (
          <div className="flex justify-center">
            <button
              className="orangebutton text-2xl px-4"
              onClick={async () => {
                setLoading(true);
                await signOut(auth);
                setLoading(false);
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div>
            <ChooseUsername />
          </div>
        )
      ) : (
        <div>
          <div className="flex mt-4 w-full select-none cursor-pointer rounded-3xl text-contrast bg-darklight transition-all p-1 justify-center mx-auto hover:ring-1 ring-darksquare">
            <button
              onClick={async () => {
                setLoading(true);
                await googleSignIn();
                setLoading(false);
              }}
              className="flex items-center justify-center gap-2"
            >
              <FcGoogle size={36} radius="xl" />
              <Text weight={500}>Log in with Google</Text>
            </button>
          </div>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />

          <form
            onSubmit={form.onSubmit(() => {
              emailSignIn(form.values.email, form.values.password);
            })}
          >
            <div className="flex flex-col mt-4 space-y-1">
              <CustomTextInput
                required
                label="Email"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
              />

              <CustomPasswordInput
                required
                label="Password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  "Password should include at least 6 characters"
                }
              />
            </div>

            <p className="text-red-600 font-light text-sm mt-2">{error}</p>

            <div className="flex justify-between mt-6">
              <Anchor
                component="button"
                type="button"
                color="gray"
                onClick={() => toggle()}
                size="xs"
              >
                {type === "Register" ? (
                  <p>
                    {" "}
                    Already have an account?{" "}
                    <span className="text-description font-medium">Login</span>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{" "}
                    <span className="text-description font-medium">
                      Register
                    </span>
                  </p>
                )}
              </Anchor>
              <button className="orangebutton px-6">{type}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const googleSignIn = async () => {
  await signInWithPopup(auth, googleProvider)
    .then((res) => {
      const user = res.user;
      const userDocRef = doc(db, "users", user.uid);

      getDoc(userDocRef).then((doc) => {
        if (!doc.exists()) {
          setDoc(userDocRef, {
            createdAt: serverTimestamp(),
          });
        }
      });
    })
    .catch((e) => {
      const errorCode = e.code;
    });
};

function CustomPasswordInput({ ...rest }: PasswordInputProps) {
  return (
    <PasswordInput
      {...rest}
      variant="unstyled"
      classNames={{
        label: "text-contrast",
        input:
          "bg-darklight p-2 focus:bg-modalbg placeholder:text-slate-500 text-lg font-light focus:ring-indigo-400 focus:ring-2 text-white pl-6 px-2 h-10 transition-all rounded-lg hover:ring-1 ring-darksquare",
        innerInput:
          "bg-darklight p-2 focus:bg-modalbg placeholder:text-slate-500 sm:text-lg font-light text-white pl-6 px-2 h-10 transition-all rounded-l-lg hover:ring-1 ring-darksquare",
        visibilityToggle: "text-white hover:text-dark",
      }}
    />
  );
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(LoginPage);
