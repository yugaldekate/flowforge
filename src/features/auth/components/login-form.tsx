"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const loginFormSchema = z.object({
    email: z.email({
        error: () => "Please enter a valid email address"
    }),
    password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm () {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const signInGithub = async () => {
        await authClient.signIn.social({
            provider: "github"
        }, {
            onSuccess: () => {
                router.push("/");
            },
            onError: () => {
                toast.error("Something went wrong");
            },
        });
    }

    const signInGoogle = async () => {
        await authClient.signIn.social({
            provider: "google"
        }, {
            onSuccess: () => {
                router.push("/");
            },
            onError: () => {
                toast.error("Something went wrong");
            },
        });
    }

    const onSubmit = async(values : LoginFormValues) => {
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/", // A URL to redirect to after the user logs in
        }, {
            onSuccess: () => {
                router.push("/");
            },
            onError: (ctx) => {
                toast.error(ctx.error.message || "Something went wrong");
            }
        });
    }

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>Login to continue</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button
                                        onClick={signInGithub}
                                        variant="outline"
                                        className="w-full"
                                        type="button"
                                        disabled={isPending}
                                    >
                                        <Image
                                            alt="GitHub Logo"
                                            src="/logos/github.svg"
                                            width={20}
                                            height={20}
                                        />
                                        Continue with GitHub
                                    </Button>
                                    <Button
                                        onClick={signInGoogle}
                                        variant="outline"
                                        className="w-full"
                                        type="button"
                                        disabled={isPending}
                                    >
                                        <Image
                                            alt="Google Logo"
                                            src="/logos/google.svg"
                                            width={20}
                                            height={20}
                                        />
                                        Continue with Google
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (    
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem> 
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (    
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="********"
                                                            {...field}
                                                            className="pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(prev => !prev)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-md focus:outline-none"
                                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                                            title={showPassword ? "Hide password" : "Show password"}
                                                        >
                                                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem> 
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isPending}
                                    >
                                        Login
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link 
                                        href="/signup"
                                        className="underline underline-offset-4"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}