'use server';

import { createClient } from '@/utils/supabaseServerClient';
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
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(validationResult.data);

    if(error) return {
        success: false,
        error: {
            _form: [error.message]
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

    // save the user to the db
    
    return {
        success: true,
        error: {}
    }

}