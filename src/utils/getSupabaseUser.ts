import { User } from "@supabase/supabase-js";
import { createClient } from "./supabaseServerClient";

export async function getSupabaseUser(): Promise<User>{
    try{
        const supabase = createClient();
        const data = await supabase.auth.getUser();
        if(!data || !data.data?.user) throw new Error('Authentication failed');
        return data.data.user;
    } catch(err: any) {
        throw err;
    }
}