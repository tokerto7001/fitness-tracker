"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Exercises } from "@/db/schema";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import DeleteExerciseDialog from "./delete-exercise-dialog";
import UpdateExerciseDialog from "./update-exercise-dialog";

interface ExerciseCardProps {
  exercise: Exercises;
  parentComponent: "exercises" | "workouts";
  addExercise?: (exercise: Exercises) => void;
  deleteExercise?: Function;
  isAdded?: boolean;
}

export default function ExerciseCard({
  exercise,
  parentComponent,
  addExercise,
  deleteExercise,
  isAdded = false
}: ExerciseCardProps) {
  return (
    <Card
      className={`w-[60%] md:w-[85%] bg-white relative group  ${
        parentComponent === "workouts" ? "hover:cursor-pointer" : ""
      }`}
      onClick={() => parentComponent === 'workouts' && addExercise!(exercise)}
    >
      <div
        className={`text-black rounded-xl shadow-xl relative overflow-hidden text-sm md:text-md h-72 transition-opacity duration-200 ease-in-out ${
          parentComponent === "workouts" ? "hover:opacity-5" : ""
        }
        ${
          parentComponent === 'workouts' && isAdded ? 'opacity-5' : ''
        }
        `
      }
      >
        <div className="h-2/3 relative w-full">
          <CardHeader className="flex flex-row w-full justify-end items-start gap-3 p-1 absolute top-0 right-0 z-10 space-y-0">
            {parentComponent === "exercises" ? (
              <>
                <UpdateExerciseDialog
                  exerciseId={exercise.id}
                  data={exercise}
                />
                <DeleteExerciseDialog exerciseId={exercise.id} />
              </>
            ) : null}
          </CardHeader>
          <Image
            alt="exerciseImage"
            src={exercise.imageUrl}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col items-center h-1/3 mt-1">
          <CardTitle className="text-center text-grass-green">
            {exercise.name}
          </CardTitle>
          <p className="text-center">{exercise.bodyPart.name} exercise</p>
          <p className="text-center">{exercise.description.slice(0, 20)}...</p>
        </div>
      </div>
      {parentComponent === "workouts" ? (
        <FontAwesomeIcon
          icon={isAdded ? faCheckCircle : faPlusCircle}
          className={`text-blue-800 absolute transform -translate-x-1/2 -translate-y-1/2 top-[50%] left-[50%] invisible group-hover:visible pointer-events-none text-5xl ${
            parentComponent === 'workouts' && isAdded ? 'visible' : ''
          }`}
        />
      ) : null}
    </Card>
  );
}
