"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Exercises } from "@/db/schema";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

interface ExerciseCardProps {
  exercise: Exercises;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Card className="w-[60%] md:w-[75%] h-80  bg-black text-white border-orange-600  p-2">
      <CardHeader className="flex flex-row w-full h-[5%] justify-end items-end gap-3 p-0 m-0">
        <FontAwesomeIcon
          icon={faPen}
          className="hover:text-orange-600 cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faTrash}
          className="hover:text-orange-600 cursor-pointer"
        />
      </CardHeader>
      <div className="flex flex-col items-center justify-center gap-3 h-full">
        <CardTitle className="text-center text-orange-600">
          {exercise.name}
        </CardTitle>
        <div className="h-36">
          <CardDescription>
            <Image
              alt="exerciseImage"
              src={exercise.imageUrl}
              width={200}
              height={200}
            />
          </CardDescription>
        </div>
        <p className="text-center">{exercise.bodyPart.name} exercise</p>
        <p className="text-center">{exercise.description}</p>
      </div>
    </Card>
  );
}
