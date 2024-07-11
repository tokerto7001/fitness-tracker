'use client';
import { AuthContext } from "@/context/authContext";
import Link from "next/link";
import { useContext } from "react";
import { signout } from "@/actions";
import CustomButton from "./button";

export default function Header() {

  const { user } = useContext(AuthContext);

  return (
    <div className=" border-b border-orange-500 h-20 text-white flex justify-between px-20 items-center">
      <div className="w-2/3">
        <Link href='/'>Dashboard</Link>
      </div>
      <div className="flex justify-between w-1/3 items-center">
        <Link className="hover:text-orange-600" href='/workouts'><span>My Workouts</span></Link>
        <Link className="hover:text-orange-600" href='/schedule'><span>My Records</span></Link>
        <Link className="hover:text-orange-600" href='/profile'><span>Profile</span></Link>
        <form action={signout}>
          <CustomButton
          className="bg-transparent hover:bg-orange-600"
          type="submit"
          >Logout</CustomButton>
        </form>
      </div>
    </div>
  );
}
