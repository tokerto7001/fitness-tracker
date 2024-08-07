'use client';

import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { getExercises } from "@/services/exercises";
import { ReactNode, useState } from "react";
import SelectExerciseCard from "./select-exercise-card";
import { Exercises } from "@/db/schema";
import { Button } from "../ui/button";

export default function AddWorkoutDialog(){

    const { data, isLoading, error } = useQuery({
        queryKey: ["exercises"],
        queryFn: () => getExercises({}),
      });

    const [workout, setWorkout] = useState<Exercises[]>([]);  

    let jsxToRender: ReactNode;
    if(isLoading) {
        jsxToRender = (
            <div>
                ...Loading
            </div>
        );
    } else if (error) throw new Error();
    else {
        jsxToRender = (
            <div>
            <DialogTitle className="text-center text-white">
                Add Workout
            </DialogTitle>
            <div className="h-[85%] w-[90%] m-auto mt-6 p-1 bg-white overflow-y-scroll flex flex-col gap-3">
                {
                    data?.data.map((exercise) => (
                        <SelectExerciseCard 
                            exercise={exercise}
                        />
                    ))
                }
            </div>
            <div className="w-full flex justify-center mt-2">
                <Button className="border bg-transparent text-grass-green border-grass-green hover:bg-grass-green hover:text-white">Add Workout</Button>
            </div>
            </div>
        )
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger className="border border-grass-green w-32 h-12 rounded-md text-grass-green hover:bg-grass-green hover:text-white">
                    Add Workout
                </DialogTrigger>
                <DialogContent className="bg-slate-200 text-white h-[80%] border-none max-w-[40%]">
                    {jsxToRender}
                </DialogContent>
            </Dialog>
        </div>
    )
}