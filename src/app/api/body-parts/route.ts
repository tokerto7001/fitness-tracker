import { db } from "@/db";

export async function GET(){
        const data = await db.query.bodyParts.findMany();

        return Response.json({data});
};