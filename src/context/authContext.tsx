import { createClient } from "@/utils/supabaseClient";
import { User } from "@supabase/supabase-js";
import { ReactNode, createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{user: User | null}>({
    user: null
});

export default function AuthContextProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User | null>(null);

    async function getUser(){
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if(data) setUser(data.user);
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    )
}