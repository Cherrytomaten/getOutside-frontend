type CookieProps = {
    name: string,
    value: string,
    expHrs: number
}

const getCookie = (name: string): string | null => {
    const cookies: string[] = document.cookie.split(';');
    for(let i=0; i < cookies.length; i++) {
        if (cookies[i].indexOf(name) !== -1) {
            return cookies[i].split("=")[1];
        }
    }
    return null;
}

const setCookie = ({ name, value, expHrs }: CookieProps) => {
    let date = new Date();
    date = new Date(date.getTime() + 1000*60*60*expHrs);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; SameSite=strict; Secure`
}

const setCookies = (cookies: CookieProps[]) => {
    cookies.forEach((cookie => setCookie(cookie)));
}

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const deleteCookies = (cookies: string[]) => {
    cookies.forEach((cookie => deleteCookie(cookie)))
}

export { getCookie, setCookie, setCookies, deleteCookie, deleteCookies };
