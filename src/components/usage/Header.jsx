import React from "react";
import { Button } from "../ui/button";

function Header() {
  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5 bg-inherit border rounded-2xl border-white">
      <img src="/logo-plans24.png" className="w-24 rounded-full" />
      <div>
        <Button>Sign In</Button>
      </div>
    </div>
  );
}

export default Header;
