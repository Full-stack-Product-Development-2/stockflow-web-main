import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
