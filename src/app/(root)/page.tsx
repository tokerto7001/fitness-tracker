import AddExerciseDialog from "@/components/exercises/add-exercise-dialog";

export default async function Home() {
  
  return (
    <div className="h-screen overflow-hidden w-[60%] m-auto pt-10">
        <AddExerciseDialog />
    </div>
  );
}
