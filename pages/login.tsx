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

export default function LoginForm() {
  const [type, toggle] = useToggle("Login", ["Login", "Register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validationRules: {
      email: (val) => /^\S+@\S+$/.test(val),
      password: (val) => val.length >= 6,
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = useContext(UserContext);

  // ! user below might cause errors. Should be uid?

  return (
    <div className="mx-auto w-[80vw] sm:w-[70vw] max-w-xl mt-[5vh] border-2 p-6 rounded-xl relative">
      <LoadingOverlay visible={loading} />
      {user ? (
        <button
          className="bg-blue-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition-all duration-75"
          onClick={async () => {
            setLoading(true);
            await signOut(auth);
            setLoading(false);
          }}
        >
          Sign out
        </button>
      ) : (
        <div>
          <Text size="xl" weight={500} align="center">
            {type}
          </Text>

          <div className="flex mt-4 select-none cursor-pointer active:translate-y-1 active:scale-[99%] active:bg-transparent duration-[50ms] border-2 rounded-3xl border-red-600 text-red-600 hover:bg-red-100 transition-all p-1 w-1/2 justify-center mx-auto">
            <button
              onClick={async () => {
                setLoading(true);
                await googleSignIn();
                setLoading(false);
                router.push("/");
              }}
              className="flex items-center justify-center gap-2"
            >
              <FcGoogle size={40} radius="xl" />
              <Text weight={500}>Google</Text>
            </button>
          </div>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />

          <form onSubmit={form.onSubmit(() => {})}>
            <div className="flex flex-col mt-4 space-y-1">
              {type === "register" && (
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(event) =>
                    form.setFieldValue("name", event.currentTarget.value)
                  }
                />
              )}

              <TextInput
                required
                label="Email"
                placeholder="hello@mantine.dev"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  "Password should include at least 6 characters"
                }
              />

              {type === "register" && (
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                />
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Anchor
                component="button"
                type="button"
                color="gray"
                onClick={() => toggle()}
                size="xs"
              >
                {type === "register"
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Anchor>
              <Button
                className="text-blue-700 border-2 border-blue-700 hover:bg-blue-200 transition-all"
                type="submit"
              >
                {upperFirst(type)}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

async function googleSignIn() {
  await signInWithPopup(auth, googleProvider)
    .then((res) => {
      const user = res.user;
      const userDocRef = doc(db, "users", user.uid);

      getDoc(userDocRef).then((doc) => {
        if (doc.exists()) return;
        setDoc(userDocRef, {
          displayName: user.displayName,
          createdAt: serverTimestamp(),
        });
      });
    })
    .catch((e) => {
      console.log(e.code, e.message);
    });
}
