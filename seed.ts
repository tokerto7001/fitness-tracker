import { bodyParts } from "@/db/schema";
import { sql } from "drizzle-orm";
import * as dotenv from 'dotenv';
import postgres from "postgres";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";


dotenv.config({ path: '.env.local' });


type BodyParts = {
    id: number;
    name: BodyPartEnum
}
type BodyPartEnum = "arm" | "chest" | "back" | "core" | "leg";

async function main(){
    try{
        const DATABASE_URL = process.env.SUPABASE_DB_CONNECTION;

    if (!DATABASE_URL) {
        throw new Error("DATABASE_URL is not set");
    }

    const seedClient = postgres(DATABASE_URL, { max: 1 });
    const db: PostgresJsDatabase = drizzle(seedClient);

        const bodyPartOptions: BodyPartEnum[] = ['arm', 'chest', 'back', 'core', 'leg'];
        const bodyPartsToSeed: BodyParts[] = [];
        bodyPartOptions.map((bodyPart, index) => {
            bodyPartsToSeed.push({
                id: index + 1,
                name: bodyPart
            });
        });

        await db.insert(bodyParts).values(bodyPartsToSeed).onConflictDoUpdate({
            target: bodyParts.id,
            set: { name: sql`${bodyParts.name}`},
          });
          
        await seedClient.end();
        console.log('Seed completed successfully')
    }catch(err){
        console.log('A problem occurs when seeding', err);
    }
}

main();