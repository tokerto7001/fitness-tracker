"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Exercises } from "@/db/schema";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faP, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteExerciseDialog from "./delete-exercise-dialog";
import UpdateExerciseDialog from "./update-exercise-dialog";

interface ExerciseCardProps {
  exercise: Exercises;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Card className="w-[60%] md:w-[85%] h-80 bg-white text-black rounded-xl shadow-xl relative overflow-hidden text-sm md:text-md">
      <div className="h-[60%] relative w-full">
        <CardHeader className="flex flex-row w-full justify-end items-start gap-3 p-1 absolute top-0 right-0 z-10 space-y-0">
          <UpdateExerciseDialog exerciseId={exercise.id} data={exercise} />
          <DeleteExerciseDialog exerciseId={exercise.id} />
        </CardHeader>
        <Image
          alt="exerciseImage"
          src={exercise.imageUrl}
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col items-center gap-3 h-full mt-3">
        <CardTitle className="text-center text-grass-green">
          {exercise.name}
        </CardTitle>
        <p className="text-center">{exercise.bodyPart.name} exercise</p>
        <p className="text-center">{exercise.description}</p>
      </div>
    </Card>
  );
}
