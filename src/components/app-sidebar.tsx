"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { CreditCardIcon, FolderOpenIcon, HistoryIcon, KeyIcon, LogOutIcon, StarIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

const menuItems = [
    {
        title: "Main",
        items: [
            {
                title: "Workflows",
                icon: FolderOpenIcon,
                url: "/workflows"
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials"
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions"
            },
        ]
    }
];


export const AppSidebar = () => {

    const router = useRouter();
    const pathname = usePathname();

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton className="gap-x-4 px-4 h-10" asChild>
                        <Link href="/" prefetch>
                            <Image src="/logos/logo1.svg" alt="FlowForge" width={30} height={30} />
                            <span className="font-semibold text-sm">Flowforge</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>

            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            className="gap-x-4 px-4 h-10" 
                                            tooltip={item.title} 
                                            isActive={item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)} 
                                            asChild
                                            >
                                            <Link href={item.url} prefetch>
                                                {<item.icon className="size-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>                            
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            className="gap-x-4 px-4 h-10"
                            tooltip="Upgrade to Pro"
                            onClick={() => {}}
                        >
                            <StarIcon className="size-4" />
                            <span>Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            className="gap-x-4 px-4 h-10"
                            tooltip="Billing Portal"
                            onClick={() => {}}
                        >
                            <CreditCardIcon className="size-4" />
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            className="gap-x-4 px-4 h-10"
                            tooltip="Sign out"
                            onClick={() => authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push('/login');
                                    },
                                },
                            })}
                        >
                            <LogOutIcon className="size-4" />
                            <span>Sign out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};