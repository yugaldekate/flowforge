"use client";

import { useEffect } from "react";

import z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { CredentialType } from "@/generated/prisma/enums";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";

const formSchema = z.object({
    variableName: z.string()
        .min(1, { message: "Variable name is required"})
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { message: "Variable name must start with a letter or underscore and contain only letters, numbers and underscores"}),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, { message: "User prompt is required"}),
    credentialId: z.string().min(1, { message: "Credential is required"}),
});

export type AnthropicFormValues = z.infer<typeof formSchema>;

interface AnthropicDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<AnthropicFormValues>;
};

export const AnthropicDialog = ({ open, onOpenChange, onSubmit, defaultValues={}}: AnthropicDialogProps) => {

    const credentials = useCredentialsByType(CredentialType.ANTHROPIC);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
            credentialId: defaultValues.credentialId || "",
        }
    });

    // Reset form values with default values when dialog opens
    useEffect(() => {
        if(open){
            form.reset({
                variableName: defaultValues.variableName || "",
                systemPrompt: defaultValues.systemPrompt || "",
                userPrompt: defaultValues.userPrompt || "",
                credentialId: defaultValues.credentialId || "",
            });
        }
    }, [open, form, defaultValues]);

    const watchVariableName = form.watch("variableName") || "myAnthropic";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] sm:max-h-[95vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle>
                        Anthropic Configuraton
                    </DialogTitle>
                    <DialogDescription>
                        Configure the AI model and prompts for this node.
                    </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (    
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="myAnthropic"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes:{" "} {`{{${watchVariableName}.text}}`}
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem> 
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="credentialId"
                            render={({ field }) => (    
                                <FormItem>
                                    <FormLabel>Anthropic Credential</FormLabel>
                                    <Select defaultValue={field.value} onValueChange={field.onChange} disabled={credentials.isLoading || !credentials?.data?.length}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a credential"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {credentials?.data?.map((credential) => (
                                                <SelectItem key={credential.id} value={credential.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Image 
                                                            src="/logos/anthropic.svg" 
                                                            alt="Gemini Logo"
                                                            width={16}
                                                            height={16}
                                                        />
                                                        <span>{credential.name}</span>
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
                            name="systemPrompt"
                            render={({ field }) => (    
                                <FormItem>
                                    <FormLabel>System Prompt (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="You are a helpful assistant."
                                            className="min-h-[80px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Sets the behaviour of the assistant. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem> 
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (    
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Summarize this text: {{json httpResponse.data}}."
                                            className="min-h-[120px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The prompt to sent to the AI. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem> 
                            )}
                        />
                        
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>    
            </DialogContent>
        </Dialog>
    );
}