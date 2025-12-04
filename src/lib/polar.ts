import { Polar } from "@polar-sh/sdk";

// Use 'sandbox' if you're using the Polar Sandbox environment
// Remember that access tokens, products, etc. are completely separated between environments.
// Access tokens obtained in Production are for instance not usable in the Sandbox environment.
export const polarClient = new Polar({ 
    accessToken: process.env.POLAR_ACCESS_TOKEN, 
    server: "sandbox", // TODO: change to 'sandbox' for development and "production" when ready
});