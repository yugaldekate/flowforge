import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';

/**
 * Create a preconfigured QueryClient with sensible defaults for TRPC usage.
 *
 * @returns A QueryClient configured with a queries `staleTime` of 30,000 ms; dehydrate uses `superjson.serialize` and will dehydrate queries when `defaultShouldDehydrateQuery` returns true or the query's state status is `'pending'`; hydrate uses `superjson.deserialize`.
 */
export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000,
            },
            dehydrate: {
                serializeData: superjson.serialize,
                shouldDehydrateQuery: (query) =>
                defaultShouldDehydrateQuery(query) ||
                query.state.status === 'pending',
            },
            hydrate: {
                deserializeData: superjson.deserialize,
            },
        },
    });
}