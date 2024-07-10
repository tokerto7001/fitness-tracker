'use client';

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
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { getBodyParts } from "@/services";


export default function AddExerciseDialog() {

  const { data, isLoading, error } = useQuery({
    queryKey: ['bodyParts'],
    queryFn: getBodyParts
  })

  let jsxToRender = <DialogHeader>
  <DialogTitle className="text-center">Add New Exercise</DialogTitle>
  <DialogDescription>
    <div className="w-[80%] m-auto mt-2 flex flex-col gap-5">
    <Label
    htmlFor="name"
    className="text-orange-600"
    >Name</Label>
    <Input
    placeholder="Name"
    name="name"
    id="name"
    />
    <Label
    htmlFor="bodyPart"
    className="text-orange-600"
    >Body Part</Label>
    <Select
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Body Part" />
      </SelectTrigger>
      <SelectContent>
        {
          data?.data && data.data.map((bodyPart) => (
             <SelectItem value={bodyPart.name} key={bodyPart.name}>{bodyPart.name}</SelectItem> 
          ))
        }
      </SelectContent>
    </Select>
    <Label
    htmlFor="description"
    className="text-orange-600"
    >Description</Label>
    <Textarea
    placeholder="Description"
    name="description"
    id="description"
    maxLength={120}
    />
    <Label
    htmlFor="image"
    className="text-orange-600"
    >Image</Label>
    <Input
    name="image"
    id="image"
    type="file"
    />
    </div>
  </DialogDescription>
</DialogHeader>;

if(isLoading) jsxToRender = <>Loading</>

  return (
    <Dialog>
      <DialogTrigger className="border border-orange-600 w-32 h-12 rounded-md">
        Add Exercise
      </DialogTrigger>
      <DialogContent className="bg-black border-orange-600 text-white h-[65%]">
        {jsxToRender}
      </DialogContent>
    </Dialog>
  );
}
