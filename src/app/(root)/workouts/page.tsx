"use client";

import { Button } from "@/components/ui/button";
import AddWorkoutDialog from "@/components/workouts/add-workout-dialog";
import { getWorkouts } from "@/services/workouts";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import LoadingGif from "@/../public/loading.gif";

export default function WorkoutsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["workouts"],
    queryFn: getWorkouts,
  });

  return (
    <div className="md:w-[80%] flex md:flex-row md:justify-between mx-auto pt-10">
      {isLoading ? (
        <div className="w-96 h-96 m-auto">
          <Image src={LoadingGif} alt="Loading" />
        </div>
      ) : (
        <div className="md:w-4/5 md:grid md:grid-cols-2 md:gap-5">
          Workout Cards
        </div>
      )}

      <div className="md:w-1/5 md:justify-end">
        <Link href="/add-workout">
          <Button className="border border-grass-green w-32 h-12 rounded-md text-grass-green hover:bg-grass-green hover:text-white bg-inherit">
            Add Workout
          </Button>
        </Link>
      </div>
    </div>
  );
}
