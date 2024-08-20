'use client';

import { Button } from "@/components/ui/button";
import AddWorkoutDialog from "@/components/workouts/add-workout-dialog";
import { getWorkouts } from "@/services/workouts";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function WorkoutsPage(){

    const { data, isLoading, error } = useQuery({
        queryKey: ["workouts"],
        queryFn: getWorkouts,
      });
    

    return (
        <div className="md:w-[80%] flex md:flex-row md:justify-between mx-auto pt-10">
            <div className="md:w-4/5 md:grid md:grid-cols-2 md:gap-5">
                Workout Cards
            </div>
            <div className="md:w-1/5 md:justify-end">
                <Link href='/add-workout'>
                <Button className="border border-grass-green w-32 h-12 rounded-md text-grass-green hover:bg-grass-green hover:text-white bg-inherit">Add Workout</Button>
                </Link>
            </div>
        </div>
    )
}