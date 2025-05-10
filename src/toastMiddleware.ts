import type { Middleware } from "@reduxjs/toolkit";
import { getToastCaller } from "./ToastProvider";

export const toastMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);

  const toast = getToastCaller();

  // Only handle async thunks
  if (action.type.endsWith("/fulfilled")) {
    const message = action.payload?.message;
    if (message) {
      toast(message, "success");
    }
  }

  if (action.type.endsWith("/rejected")) {
    const errorMessage =
      action.payload?.message ||
      action.error?.message ||
      "Something went wrong";
    toast(errorMessage, "error");
  }

  return result;
};
