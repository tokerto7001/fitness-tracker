import { Exercises } from "@/db/schema";
import { faCheckCircle, faX, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface SelectExerciseCardProps {
  exercise: Exercises;
}

export default function SelectExerciseCard({
  exercise,
}: SelectExerciseCardProps) {

  return (
    <div className="text-black flex gap-2 h-[30%] hover:bg-slate-50">
        <div className="w-[40%] h-[100%] relative">
        <Image
        alt="exerciseImage"
        src={exercise.imageUrl}
        fill={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
        </div>
        <div className="w-[30%]">
            <p className="text-grass-green">{exercise.name}</p>
            <p>{exercise.description.slice(0,20)}...</p>
        </div>
        <div className="w-[10%] flex justify-center items-center ">
            <FontAwesomeIcon icon={faCheckCircle} className="text-xl text-blue-800 hover:cursor-pointer"/>
        </div>
        <div className="w-[10%] flex justify-center items-center">
            <FontAwesomeIcon icon={faXmarkCircle} className="text-xl text-red-600 hover:cursor-pointer"/>
        </div>
    </div>
  );
}
