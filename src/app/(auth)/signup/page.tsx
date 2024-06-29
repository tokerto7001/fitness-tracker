import Image from "next/image";
import FitnessImage from "@/../public/fitness.webp";
import AuthenticationForm from "@/components/auth/authentication-form";

export default function SignUp() {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-2/5 hidden md:block">
        <Image
        src={FitnessImage}
        alt="Fitness Image"
        className="h-full"
        />
      </div>
      <div className="md:w-3/5 w-screen flex justify-center items-center">
        <AuthenticationForm authType="Register" />
      </div>
    </div>
  );
}
