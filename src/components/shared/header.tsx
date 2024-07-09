import Link from "next/link";

export default function Header() {
  return (
    <div className=" border-b border-orange-500 h-20 text-white flex justify-between px-20 items-center">
      <div className="w-2/3">
        <Link href='/'>Dashboard</Link>
      </div>
      <div className="flex justify-between w-1/3">
        <Link href='/workouts'><span>My Workouts</span></Link>
        <Link href='/schedule'><span>My Records</span></Link>
        <Link href='/profile'><span>Profile</span></Link>
      </div>
    </div>
  );
}
