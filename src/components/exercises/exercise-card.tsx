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
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
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
    <Card className="w-[60%] md:w-[75%] h-80  bg-black text-white border-orange-600  p-2">
      <CardHeader className="flex flex-row w-full h-[5%] justify-end items-end gap-3 p-0 m-0">
        <FontAwesomeIcon
          icon={faPen}
          className="hover:text-orange-600 cursor-pointer"
        />
        <Dialog open={deleteDialogState} onOpenChange={setDeleteDialogState}>
          <DialogTrigger>
            <FontAwesomeIcon
              icon={faTrash}
              className="hover:text-orange-600 cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="bg-black text-white border border-orange-600">
            Are you sure want to delete this exercise?
            <DialogFooter>
              <Button
                disabled={loading}
                className="bg-red-700 text-white hover:bg-black hover:text-red-700 hover:border-red-700 hover:border w-16"
                onClick={handleDeleteExercise}
              >
                {loading ? "..." : "YES"}
              </Button>
              <Button
                disabled={loading}
                className="bg-blue-800 text-white hover:bg-black hover:text-blue-800 hover:border-blue-800 hover:border w-16"
                onClick={() => setDeleteDialogState(false)}
              >
                {loading ? "..." : "NO"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <div className="flex flex-col items-center justify-center gap-3 h-full">
        <CardTitle className="text-center text-orange-600">
          {exercise.name}
        </CardTitle>
        <div className="h-36">
          <CardDescription>
            <Image
              alt="exerciseImage"
              src={exercise.imageUrl}
              width={200}
              height={200}
            />
          </CardDescription>
        </div>
        <p className="text-center">{exercise.bodyPart.name} exercise</p>
        <p className="text-center">{exercise.description}</p>
      </div>
    </Card>
  );
}
