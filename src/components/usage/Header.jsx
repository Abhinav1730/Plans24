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
} from "../ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { CiCirclePlus } from "react-icons/ci";

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
    <div className="p-3 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 px-5 bg-inherit border rounded-2xl border-white">
      <img src="/logo-plans24.png" className="w-24 rounded-full" alt="Logo" />

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        {user ? (
          <>
            <a href="/create-trip">
              <Button
                varient="outline"
                className="rounded-full bg-white border border-red-600 text-red-600 hover:bg-white"
              >
                New Trip <CiCirclePlus />
              </Button>
            </a>

            <a href="/my-trips">
              <Button
                varient="outline"
                className="rounded-full bg-white border border-red-600 text-red-600 hover:bg-white"
              >
                My Trips
              </Button>
            </a>

            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  alt="User profile"
                  className="h-10 w-10 sm:h-11 sm:w-11 md:h-[45px] md:w-[45px] rounded-full object-cover border border-gray-300"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer text-red-500 font-semibold"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Log Out
                </h2>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button onClick={() => setOpenDialogueForLogin(true)}>
            Get Started
          </Button>
        )}
      </div>

      <Dialog open={openDialogForLogin} onOpenChange={setOpenDialogueForLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-center">
              <img
                className="w-24 rounded-full mx-auto"
                src="/logo-plans24.png"
                alt="App Logo"
              />
              <h2 className="font-bold text-lg font-serif mt-7">
                Sign In With Google
              </h2>
              <p>Sign into Plans24 using secure Google Authentication</p>
              <Button
                onClick={loginWithGoogle}
                className="w-full mt-5 font-serif flex items-center justify-center gap-2"
              >
                <FcGoogle className="h-7 w-7" /> Sign In
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;

