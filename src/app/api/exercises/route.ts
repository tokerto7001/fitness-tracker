import { db } from "@/db";
import { bodyParts, exercises } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

const addExerciseSchema = z.object({
  name: z
    .string({ required_error: "Name Required" })
    .min(3, { message: "Name must be more than 3 characters" }),
  bodyPart: z.number({ required_error: "Body Part required" }),
  description: z
    .string({ required_error: "Description required" })
    .min(10, { message: "Description must be more than 10 characters" }),
  imageUrl: z
    .string({ required_error: "imageUrl required" })
    .min(10, { message: "Please provide a valid imageUrl" }),
});

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const result = addExerciseSchema.safeParse(request);
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

    // check if this exercise exists
    const exercise = await db.query.exercises.findFirst({
      where: eq(exercises.name, name),
    });

    if (exercise)
      return Response.json(
        {
          message: "Exercise already exists",
        },
        {
          status: 400,
        }
      );

    // check if bodyPartId exists
    const bodyPartExistence = await db.query.bodyParts.findFirst({
      where: eq(bodyParts.id, bodyPartId),
    });
    if (!bodyPartExistence)
      return Response.json(
        {
          message: "Please provide a valid body part id",
        },
        {
          status: 400,
        }
      );

    await db.insert(exercises).values({
      name,
      bodyPartId,
      description,
      imageUrl,
    });

    revalidatePath('/');
    
    return Response.json(
      {
        message: "Exercise added successfuly",
      },
      {
        status: 201,
      }
    );
  } catch (err) {
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

const getExercisesSchema = z.object({
  page: z.string().optional().default('1').transform((data) => +data),
  bodyPartId: z.string().nullish()
}).strict();

export async function GET(req: NextRequest) {
  try{
    const page = req.nextUrl.searchParams.get('page');
    const bodyPartId = req.nextUrl.searchParams.get('bodyPartId');
    const result = getExercisesSchema.safeParse({page, bodyPartId});
    if(result.error) return Response.json({
      message: 'Please provide valid options'
    }, {
      status: 400
    });

    const exercise = await db.query.exercises.findMany({
      ...(bodyPartId && {
        where: eq(exercises.bodyPartId, +bodyPartId!),
      }),
      with: {
        bodyPart: true
      },
      limit: 6,
      offset: (result.data?.page - 1) * 6
    })

    return Response.json(
      {
        data: exercise
      },
      {
        status: 200,
      }
    );
  }catch(err: any) {
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