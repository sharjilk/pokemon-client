import React from "react";
import Header from "../components/Header";
import { LayoutProps } from "@/type/types";
import { Toaster } from "@/components/ui/toaster";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
