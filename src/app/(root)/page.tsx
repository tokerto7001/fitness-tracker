"use client";

import AddExerciseDialog from "@/components/exercises/add-exercise-dialog";
import ExerciseCard from "@/components/exercises/exercise-card";
import { getExercises } from "@/services/exercises";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoadingGif from "@/../public/loading.gif";

interface HomeProps {
  searchParams: {
    page: string;
  };
}

export interface GetExercisesQueryParams {
  page: number;
}

export default function Home({ searchParams }: HomeProps) {
  const { page = 1 } = searchParams;
  if (isNaN(+page)) redirect("/?page=1");

  const { data, isLoading, error } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => getExercises({ page: +page }),
  });

  if (error) throw new Error();

  return (
    <>
      <div className="w-screen md:h-screen m-auto pt-10 md:flex md:flex-row md:justify-between md:w-[90%] flex flex-col-reverse gap-5">
        {isLoading ? (
          <div className="w-96 h-96 m-auto">
            <Image src={LoadingGif} alt="Loading" />
          </div>
        ) : (
          <div className="md:w-5/6 md:grid md:grid-cols-3 md:gap-5 w-full flex flex-col items-center gap-8 md:items-stretch ">
            {data &&
              data.data.map((exercise) => (
                <ExerciseCard exercise={exercise} key={exercise.id} />
              ))}
          </div>
        )}
        <div className="md:w-1/6 md:justify-center flex justify-center w-full">
          <AddExerciseDialog />
        </div>
      </div>
      <div className="w-full flex justify-center">Pagination</div>
    </>
  );
}
