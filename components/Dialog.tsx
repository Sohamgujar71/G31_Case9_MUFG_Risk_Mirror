// components/ui/Dialog.tsx
import React from "react";

export const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">{children}</div>
    </div>
  );
};

export const DialogHeader = ({ children }: any) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }: any) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

export const DialogContent = ({ children }: any) => <div>{children}</div>;
