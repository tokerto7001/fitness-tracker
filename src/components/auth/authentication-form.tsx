"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import * as actions from '@/actions';
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";

interface AuthenticationFormProps {
  authType: "Login" | "Register";
}

const formSchema = z.object({
  email: z
    .string({ required_error: "Email Required" })
    .email({ message: "Please provide a valid email" }),
  password: z
    .string({ required_error: "Password Required" })
    .min(8, { message: "Password must be more than 8 characters" }),
});

export default function AuthenticationForm({
  authType,
}: AuthenticationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const [formState, action] = useFormState(authType === 'Login' ? actions.signin : actions.signup, {error: {}});

  const { control, setError, reset, formState: {isSubmitting} } = form;

  useEffect(() => {
    if(formState.success) {
      toast({
        title: 'Signup is successfull, please check your email!',
        variant: 'success'
      })
    } else {
      const fieldErrors = formState.error;
      Object.keys(fieldErrors).map((key) => {
        if(key !== '_form') {
          setError(key as keyof z.infer<typeof formSchema>, {
            type: "custom",
            message: (
              fieldErrors[key as keyof z.infer<typeof formSchema>] as string[]
            ).toString(),
          });
        } else if (key === '_form' && fieldErrors[key as keyof z.infer<typeof formSchema>]?.length){
          console.log(fieldErrors[key as keyof z.infer<typeof formSchema>]?.toString())
          toast({
            title: fieldErrors[key as keyof z.infer<typeof formSchema>]?.toString(),
            variant: 'destructive'
          })
        }
      });
    }
    reset({ email: "", password: "" }, { keepErrors: true });
  }, [formState]);

  return (
    <div className="h-[80%] w-[50%] flex-col">
      <div className="pt-5 flex justify-center h-1/5">
        <div className="w-full">
          <h3 className="text-5xl text-center mb-7">{authType}</h3>
          <hr />
        </div>
      </div>
      <div className="h-4/5">
        <Form {...form}>
          <form
            action={action}
            className="flex flex-col gap-8"
          >
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="border-gray-300 focus:border-black border-2 h-12"
                      placeholder="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-4" />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="border-gray-300 focus:border-black border-2 h-12"
                      placeholder="password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-4" />
                </FormItem>
              )}
            />
            <Button className="h-12 bg-black" type="submit" disabled={isSubmitting}>
              {authType}
            </Button>
          </form>
        </Form>
        <div className="mt-5 text-center">
          {authType === "Login" ? (
            <p className="text-gray-500">
              Don't have an account?
              <Link className="text-black font-semibold ml-1" href="/signup">
                Register for free
              </Link>
            </p>
          ) : (
            <p className="text-gray-500">
              Already have an account?
              <Link className="text-black font-semibold ml-1" href="/signin">
                Login here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
