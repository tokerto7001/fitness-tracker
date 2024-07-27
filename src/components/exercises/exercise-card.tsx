"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Exercises } from "@/db/schema";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faP, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteExercise } from "@/services";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface ExerciseCardProps {
  exercise: Exercises;
}

export interface DeleteExerciseData {
  exerciseId: number;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: DeleteExerciseData) => {
      return await deleteExercise(data);
    },
  });

  async function handleDeleteExercise() {
    try {
      setLoading(true);
      await mutation.mutateAsync({ exerciseId: exercise.id });
      toast({
        title: "Exercise deleted successfuly",
        variant: "success",
      });
      setDeleteDialogState(false);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title:
          err.response?.data?.message || err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
<Card className="w-[60%] md:w-[85%] h-80 bg-white text-black rounded-xl shadow-xl relative overflow-hidden">
  <div className="h-[60%] relative w-full">
    <CardHeader className="flex flex-row w-full justify-end items-start gap-3 p-1 absolute top-0 right-0 z-10 space-y-0">
      <FontAwesomeIcon
        icon={faPen}
        className="text-grass-green cursor-pointer"
      />
            {/* <Dialog open={deleteDialogState} onOpenChange={setDeleteDialogState}>
        <DialogTrigger>
          <FontAwesomeIcon
            icon={faPen}
            className="text-grass-green cursor-pointer"
          />
        </DialogTrigger>
        <DialogContent className="bg-slate-200 text-red-500 border">
          Are you sure want to delete this exercise?
          <DialogFooter>
            <Button
              disabled={loading}
              className="bg-red-700 text-white hover:bg-transparent hover:text-red-700 hover:border-red-700 hover:border w-16"
              onClick={handleDeleteExercise}
            >
              {loading ? "..." : "YES"}
            </Button>
            <Button
              disabled={loading}
              className="bg-blue-800 text-white hover:bg-transparent hover:text-blue-800 hover:border-blue-800 hover:border w-16"
              onClick={() => setDeleteDialogState(false)}
            >
              {loading ? "..." : "NO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <Dialog open={deleteDialogState} onOpenChange={setDeleteDialogState}>
        <DialogTrigger asChild className="m-0 p-0">
          <FontAwesomeIcon
            icon={faTrash}
            className="text-red-500 cursor-pointer mt-0 p-0"
          />
        </DialogTrigger>
        <DialogContent className="bg-slate-200 text-red-500 border">
          Are you sure want to delete this exercise?
          <DialogFooter>
            <Button
              disabled={loading}
              className="bg-red-700 text-white hover:bg-transparent hover:text-red-700 hover:border-red-700 hover:border w-16"
              onClick={handleDeleteExercise}
            >
              {loading ? "..." : "YES"}
            </Button>
            <Button
              disabled={loading}
              className="bg-blue-800 text-white hover:bg-transparent hover:text-blue-800 hover:border-blue-800 hover:border w-16"
              onClick={() => setDeleteDialogState(false)}
            >
              {loading ? "..." : "NO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardHeader>
    <Image
      alt="exerciseImage"
      src={exercise.imageUrl}
      fill={true}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
  <div className="flex flex-col items-center gap-3 h-full mt-3">
    <CardTitle className="text-center text-grass-green">
      {exercise.name}
    </CardTitle>
    <p className="text-center">{exercise.bodyPart.name} exercise</p>
    <p className="text-center">{exercise.description}</p>
  </div>
</Card>

  );
}
