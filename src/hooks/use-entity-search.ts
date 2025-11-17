import { useEffect, useState } from "react";
import { PAGINATION } from "@/config/constants";

interface UseEntitySearchProps<T extends { search: string, page: number}> {
    params: T;
    setParams: (params: T) => void;
    debounceMs?: number;
}

export const useEntitySearch = <T extends { search: string; page: number }>({ params, setParams, debounceMs = 500 }: UseEntitySearchProps<T>) => {
    /* 
        localSearch is the user typed value
        params is the params value in the URL by nuqs on clientSide
        setParams function to change params in URL by nuqs on clientSide
    */
    const [localSearch, setLocalSearch] = useState(params.search); 

    useEffect(() => {
        if (localSearch === "" && params.search !== "") {
            setParams({
                ...params,
                search: "",
                page: PAGINATION.DEFAULT_PAGE,
            });

            return;
        }

        const timer = setTimeout(() => {
            if (localSearch !== params.search) {
                setParams({
                    ...params,
                    search: localSearch,
                    page: PAGINATION.DEFAULT_PAGE,
                });
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localSearch, params, setParams, debounceMs]);

    // change search value in EntitySearch
    useEffect(() => {
        setLocalSearch(params.search);
    }, [params.search]);

    return {
        searchValue: localSearch,
        onSearchChange: setLocalSearch,
    };
};
