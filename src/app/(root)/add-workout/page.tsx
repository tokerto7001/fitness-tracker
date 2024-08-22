"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBodyParts } from "@/services";
import { getExercises } from "@/services/exercises";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useRef } from "react";
import LoadingGif from "@/../public/loading.gif";
import ExerciseCard from "@/components/exercises/exercise-card";
import Pagination from "@/components/shared/pagination";
import BodyPartSelect from "@/components/exercises/body-part-select";

interface AddWorkoutProps {
  searchParams: {
    page: string;
    bodyPartId?: string;
  };
}

export default function AddWorkout({ searchParams }: AddWorkoutProps) {
  const inputValue = useRef("");

  const { page = 1, bodyPartId = 0 } = searchParams;
  if (isNaN(+page) || !bodyPartId)
    redirect(`/add-workout?page=1&bodyPartId=${bodyPartId}`);

  const requestParams = {
    page: +page,
    ...(bodyPartId &&
      bodyPartId !== "0" && {
        bodyPartId: +bodyPartId,
      }),
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`exercises`, { page, bodyPartId }],
    queryFn: () => getExercises(requestParams),
  });

  const {
    data: bodyPartData,
    isLoading: bodyPartLoading,
    error: bodyPartError,
  } = useQuery({
    queryKey: ["bodyParts"],
    queryFn: getBodyParts,
  });

  if (error || bodyPartError) throw new Error();

  return (
    <>
      <div className="md:w-[90%] w-full mx-auto md:h-screen pt-10">
        {isLoading ? (
          <div className="w-96 h-96 m-auto">
            <Image src={LoadingGif} alt="Loading" />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 md:flex-row-reverse">
              <div className="md:w-1/6 w-full flex flex-col items-center gap-3">
                <BodyPartSelect data={bodyPartData} loading={bodyPartLoading} />
                <Label htmlFor="workoutName">Workout Name</Label>
                <Input
                  name="workoutName"
                  id="workoutName"
                  onChange={(event) =>
                    (inputValue.current = event.target.value)
                  }
                  className="h-8 md:w-[80%] sm:w-[20%] w-[25%]"
                />
              </div>
              <div className="md:w-5/6  w-full ">
                <div className="md:grid md:grid-cols-3 md:gap-5 flex flex-col items-center gap-8 md:items-stretch">
                  {data &&
                    data.data.map((exercise) => (
                      <ExerciseCard
                        parentComponent="workouts"
                        exercise={exercise}
                        key={exercise.id}
                      />
                    ))}
                </div>

                <div className="w-full flex justify-center">
                  <Pagination
                    currentPage={+page}
                    baseUrlToNavigate={
                      bodyPartId ? `/add-workout?bodyPartId=${bodyPartId}` : "/"
                    }
                    isNextDisabled={!data || data.data.length < 6}
                    isPreviousDisabled={+page < 2}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
