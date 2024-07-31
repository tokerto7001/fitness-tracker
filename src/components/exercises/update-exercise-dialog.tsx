"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Exercises } from "@/db/schema";
import { Textarea } from "../ui/textarea";
import CustomButton from "../shared/button";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBodyParts, updateExercise } from "@/services";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/context/authContext";

interface UpdateExerciseDialogProps {
  exerciseId: number;
  data: Exercises;
}

export interface UpdateExerciseBody {
  name: string;
  description: string;
  bodyPart: number;
  imageUrl?: string;
}

const formSchema = z.object({
  name: z
    .string({ required_error: "Name Required" })
    .min(3, { message: "Name must be more than 3 characters" }),
  bodyPart: z.number({ required_error: "Body Part required" }),
  description: z
    .string({ required_error: "Description required" })
    .min(10, { message: "Description must be more than 10 characters" }),
  image: z.instanceof(File).optional()
});

export type SchemaType = z.infer<typeof formSchema>;

export default function UpdateExerciseDialog({
  exerciseId,
  data,
}: UpdateExerciseDialogProps) {
  const {
    data: bodyParts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bodyParts"],
    queryFn: getBodyParts,
  });

  const mutation = useMutation({
    mutationFn: async(data: UpdateExerciseBody) => {
      return await updateExercise(exerciseId, data)
    }
  })

  const form = useForm<SchemaType>({
    defaultValues: {
      name: data.name,
      description: data.description,
      bodyPart: data.bodyPartId,
    },
    resolver: zodResolver(formSchema)
  });
  
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset
  } = form;

  const {toast} = useToast();
  const router = useRouter();

  const [updateDialogState, setUpdateDialogState] = useState(false);
  const [updateImage, setUpdateImage] = useState(false);

  async function formSubmit(data: SchemaType) {
    const fileName = Date.now() + '-' + data.image?.name;
    try {
      const dataToSend: UpdateExerciseBody = {
        name: data.name,
        description: data.description,
        bodyPart: +data.bodyPart
      }
  
      if(data.image) {
        const { error: uploadError} = await supabase.storage.from('fitness-tracker').upload(fileName, data.image);
        if(uploadError) throw Error(uploadError.message);
        const {data: urlData} = supabase.storage.from('fitness-tracker').getPublicUrl(fileName);

        dataToSend.imageUrl = urlData.publicUrl;
      }
  
      await mutation.mutateAsync(dataToSend);
      toast({
        title: 'Exercise added successfully',
        variant: 'success'
      })
      reset();
      setUpdateDialogState(false);
      setUpdateImage(false);
      router.refresh();
    } catch(err: any) {
      if(data.image) {
        await supabase.storage.from('fitness-tracker').remove([fileName]);
      }
      toast({
        title: err.response?.data?.message || err.message || 'Something went wrong',
        variant: 'destructive'
      });
    }
  }

  useEffect(() => {
    // since defaultValues of the react-hook-form are cached and not updated, this is added
    reset(_formValues => ({
      name: data.name,
      description: data.description,
      bodyPart: data.bodyPartId
    }))
  }, [data]);

  return (
    <Dialog open={updateDialogState} onOpenChange={setUpdateDialogState}>
      <DialogTrigger asChild className="m-0 p-0 text-grass-green">
        <FontAwesomeIcon
          icon={faPen}
          className="text-grass-green cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="bg-slate-200 text-white h-[80%] border-none">
        <DialogHeader>
          <DialogTitle className="text-center text-white">
            Update Exercise
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={handleSubmit(formSubmit)} className="h-[100%]">
              <div className="w-[80%] m-auto mt-2 flex flex-col h-[100%]">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="h-1/5">
                      <FormLabel className="text-grass-green">Name</FormLabel>
                      <FormControl>
                        <Input
                          className="text-black"
                          placeholder="Name"
                          {...field}
                          defaultValue={data.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="bodyPart"
                  render={({ field }) => (
                    <FormItem className="h-1/5">
                      <FormLabel
                        htmlFor="bodyPart"
                        className="text-grass-green"
                      >
                        Body Part
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(+value)}
                        defaultValue={String(data.bodyPartId)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder="Body Part"
                            className="text-black"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {bodyParts?.data &&
                            bodyParts.data.map((bodyPart) => (
                              <SelectItem
                                value={String(bodyPart.id)}
                                key={bodyPart.name}
                              >
                                {bodyPart.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="h-1/5 mb-7">
                      <FormLabel className="text-grass-green">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="text-black"
                          placeholder="Description"
                          id="description"
                          maxLength={120}
                          {...field}
                          defaultValue={data.description}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {updateImage ?  (
                  <FormField
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="h-1/5">
                        <div className="flex w-full justify-between mb-2">
                          <FormLabel className="text-grass-green">
                            Image
                          </FormLabel>
                          <FontAwesomeIcon
                            onClick={() => setUpdateImage(false)}
                            icon={faXmark}
                            className="text-red-600 hover:cursor-pointer"
                          />
                        </div>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            } // this is added for shadcn ui
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                    <div className="flex w-full justify-between mb-2">
                      <div className="relative w-[40%] h-32">
                        <Image
                          src={data.imageUrl}
                          fill={true}
                          alt="Exercise Image"
                        />
                      </div>
                      <Button onClick={() => setUpdateImage(true)}>
                        Update Image
                      </Button>
                    </div>
                  )}

                <CustomButton
                  type="submit"
                  className=" bg-black hover:bg-grass-green"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "..." : "Submit"}
                </CustomButton>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
