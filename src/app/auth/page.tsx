"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/api/test";
import { Input } from "@/modules/common/input";
import { Button } from "@/modules/common/button";
import { AppDispatch, RootState } from "@/store/store";
import {
  logIn,
  logOut,
  loading as loadingSlice,
} from "@/store/reducers/auth-slice";
import { useAppSelector } from "@/store/hooks";
import CircularWithValueLabel from "@/modules/UI/CircularLoader";

type LoginResponse = {
  data: {
    user: {
      uid: "";
      userName: "";
      email: "";
    };
    token: "";
  };
};

export default function Login() {
  const user = useAppSelector((state) => state.auth.data.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      dispatch(loadingSlice(true));
      const response = (await loginUser({
        email: email,
        password: password,
      })) as LoginResponse;

      const { user, token } = response.data;

      if (response.data) {
        dispatch(logIn({ user, token: token }));
        console.log("Login successful:", response.data);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  console.log("Current state: ", user);

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <div className="flex justify-center items-center p-8">
      <div className="flex flex-col gap-4 justify-center items-center bg-cyan-900 w-64 p-4 h-auto">
        <h1>
          Username: {!loading && user.userName}{" "}
          {loading && <CircularWithValueLabel />}
        </h1>
        {user.isAuth ? <Button name="Logout" onClick={handleLogout} /> : null}
        <div>Email</div>
        <div>
          <Input value={email} onChange={handleEmailChange} />
        </div>
        <div>Password</div>
        <div>
          <Input value={password} onChange={handlePasswordChange} />
        </div>
        <Button name="Login" onClick={handleLogin} />
      </div>
    </div>
  );
}
