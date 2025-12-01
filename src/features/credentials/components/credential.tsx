"use client";

import z from "zod";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { CredentialType } from "@/generated/prisma/enums";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useCreateCredential, useUpdateCredential, useSuspenseCredential } from "../hooks/use-credentials";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const credentialFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API key is required"),
});

type CredentialFormValues = z.infer<typeof credentialFormSchema>;

const credentialTypesOptions = [
    { label: "Gemini", value: CredentialType.GEMINI , logo: "/logos/gemini.svg"},
    { label: "OpenAI", value: CredentialType.OPENAI , logo: "/logos/openai.svg"},
    { label: "Anthropic", value: CredentialType.ANTHROPIC , logo: "/logos/anthropic.svg"},
];

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: CredentialType;
        value: string;
    }
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
    const router = useRouter();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();
    const { handleError, modal } = useUpgradeModal();

    const [showPassword, setShowPassword] = useState(false);

    const isEdit = !!initialData?.id;

    const form = useForm<CredentialFormValues>({
        resolver: zodResolver(credentialFormSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialType.OPENAI,
            value: "",
        }
    });

    const handleSubmit = async (values: CredentialFormValues) => {
        if(isEdit && initialData?.id){
            await updateCredential.mutateAsync({
                id: initialData.id,
                name: values.name,
                type: values.type,
                value: values.value,
            })
        } else {
            await createCredential.mutateAsync( values, {
                onSuccess: (data) => {
                    router.push(`/credentials/${data.id}`);
                },
                onError: (error) => {
                    handleError(error);
                },
            })
        }
    };    

    return (
        <>
            {modal}
            <Card className="shadow-none">
                <CardHeader className="text-center">
                    <CardTitle>
                        {isEdit ? "Edit Credential" : "Create Credential"}
                    </CardTitle>
                    <CardDescription>
                        {isEdit ? "Update your API key or credential details" : "Add a new API key or credential to get started"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (    
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="text"
                                                placeholder="My API key"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem> 
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (    
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {credentialTypesOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <Image 
                                                                src={option.logo} 
                                                                alt={option.label}
                                                                width={16}
                                                                height={16}
                                                            />
                                                            <span>{option.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem> 
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (    
                                    <FormItem>
                                        <FormLabel>API Key</FormLabel>
                                        <FormControl>
                                             <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
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

                            <div className="flex gap-4">
                                <Button type="submit" disabled={createCredential.isPending || updateCredential.isPending}>
                                    {isEdit ? "Update" : "Create"}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/credentials" prefetch>
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>    
    );
};

export const CredentialView = ({ credentialId }: {credentialId: string}) => {

    const credential = useSuspenseCredential(credentialId);

    return (
        <CredentialForm initialData={credential.data} />
    );
}