"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          icon: "group-[.toast]:text-primary",
          success: "border-emerald-500/30",
          error: "border-rose-500/30",
          warning: "border-amber-500/30",
          info: "border-blue-500/30",
        },
        style: {
          background:
            theme === "dark"
              ? "linear-gradient(135deg, #1f1f1f, #2d1a23)" // Dark background with rose tint
              : "linear-gradient(135deg, #fff, #fff5f7)", // White with subtle rose tint
          border: theme === "dark" ? "1px solid #be185d" : "1px solid #fecdd3",
          color: theme === "dark" ? "#f9a8d4" : "#881337",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          backdropFilter: "blur(10px)",
          boxShadow:
            theme === "dark"
              ? "0 10px 25px -5px rgba(190, 24, 93, 0.25), 0 8px 10px -6px rgba(190, 24, 93, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
              : "0 10px 25px -5px rgba(254, 205, 211, 0.5), 0 8px 10px -6px rgba(254, 205, 211, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
          padding: "12px 16px",
        },
      }}
      icons={{
        success: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        error: <XCircle className="w-5 h-5 text-rose-600" />,
        warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
        info: <Info className="w-5 h-5 text-blue-600" fill="currentColor" />,
      }}
      style={{
        "--normal-bg":
          theme === "dark"
            ? "linear-gradient(135deg, #1f1f1f, #2d1a23)"
            : "linear-gradient(135deg, #fff, #fff5f7)",
        "--normal-text": theme === "dark" ? "#f9a8d4" : "#881337",
        "--normal-border": theme === "dark" ? "#be185d" : "#fecdd3",
        "--success-bg": theme === "dark" ? "#052e16" : "#f0fdf4",
        "--success-text": theme === "dark" ? "#86efac" : "#166534",
        "--success-border": theme === "dark" ? "#16a34a" : "#bbf7d0",
        "--error-bg": theme === "dark" ? "#2c0a0a" : "#fef2f2",
        "--error-text": theme === "dark" ? "#fca5a5" : "#991b1b",
        "--error-border": theme === "dark" ? "#dc2626" : "#fecaca",
        "--warning-bg": theme === "dark" ? "#431407" : "#fffbeb",
        "--warning-text": theme === "dark" ? "#fdba74" : "#9a3412",
        "--warning-border": theme === "dark" ? "#ea580c" : "#fed7aa",
        "--info-bg": theme === "dark" ? "#082f49" : "#f0f9ff",
        "--info-text": theme === "dark" ? "#93c5fd" : "#1e40af",
        "--info-border": theme === "dark" ? "#0284c7" : "#bfdbfe",
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
