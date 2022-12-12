class Logger {
    static log(text: string, data?: any): void {
        if (window === undefined || window === null || window.location.href.includes('localhost')) {
            if (!data) {
                console.log(text);
                return;
            }
            console.log(text, data);
        }
    }
}

export { Logger };
