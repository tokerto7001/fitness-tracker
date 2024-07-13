import { db } from "@/db";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest){
        // const cookie = cookies();
        // console.log(cookie)
        const data = await db.query.bodyParts.findMany();

        return Response.json({data});
};