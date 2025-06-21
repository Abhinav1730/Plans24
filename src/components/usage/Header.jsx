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
  DialogTrigger,
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
    <div className="p-3 shadow-sm flex justify-between items-center px-5 bg-inherit border rounded-2xl border-white">
      <img src="/logo-plans24.png" className="w-24 rounded-full" />
      <div>
        {user ? (
          <div className="flex items-center gap-5">
            <Button
              varient="outline"
              className="rounded-full bg-white border border-red-600 text-red-600"
            >
              My Trips
            </Button>

            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  alt=""
                  className="h-[45px] w-[45px] rounded-full"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  LogOut
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialogueForLogin()}>Get Started</Button>
        )}
      </div>
      <Dialog open={openDialogForLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img
                className="w-24 rounded-full"
                src="/logo-plans24.png"
                alt=""
              />
              <h2 className="font-bold text-lg font-serif mt-7">
                Sign In With Google
              </h2>
              <p>Sign Into the Plans24 using Google Authentication securely</p>
              <Button
                onClick={loginWithGoogle}
                className="w-full mt-5 font-serif flex items-center"
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
