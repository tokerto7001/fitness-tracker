'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface AuthenticationFormProps {
    authenticationText: 'Login' | 'Register'
}

const formSchema = z.object({
    email: z.string({required_error: 'Email Required'}).email({message: 'Please provide a valid email'}),
    password: z.string({required_error: 'Password Required'}).min(8, {message: 'Password must be more than 8 characters'})
})

export default function AuthenticationForm({authenticationText}: AuthenticationFormProps){

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const { handleSubmit, control, setError, reset } = form;

    function onSubmit(formValues: z.infer<typeof formSchema>){
        const parseResult = formSchema.safeParse(formValues);
        if(parseResult.error) {
            const fieldErrors = parseResult.error.flatten().fieldErrors;
            Object.keys(fieldErrors).map((key) => {
                setError(key as keyof z.infer<typeof formSchema>, { type: 'custom', message: (fieldErrors[key as keyof z.infer<typeof formSchema>] as string[]).toString()});
            });
            reset({email: '', password: ''}, {keepErrors: true});
        }
        
    }

    return (
        <div className="h-[80%] w-[50%] flex-col">
            <div className="pt-5 flex justify-center h-1/5">
                <div className="w-36">
                <h3 className='text-5xl text-center m-3'>{authenticationText}</h3>
                <hr />
                </div>

            </div>
            <div className="h-4/5">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                        <FormField
                        control={control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                    className="border-gray-300 focus:border-black border-2 h-12"
                                    placeholder="email"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage
                                className="mt-4"
                                />
                                </FormItem>
                        )}
                        />
                        <FormField
                        control={control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                    className="border-gray-300 focus:border-black border-2 h-12"
                                    placeholder="password"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage
                                className="mt-4"
                                />
                                </FormItem>
                        )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}