// utils/useAxiosSecure.js
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthContext";

export const useAxiosSecure = () => {
  const { user } = useContext(AuthContext);

  const instance = axios.create({
    // baseURL: "https://server-tawny-mu.vercel.app/",
    baseURL: "http://localhost:3000",
    headers: user?.accessToken
      ? {
          Authorization: `Bearer ${user.accessToken}`,
        }
      : {},
  });

  return instance;
};
