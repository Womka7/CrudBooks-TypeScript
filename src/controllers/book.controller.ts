import { RequestLoginBooks } from "../models/bookIRequest";
import { ResponseLoginBooks } from "../models/bookIResponse";

export class BooksController {

    private urlApi: string;
    private token: string | null;

    constructor(urlApi: string,) {
        this.urlApi = urlApi;
        this.token = null;
    }

    private validateToken(): void {
        if (!this.token) {
            throw new Error("Not authenticated: No token found");
        }
    }

    async postLogin(data: RequestLoginBooks): Promise<ResponseLoginBooks> {
        let endpointLogin: string = 'api/v1/auth/login';

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
            // 'Authorization': 'Bearer <token>'
        }
        const reqOptions: RequestInit = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        }
        const url: string = this.urlApi + endpointLogin;
        try {
            const result: Response = await fetch(url, reqOptions);
            console.log(`Status code: ${result.status}`);
            const responseBodyLogin: ResponseLoginBooks = await result.json();

            if (result.status !== 201) {
                console.log(`Response body: ${responseBodyLogin.message}`);
                throw new Error(responseBodyLogin.message || `Error: ${result.status}`);
            }
            console.log(`Result token: ${responseBodyLogin.data.token}`);
            this.token = responseBodyLogin.data.token;
            return responseBodyLogin;

        } catch (error) {
            throw error as Error;
        }
    }

}
