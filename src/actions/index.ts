'use server';

import { db } from '@/db';
import { bodyPartsEnum, users } from '@/db/schema';
import { compareStrings, hashString } from '@/utils/bcrypt';
import { createClient } from '@/utils/supabaseServerClient';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';

const signinSchema = z.object({
    email: z
      .string({ required_error: "Email Required" })
      .email({ message: "Please provide a valid email" }),
    password: z
      .string({ required_error: "Password Required" })
      .min(8, { message: "Password must be more than 8 characters" }),
});

export interface AuthFormState {
    success?: boolean;
    error: {
        email?: string[];
        password?: string[];
        _form?: string[];
    }
}

export async function signin(formStatus: AuthFormState, formData: FormData): Promise<AuthFormState>{
    const email = formData.get('email');
    const password = formData.get('password');

    const validationResult = signinSchema.safeParse({email, password});
    if(validationResult.error){
        return {
            success: false,
            error: {
                email: validationResult.error.flatten().fieldErrors.email,
                password: validationResult.error.flatten().fieldErrors.password,
                _form: validationResult.error.flatten().formErrors,
            }
        }
    }

    const userData = validationResult.data;

    try {
        const user = await db.query.users.findFirst({
            where: (users, {eq}) => eq(users.email, userData.email),
            columns: {
                email: true,
                password: true
            }
        });
        if(!user) return {
            success: false,
            error: {
                _form: ['Wrong email or password']
            }
        }
    
        const isPasswordCorrect = await compareStrings(userData.password, user.password);
        if(!isPasswordCorrect) return {
            success: false,
            error: {
                _form: ['Wrong email or password']
            }
        }

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword(userData);
    
        if(error) return {
            success: false,
            error: {
                _form: [error.message]
            }
        }
    } catch(error) {
        return {
            success: false,
            error: {
                _form: ['Something went wrong']
            }
        }
    }

    revalidatePath('/');
    redirect('/');

}

export async function signup(formStatus: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = formData.get('email');
    const password = formData.get('password');

    const validationResult = signinSchema.safeParse({email, password});
    if(validationResult.error){
        return {
            success: false,
            error: {
                email: validationResult.error.flatten().fieldErrors.email,
                password: validationResult.error.flatten().fieldErrors.password,
                _form: validationResult.error.flatten().formErrors,
            }
        }
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, validationResult.data.email)
        });
        if(user) return {
            success: false,
            error: {
                _form: ['User already exists']
            }
        };

    const supabase = createClient()

    const data = {
      email: validationResult.data.email,
      password: validationResult.data.password
    }
  
    const { error } = await supabase.auth.signUp(data)
  
    if (error) {
        return {
            success: false,
            error: {
                _form: [error.message]
            }
        }
    }

    const hashedPassword = await hashString(data.password);
    data.password = hashedPassword;

    await db.insert(users).values(data);

    } catch(error) {
    return {
        success: false,
        error: {
            _form: ['Something went wrong']
        }
    };
    }

    return {
        success: true,
        error: {}
    }

}

export async function signout():Promise<void>{
    const supabase = createClient();

    await supabase.auth.signOut();
} 