'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
  } from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExercise } from "@/services";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface DeleteExerciseProps {
    exerciseId: number;
}

export interface DeleteExerciseData {
  exerciseId: number;
}

export default function DeleteExerciseDialog({ exerciseId }: DeleteExerciseProps){

  const mutation = useMutation({
    mutationFn: async (data: DeleteExerciseProps) => {
      return await deleteExercise(data);
    },
  });

    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [deleteDialogState, setDeleteDialogState] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDeleteExercise() {
        try {
          setLoading(true);
          await mutation.mutateAsync({ exerciseId: exerciseId });
          toast({
            title: "Exercise deleted successfuly",
            variant: "success",
          });
          setDeleteDialogState(false);
          queryClient.invalidateQueries({queryKey: ['exercises']});
          router.push("/");
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
    )
}