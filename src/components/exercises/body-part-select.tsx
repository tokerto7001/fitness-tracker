'use client';

import { BodyParts } from "@/db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useRouter } from "next/navigation";

interface BodyPartSelectProps {
    data: { data: BodyParts[] } | undefined;
    loading: boolean;
}

export default function BodyPartSelect({data, loading}: BodyPartSelectProps) {

    const router = useRouter();

  return (
    <div className="md:w-[80%] sm:w-[20%] w-[25%]">
      <Select
      onValueChange={(value) => router.push(`/?bodyPartId=${value}`)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Body Part" className="text-black" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="0">
                all
            </SelectItem>
          {!loading && data &&
            data.data.map((bodyPart) => (
              <SelectItem value={String(bodyPart.id)} key={bodyPart.name}>
                {bodyPart.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
