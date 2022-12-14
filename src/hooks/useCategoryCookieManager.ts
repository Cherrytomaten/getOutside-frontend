import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { getCookie, setCookie } from "@/util/cookieManager";
import { ACTIVE_CATEGORIES } from "@/types/constants";

type CategoryCookieManagerProps = {
    allCategories: string[];
    categoryFilter: string[];
    setCatFilter: Dispatch<SetStateAction<string[]>>
}

type CookieCats = {
    activeCats: string
}

function useCategoryCookieManager({ allCategories, categoryFilter, setCatFilter }: CategoryCookieManagerProps) {
    const initialCall = useRef<boolean>(true);

    useEffect(() => {
        const cookiedCats: CookieCats | null = getCookie(ACTIVE_CATEGORIES);
        if (cookiedCats === null) {
            setCatFilter(allCategories);
            return;
        }

        const categoryArr = cookiedCats.activeCats.split(",");
        setCatFilter(categoryArr);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // prevent initial load to override cat cookie with the inital empty array, but also be able to cookie an empty array properly
        if (categoryFilter.length === 0 && initialCall.current) {
            initialCall.current = false;
            return;
        }
        setCookie({ name: ACTIVE_CATEGORIES, value: { "activeCats": categoryFilter.toString() }, exp: 14400000});
    }, [categoryFilter]);
}

export { useCategoryCookieManager };
