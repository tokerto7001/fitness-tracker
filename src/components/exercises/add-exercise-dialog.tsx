"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useQuery } from "@tanstack/react-query";
import { getBodyParts } from "@/services";
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

const formSchema = z.object({
  name: z
    .string({ required_error: "Name Required" })
    .min(3, { message: "Name must be more than 3 characters" }),
  bodyPart: z.enum(["arm", "chest", "back", "core", "leg"], { required_error: 'Body Part required' }),
  description: z.string({ required_error: "Description required" }).min(3, { message: "Name must be more than 10 characters" }),
  image: z.instanceof(File),
});

export default function AddExerciseDialog() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bodyParts"],
    queryFn: getBodyParts,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: '',
      description: '',
      bodyPart: undefined,
      image: undefined,
    },
    // resolver: zodResolver(formSchema),
  });
  const { control, handleSubmit } = form;

  const anan = (data: any) => {
    console.log(data);
  };

  let jsxToRender = (
    <DialogHeader>
      <DialogTitle className="text-center">Add New Exercise</DialogTitle>
        <Form {...form}>
          <form onSubmit={handleSubmit(anan)} className="h-[100%]">
            <div className="w-[80%] m-auto mt-2 flex flex-col h-[100%]">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="h-1/5">
                    <FormLabel className="text-orange-600">Name</FormLabel>
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
                    <FormLabel htmlFor="bodyPart" className="text-orange-600">
                      Body Part
                    </FormLabel>
                    <Select
                    onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Body Part" className="text-black"/>
                      </SelectTrigger>
                      <SelectContent>
                        {data?.data &&
                          data.data.map((bodyPart) => (
                            <SelectItem
                              value={bodyPart.name}
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
                    <FormLabel className="text-orange-600">
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
                    <FormLabel className="text-orange-600">Image</FormLabel>
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
                className="border border-orange-600 bg-black hover:bg-orange-600"
              >
                Submit
              </CustomButton>
            </div>
          </form>
        </Form>
    </DialogHeader>
  );

  if (isLoading) jsxToRender = <>Loading</>;
  if (error) jsxToRender = <>An Error Occurred</>;

  return (
    <Dialog>
      <DialogTrigger className="border border-orange-600 w-32 h-12 rounded-md">
        Add Exercise
      </DialogTrigger>
      <DialogContent className="bg-black border-orange-600 text-white h-[80%]">
        {jsxToRender}
      </DialogContent>
    </Dialog>
  );
}
