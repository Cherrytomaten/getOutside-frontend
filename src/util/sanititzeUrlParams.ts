// cant use router.query, since the values are undefined on first render.
// Therefor we need this func to sanitize the string obtained from router.asPath.
function sanititzeUrlParams(url: string): { [key: string]: string } | null {
    try {
        const paramsStr = url.split("?")[1];
        const paramsArr = paramsStr.split("&");

        let json: { [key: string]: string } = {};
        for(let i: number = 0; i < paramsArr.length; i++) {
            const currentParam = paramsArr[i].split("=");
            json[currentParam[0]] = currentParam[1];
        }

        return json;
    } catch (_err) {
        return null;
    }
}

export { sanititzeUrlParams };
