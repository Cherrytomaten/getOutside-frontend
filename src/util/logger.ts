class Logger {
    static log(text: string, data?: any): void {
        // catch error for undefined window -> logger was executed on server side
        try {
            if (window.location.href.includes('localhost')) {
                if (!data) {
                    console.log(text);
                    return;
                }
                console.log(text, data);
            }
        } catch (error: any) {
            if (!data) {
                console.log(text);
                return;
            }
            console.log(text, data);
        }
    }
}

export { Logger };
