import { Datalist, IListBooks } from "../models/bookIList";
import { RequestLoginBooks } from "../models/bookIRequest";
import { ResponseLoginBooks } from "../models/bookIResponse";

export class BooksController {
    private urlApi: string;
    private token: string | null;

    constructor(urlApi: string) {
        this.urlApi = urlApi;
        this.token = localStorage.getItem('token');
    }

    private validateToken(): void {
        if (!this.token) {
            throw new Error("Not authenticated: No token found");
        }
    }

    async postLogin(data: RequestLoginBooks): Promise<ResponseLoginBooks> {
        let endpointLogin: string = 'api/v1/auth/login';
        const url: string = this.urlApi + endpointLogin;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        }
        const reqOptions: RequestInit = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        }
        
        try {
            const result: Response = await fetch(url, reqOptions);
            console.log(`Status code: ${result.status}`);
            const responseBodyLogin: ResponseLoginBooks = await result.json();

            if (result.status !== 201) {
                console.log(`Response body: ${responseBodyLogin.message}`);
                throw new Error(responseBodyLogin.message || `Error: ${result.status}`);
            }
            
            this.token = responseBodyLogin.data.token;
            localStorage.setItem('token', this.token);
            return responseBodyLogin;
        } catch (error) {
            console.error("Error in login:", error);
            throw error;
        }
    }

    async getListBooks(): Promise<Datalist[]> {
        this.validateToken();

        const endpointGetBooks: string = 'api/v1/books?limit=200';
        const url: string = this.urlApi + endpointGetBooks;

        const headers: Record<string,string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }
        
        const response: Response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        try {
            console.log(`Status code: ${response.status}`);

            if (response.status !== 200) {
                const eData = await response.json();
                console.log(`Response body: ${eData.message}`);
                throw new Error(eData.message || `Error: ${response.status}`);
            }
            
            const responseBody: IListBooks = await response.json();
            console.log(`Fetched ${responseBody.data.length} books`);
            return responseBody.data;
        } catch (error) {
            console.error("Error fetching books:", error);
            throw error as Error;
        }
    }

    async getBook(bookId: string): Promise<IListBooks> {
        this.validateToken();

        const endpointGetBook: string = `api/v1/books/${bookId}`;
        const url: string = this.urlApi + endpointGetBook;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }

        try {
            const response: Response = await fetch(url, {
                method: 'GET',
                headers: headers
            });
            console.log(`Status code: ${response.status}`);

            if (response.status !== 200) {
                const responseBody = await response.json();
                console.log(`Response body: ${responseBody.message}`);
                throw new Error(responseBody.message || `Error: ${response.status}`);
            }
            
            const responseBody: IListBooks = await response.json();
            console.log(`Fetched book with id: ${bookId}`);
            
            if (!responseBody.data || responseBody.data.length === 0) {
                throw new Error(`No book found with id: ${bookId}`);
            }

            return responseBody;
        } catch (error) {
            console.error(`Error fetching book with id ${bookId}:`, error);
            throw error as Error;
        }
    }

    async postCreateBook(data: Datalist): Promise<IListBooks> {
        this.validateToken();

        const endpointCreateBook: string = 'api/v1/books';
        const url: string = this.urlApi + endpointCreateBook;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };

        const reqOptions: RequestInit = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };

        try {
            const result: Response = await fetch(url, reqOptions);
            console.log(`Status code: ${result.status}`);
            
            const responseBody:IListBooks = await result.json();
            if (result.status !== 201) {
                console.log(`Response body: ${responseBody.message}`);
                throw new Error("Failed to create book: " + responseBody.message);
            }
            return responseBody;
        } catch (error) {
            throw error as Error;
        }
    }

    async deleteBook(bookId: string): Promise<ResponseLoginBooks> {
        this.validateToken();

        const endpointDeleteBook: string = `api/v1/books/${bookId}`;
        const url: string = this.urlApi + endpointDeleteBook;

        const headers: Record<string, string> = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${this.token}`
        };

        const reqOptions: RequestInit = {
            method: 'DELETE',
            headers: headers
        };
        
        try {
            const result: Response = await fetch(url, reqOptions);
            console.log(`Status code: ${result.status}`);
            
            const responseBody:ResponseLoginBooks = await result.json();
            if (result.status !== 200) {
                console.log(`Response body: ${responseBody.message}`);
                throw new Error("Failed to delete book: " + responseBody.message);
            }
            
            console.log(`Deleted book with id: ${responseBody.message}`);
            return responseBody;
        } catch (error) {
            throw error as Error;
        }
    }
    async updateBook(bookId:string, data:Partial<Datalist>):Promise<IListBooks>{
        this.validateToken();
        const endpointUpdateBook:string =`api/v1/books/${bookId}`
        const url: string=this.urlApi +endpointUpdateBook;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }

        const reqOptions: RequestInit = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(data)
        }
        try {
            const result: Response = await fetch(url, reqOptions);
            console.log(`Status code: ${result.status}`);
            const responseBody:IListBooks =await result.json();
            if (result.status !== 200) {
                console.log(`Response body: ${responseBody.message}`);
                throw new Error("Failed to update book: " + responseBody.message);
            }
            console.log(`Updated book with id: ${responseBody.data[0].id}`);
            return responseBody;
        } catch (error) {
            throw error as Error;
        }
    }
}
