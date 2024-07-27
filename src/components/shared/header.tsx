'use client';
import { AuthContext } from "@/context/authContext";
import Link from "next/link";
import { useContext } from "react";
import { signout } from "@/actions";
import CustomButton from "./button";

export default function Header() {

  const { user } = useContext(AuthContext);

  return (
    <div className="h-20 flex justify-between px-20 items-center shadow-md">
      <div className="w-2/3">
        <Link href='/'>Dashboard</Link>
      </div>
      <div className="flex justify-between w-1/3 items-center">
        <Link className="hover:text-grass-green" href='/workouts'><span>Workouts</span></Link>
        <Link className="hover:text-grass-green" href='/schedule'><span>Records</span></Link>
        <Link className="hover:text-grass-green" href='/profile'><span>Profile</span></Link>
        <form action={signout}>
          <CustomButton
          className="bg-transparent hover:bg-grass-green hover:text-white border-grass-green border text-grass-green"
          type="submit"
          >Logout</CustomButton>
        </form>
      </div>
    </div>
  );
}
