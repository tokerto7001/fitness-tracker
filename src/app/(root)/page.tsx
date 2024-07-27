import AddExerciseDialog from "@/components/exercises/add-exercise-dialog";
import ExerciseCard from "@/components/exercises/exercise-card";
import { db } from "@/db";
import { redirect } from "next/navigation";

interface HomeProps {
  searchParams: {
    page: string;
  }
}

export default async function Home({searchParams}: HomeProps) {
  
  const { page = 1 } = searchParams;
  if(isNaN(+page)) redirect('/?page=1');

  const exercises = await db.query.exercises.findMany({
    with: {
      bodyPart: true
    },
    limit: 3,
    offset: (+page - 1) * 2
  })

  return (
    <div className="w-screen md:h-screen m-auto pt-10 md:flex md:flex-row md:justify-between md:w-[80%] flex flex-col-reverse gap-5">
        <div className="md:w-4/5 md:grid md:grid-cols-2 md:gap-5 w-full flex flex-col items-center gap-8 md:items-stretch ">
        {
          exercises.map((exercise) => (
              <ExerciseCard exercise={exercise} key={exercise.id}/>
          ))
        }
        </div>
        <div className="md:w-1/5 md:justify-end flex justify-center w-full">
          <AddExerciseDialog />
        </div>
    </div>
  );
}
