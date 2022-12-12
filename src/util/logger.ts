function logger(text: string) {
    if (window === undefined || window === null || window.location.href.includes('localhost')) {
        console.log(text);
    }
}

export { logger };
