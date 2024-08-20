import { Exercises } from "@/db/schema";
import {
  faCheckCircle,
  faX,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface SelectExerciseCardProps {
  exercise: Exercises;
  isSelected: boolean;
  setWorkoutExercises: Dispatch<SetStateAction<number[]>>;
  workoutExercises: number[];
}

export default function SelectExerciseCard({
  exercise,
  isSelected,
  setWorkoutExercises,
  workoutExercises,
}: SelectExerciseCardProps) {
  function addExercise() {
    setWorkoutExercises([...workoutExercises, exercise.id]);
  }

  function extractExercise() {
    const newWorkoutExercises = workoutExercises.filter(
      (exerciseId) => exerciseId !== exercise.id
    );
    setWorkoutExercises(newWorkoutExercises);
  }

  return (
    <div
      className={`text-black flex gap-2 h-[30%] hover:bg-slate-50 ${
        isSelected && "bg-green-100 hover:bg-green-100"
      }`}
    >
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
        <p>{exercise.bodyPart.name} exercise</p>
      </div>
      {isSelected ? (
        <div className="w-[30%] flex justify-center items-center">
          <FontAwesomeIcon
            onClick={extractExercise}
            icon={faXmarkCircle}
            className="text-xl text-red-600 hover:cursor-pointer"
          />
        </div>
      ) : (
        <div className="w-[30%] flex justify-center items-center ">
          <FontAwesomeIcon
            onClick={addExercise}
            icon={faCheckCircle}
            className="text-xl text-blue-800 hover:cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
