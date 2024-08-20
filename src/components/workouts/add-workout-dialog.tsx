"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { getExercises } from "@/services/exercises";
import { ReactNode, useState } from "react";
import SelectExerciseCard from "./select-exercise-card";
import { Exercises } from "@/db/schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function AddWorkoutDialog() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => getExercises({}),
  });

  const [workoutExercises, setWorkoutExercises] = useState<number[]>([]);

  let jsxToRender: ReactNode;
  if (isLoading) {
    jsxToRender = <div>...Loading</div>;
  } else if (error) throw new Error();
  else {
    jsxToRender = (
      <div>
        <DialogTitle className="text-center text-blue-400">
          Add Workout
        </DialogTitle>
        <div className="w-[90%] m-auto">
        <Input
        name="workoutName"
        placeholder="name"
        className="w-[40%] h-10 mt-2"
        />
        </div>
        <div className="h-[85%] w-[90%] m-auto mt-2 p-1 bg-white overflow-y-scroll flex flex-col gap-3">
          {data?.data.map((exercise) => (
            <SelectExerciseCard
            workoutExercises={workoutExercises}
            setWorkoutExercises={setWorkoutExercises}
            isSelected={Boolean(workoutExercises.find((exerciseId) => exerciseId === exercise.id))}
            exercise={exercise} />
          ))}
        </div>
        <div className="w-full flex justify-center mt-2">
          <Button className="border bg-transparent text-grass-green border-grass-green hover:bg-grass-green hover:text-white">
            Add Workout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger className="border border-grass-green w-32 h-12 rounded-md text-grass-green hover:bg-grass-green hover:text-white">
          Add Workout
        </DialogTrigger>
        <DialogContent className="bg-slate-200 text-white h-[95%] border-none max-w-[40%]">
          {jsxToRender}
        </DialogContent>
      </Dialog>
    </div>
  );
}
