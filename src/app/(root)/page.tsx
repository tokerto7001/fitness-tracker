import AddExerciseDialog from "@/components/exercises/add-exercise-dialog";
import { db } from "@/db";
import { getBodyParts } from "@/actions";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export default async function Home() {
  
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['bodyParts'],
    queryFn: getBodyParts
  })

  return (
    <div className="h-screen overflow-hidden w-[60%] m-auto pt-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AddExerciseDialog />
      </HydrationBoundary>
    </div>
  );
}
