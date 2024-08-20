"use client";

import AddExerciseDialog from "@/components/exercises/add-exercise-dialog";
import ExerciseCard from "@/components/exercises/exercise-card";
import { getExercises } from "@/services/exercises";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoadingGif from "@/../public/loading.gif";
import { getBodyParts } from "@/services";
import BodyPartSelect from "@/components/exercises/body-part-select";
import Pagination from "@/components/shared/pagination";

interface HomeProps {
  searchParams: {
    page: string;
    bodyPartId?: string
  };
}

export interface GetExercisesQueryParams {
  page?: number;
  bodyPartId?: number
}

export default function Home({ searchParams }: HomeProps) {
  const { page = 1, bodyPartId } = searchParams;
  if (isNaN(+page)) redirect(`/?page=1`);

  const requestParams = {
    page: +page,
    ...(
      bodyPartId && bodyPartId !== '0' && {
        bodyPartId: +bodyPartId
      }
    )
  }

  const { data, isLoading, error } = useQuery({
    queryKey: [`exercises?${JSON.stringify(requestParams)}`],
    queryFn: () => getExercises(requestParams),
  });

  const { data: bodyPartData, isLoading: bodyPartLoading, error: bodyPartError } = useQuery({
    queryKey: ["bodyParts"],
    queryFn: getBodyParts,
  });

  if (error || bodyPartError) throw new Error();

  return (
    <>
      <div className="w-screen md:h-screen mx-auto pt-10 md:flex md:flex-row md:justify-between md:w-[90%] flex flex-col-reverse gap-5">
        {isLoading ? (
          <div className="w-96 h-96 m-auto">
            <Image src={LoadingGif} alt="Loading" />
          </div>
        ) : (
          <div className="md:w-5/6 md:grid md:grid-cols-3 md:gap-5 w-full flex flex-col items-center gap-8 md:items-stretch">
            {data &&
              data.data.map((exercise) => (
                <ExerciseCard exercise={exercise} key={exercise.id} />
              ))}
          </div>
        )}
        <div className="md:w-1/6 flex flex-col gap-6 w-full justify-center items-center md:items-baseline md:justify-start">
          <BodyPartSelect
            data={bodyPartData}
            loading={bodyPartLoading}
          />
          <AddExerciseDialog />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Pagination 
        currentPage={+page}
        baseUrlToNavigate={bodyPartId ? `/?bodyPartId=${bodyPartId}` : '/'}
        isNextDisabled={!data || data.data.length < 6}
        isPreviousDisabled={+page < 2}
        />
      </div>
    </>
  );
}
