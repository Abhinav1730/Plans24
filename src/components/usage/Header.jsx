import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialogForLogin, setOpenDialogueForLogin] = useState(false);

  useEffect(() => {
    console.log(user);
  }, []);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInformation) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInformation?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInformation?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setOpenDialogueForLogin(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Google profile fetch failed:", error);
      });
  };

  return (
    <header className="p-4 bg-inherit border rounded-2xl border-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <img
          src="/logo-plans24.png"
          alt="Logo"
          className="w-24 rounded-full mx-auto sm:mx-0"
        />

        {/* Spacer to push profile dropdown right */}
        <div className="flex-1"></div>

        {/* Right side: if logged in, profile ic + dropdown; else Get Started */}
        {user ? (
          <Popover>
            <PopoverTrigger>
              <img
                src={user.picture}
                alt="User profile"
                className="h-11 w-11 rounded-full object-cover border border-gray-300 cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent className="min-w-[160px] p-2 rounded-lg shadow-lg bg-white">
              <a
                href="/create-trip"
                className="block px-4 py-2 rounded hover:bg-red-100 text-red-600 font-semibold cursor-pointer"
              >
                New Trip 📍
              </a>
              <a
                href="/my-trips"
                className="block px-4 py-2 rounded hover:bg-red-100 text-red-600 font-semibold cursor-pointer"
              >
                My Trips
              </a>
              <hr className="my-2 border-gray-300" />
              <button
                onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-600 font-semibold cursor-pointer"
              >
                Log Out
              </button>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            onClick={() => setOpenDialogueForLogin(true)}
            className="font-serif text-lg px-6 py-2 rounded-full"
          >
            Get Started
          </Button>
        )}
      </div>
      <Dialog open={openDialogForLogin} onOpenChange={setOpenDialogueForLogin}>
        <DialogContent>
          <DialogHeader>
            <img
              className="w-24 rounded-full mx-auto"
              src="/logo-plans24.png"
              alt="App Logo"
            />

            <DialogTitle className="font-serif text-2xl mt-7 text-center">
              Sign In With Google
            </DialogTitle>

            <DialogDescription className="font-serif text-base text-gray-600 text-center mb-6">
              Sign into Plans24 using secure Google Authentication
            </DialogDescription>

            <Button
              onClick={loginWithGoogle}
              className="w-full font-serif flex items-center justify-center gap-2 text-lg"
            >
              <FcGoogle className="h-7 w-7" /> Sign In
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;

