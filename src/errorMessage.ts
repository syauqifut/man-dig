class ErrorMessage{
    constructor(name: string, message: string){
        console.error(`${name}: ${message}`);
    }

    static EnvironmentNotFoundError(env: string){
        return new ErrorMessage(`Environment not found`, `${env}`);
    }

    static ScrapeError(error: any){
        return new ErrorMessage(`Scrape Error`, JSON.stringify(`${error}`));
    }
}

export { ErrorMessage };