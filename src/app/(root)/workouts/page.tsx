'use client';

import { getWorkouts } from "@/services/workouts";
import { useQuery } from "@tanstack/react-query";

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
                Add workout Trigger
            </div>
        </div>
    )
}