import { db } from "@/db";
import { exercises } from "@/db/schema";
import { extractImageName } from "@/utils/extractImageName";
import { createClient } from "@/utils/supabaseServerClient";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

const deleteExerciseSchema = z.object({
  exerciseId: z
    .string({ required_error: "exerciseId required" })
    .transform((data) => +data),
});

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const result = deleteExerciseSchema.safeParse(params);

    if (result.error) {
      const flattenedError = result.error.flatten();
      let errors: string[] = [];
      errors = errors.concat(flattenedError.formErrors);
      Object.values(flattenedError.fieldErrors).map((value) =>
        errors.push(value.join())
      );
      return Response.json(
        {
          message: errors.join(),
        },
        {
          status: 400,
        }
      );
    }

    const exercise = await db.query.exercises.findFirst({
      where: eq(exercises.id, result.data.exerciseId),
    });

    if (!exercise)
      return Response.json(
        {
          message: "Exercise not found",
        },
        {
          status: 404,
        }
      );

    // delete exercise from db
    await db.delete(exercises).where(eq(exercises.id, result.data.exerciseId));
    // delete exercise image from supabase
    const imageName = extractImageName(exercise.imageUrl);
    if(imageName) {
        const supabase = createClient();
        await supabase.storage.from("fitness-tracker").remove([imageName]);
    }

    revalidatePath("/");
    return Response.json(
      {
        message: "Exercise deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return Response.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
