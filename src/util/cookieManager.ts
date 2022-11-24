const getCookie = (name: string): string | null => {
    const cookies: string[] = document.cookie.split(';');
    for(let i=0; i < cookies.length; i++) {
        if (cookies[i].indexOf(name) !== -1) {
            return cookies[i];
        }
    }
    return null;
}

const setCookie = (name: string, value: string, expHrs: number) => {
    let date = new Date();
    date = new Date(date.getTime() + 1000*60*60*expHrs);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; Secure`
}

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export { getCookie, setCookie, deleteCookie };
