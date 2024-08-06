"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addExercise, getBodyParts } from "@/services";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../shared/button";
import { supabase } from "@/context/authContext";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string({ required_error: "Name Required" })
    .min(3, { message: "Name must be more than 3 characters" }),
  bodyPart: z.number({ required_error: 'Body Part required' }),
  description: z.string({ required_error: "Description required" }).min(10, { message: "Description must be more than 10 characters" }),
  image: z.instanceof(File),
});

export type SchemaType = z.infer<typeof formSchema>;

export interface AddExerciseBody {
  name: string;
  description: string;
  bodyPart: number;
  imageUrl: string;
}

export default function AddExerciseDialog() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bodyParts"],
    queryFn: getBodyParts,
  });

  const mutation = useMutation({
    mutationFn: async(data: AddExerciseBody) => {
      return await addExercise(data);
    },
  })

  const {toast} = useToast();
  const router = useRouter();

  const form = useForm<SchemaType>({
    defaultValues: {
      name: '',
      description: '',
      bodyPart: undefined,
      image: undefined,
    },
    resolver: zodResolver(formSchema),
  });
  const { control, handleSubmit, reset, formState: {isSubmitting} } = form;

  const [dialogStatus, setDialogStatus] = useState(false);

  const queryClient = useQueryClient();

  const formSubmit = async(data: SchemaType) => {
    const fileName = Date.now() + '-' + data.image.name;
    try{
      const { error: uploadError} = await supabase.storage.from('fitness-tracker').upload(fileName, data.image)
      if(uploadError) throw Error(uploadError.message);
      const {data: urlData} = supabase.storage.from('fitness-tracker').getPublicUrl(fileName);

      const dataToSend = {
        name: data.name,
        description: data.description,
        bodyPart: data.bodyPart,
        imageUrl: urlData.publicUrl
      }
      await mutation.mutateAsync(dataToSend);
      queryClient.invalidateQueries({queryKey: ['exercises']});
      toast({
        title: 'Exercise added successfully',
        variant: 'success'
      })
      reset();
      setDialogStatus(false);
      router.push('/');
    }catch(err: any){
      const {data: urlData} = supabase.storage.from('fitness-tracker').getPublicUrl(fileName);
      if(urlData) await supabase.storage.from('fitness-tracker').remove([fileName]);
      toast({
        title: err.response?.data?.message || err.message || 'Something went wrong',
        variant: 'destructive'
      });
    }
  };

  let jsxToRender = (
    <DialogHeader>
      <DialogTitle className="text-center text-white">Add New Exercise</DialogTitle>
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
                      <Input className="text-black" placeholder="Name" {...field} />
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
                    <FormLabel htmlFor="bodyPart" className="text-grass-green">
                      Body Part
                    </FormLabel>
                    <Select
                    onValueChange={(value) => field.onChange(+value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Body Part" className="text-black"/>
                      </SelectTrigger>
                      <SelectContent>
                        {data?.data &&
                          data.data.map((bodyPart) => (
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="image"
                render={({ field }) => (
                  <FormItem className="h-1/5">
                    <FormLabel className="text-grass-green">Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={(e) => field.onChange(e.target.files?.[0])} // this is added for shadcn ui
                      />
                    </FormControl>
                    <div>

                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomButton
                type="submit"
                className=" bg-black hover:bg-grass-green"
                disabled={isSubmitting}
              >
                {
                  isSubmitting ? '...' : 'Submit'
                } 
              </CustomButton>
            </div>
          </form>
        </Form>
    </DialogHeader>
  );

  if (isLoading) jsxToRender = <>Loading</>;
  if (error) jsxToRender = <>An Error Occurred</>;

  return (
    <Dialog open={dialogStatus} onOpenChange={setDialogStatus}>
      <DialogTrigger className="border border-grass-green w-32 h-12 rounded-md text-grass-green hover:bg-grass-green hover:text-white">
        Add Exercise
      </DialogTrigger>
      <DialogContent className="bg-slate-200 text-white h-[80%] border-none">
        {jsxToRender}
      </DialogContent>
    </Dialog>
  );
}
