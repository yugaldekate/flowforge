import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";

import { polarClient } from "./polar";
import { polar, checkout, portal } from "@polar-sh/better-auth";

// For server-side authentication
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    plugins:[
        polar({
            client: polarClient, 
            createCustomerOnSignUp: true, 
            use: [ 
                checkout({ 
                    products: [ 
                        { 
                            productId: "3b923699-075b-4084-bb35-029c1110b9a3", // ID of Product from Polar Dashboard
                            slug: "pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        } 
                    ], 
                    successUrl: process.env.POLAR_SUCCESS_URL, 
                    authenticatedUsersOnly: true
                }), 
                portal(),
            ],
        })
    ]
});