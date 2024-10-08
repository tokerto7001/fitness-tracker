import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.SUPABASE_DB_CONNECTION!
const client = postgres(connectionString)
export const db = drizzle(client, {schema});