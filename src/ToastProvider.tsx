import React, { createContext, useContext, useState, ReactNode } from "react";
import { ToastMessage } from "./types";

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let externalShowToast: ToastContextType["showToast"] = () => {};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  externalShowToast = showToast;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              marginBottom: "8px",
              padding: "10px 16px",
              background: t.type === "success" ? "#4caf50" : "#f44336",
              color: "#fff",
              borderRadius: "4px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function getToastCaller() {
  return externalShowToast;
}
