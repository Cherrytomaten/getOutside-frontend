import { ACTIVE_CATEGORIES, DEFAULT_RADIUS, RADIUS_FILTER, SHOW_ONLY_FAV } from "@/types/constants";
import { getCookie } from "@/util/cookieManager";

function getMapCookies() {
  const radiusCookie: string | null = getCookie(RADIUS_FILTER);
  const activeCategoriesCookie: string | null = getCookie(ACTIVE_CATEGORIES);
  const OnlyShowFavCookie: string | null = getCookie(SHOW_ONLY_FAV);

  let radius: number | undefined = undefined;
  let activeCategories: string[] | undefined = undefined;
  let onlyShowFavorites: boolean | undefined = undefined;

  try {
    if (radiusCookie !== null) {
      radius = JSON.parse(radiusCookie).radius;
    }
  } catch (_err) {
    console.error('An error occured while getting the radius cookie.');
  }

  try {
    if (activeCategoriesCookie !== null) {
      activeCategories = JSON.parse(activeCategoriesCookie).activeCats.split(',');
    }
  } catch (_err) {
    console.error('An error occured while getting the active categories cookie.');
  }

  try {
    if (OnlyShowFavCookie !== null) {
      onlyShowFavorites = JSON.parse(OnlyShowFavCookie);
    }
  } catch (_err) {
    console.error('An error occured while getting the radius cookie.');
  }

  return {
    radius: radius ?? DEFAULT_RADIUS,
    activeCategories: activeCategories ?? [],
    onlyShowFavorites: onlyShowFavorites ?? false
  }
}

export { getMapCookies };
