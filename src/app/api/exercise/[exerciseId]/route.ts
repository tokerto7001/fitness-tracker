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

const updateExerciseSchema = z.object({
  name: z
    .string({ required_error: "Name Required" })
    .min(3, { message: "Name must be more than 3 characters" }),
  bodyPart: z.number({ required_error: "Body Part required" }),
  description: z
    .string({ required_error: "Description required" })
    .min(10, { message: "Description must be more than 10 characters" }),
  imageUrl: z
    .string()
    .optional()
    .refine((data) => {
      if(data && data.length < 10) return false
      return true;
    },
    {
      message: 'Please provide a valid imageUrl'
    })
});

const updateExerciseParamsSchema = z.object({
  exerciseId: z
    .string({ required_error: "exerciseId required" })
    .transform((data) => +data),
});

export async function PATCH(req: Request, { params }: { params: { exerciseId: string } }) {
  try{
    const paramsResult = updateExerciseParamsSchema.safeParse(params);

    if (paramsResult.error) {
      const flattenedError = paramsResult.error.flatten();
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

  // parse the request body
  const body = await req.json();
  const result = updateExerciseSchema.safeParse(body);
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

  const { name, description, bodyPart: bodyPartId, imageUrl } = result.data;
  const { exerciseId } = paramsResult.data;

  // find the exercise to update
  const exercise = await db.query.exercises.findFirst({where: eq(exercises.id, exerciseId)});
  if(!exercise) return Response.json(
    {
      message: 'Exercise not found',
    },
    {
      status: 404,
    }
  );

  await db.update(exercises).set({
    name,
    description,
    bodyPartId,
    ...(imageUrl && {
      imageUrl
    })
  }).where(eq(exercises.id, exerciseId));

  revalidatePath("/");

  if(imageUrl) {
    const existingImageName = extractImageName(exercise.imageUrl);
    if(existingImageName) {
      const supabase = createClient();
      await supabase.storage.from('fitness-tracker').remove([existingImageName])
    };
  }

  return Response.json({
    message: 'Exercise updated successfully'
  }, {
    status: 200
  })

  }catch(err){
    console.log(err)
    return Response.json({
      message: 'Something went wrong'
    }, {
      status: 500
    })
  }

}