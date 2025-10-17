"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export default function Modal({ isOpen, onClose, title, children, size = "2xl" }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-7xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn overflow-y-auto p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Responsive */}
      <div className={`relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full ${sizeClasses[size]} my-4 sm:my-8 animate-slideUp max-h-[95vh] sm:max-h-none flex flex-col`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-gray-200 sticky top-0 bg-white rounded-t-xl sm:rounded-t-2xl z-10 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
      </div>
    </div>
  );
}
