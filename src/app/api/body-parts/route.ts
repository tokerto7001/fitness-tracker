import { db } from "@/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest){
        const data = await db.query.bodyParts.findMany();

        return Response.json({data});
};