import { db } from "@/db";
import { workouts } from "@/db/schema";
import { getSupabaseUser } from "@/utils/getSupabaseUser";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { id } = await getSupabaseUser();

    const userWorkouts = await db.query.workouts.findMany({
        where: eq(workouts.userId, id)
    });
    
    return Response.json(
      {
        data: "sa",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return Response.json(
      {
        data: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
