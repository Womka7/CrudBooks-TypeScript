import { BooksController } from "../../controllers/book.controller";
import { Datalist } from "../../models/bookIList";
import { ListTemplate } from "../components/listbooks";

export class HomePage {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    async render(): Promise<void> {
        this.container.innerHTML = '<h2>Book List Riwi</h2>';
        const booksController = new BooksController('http://190.147.64.47:5155/');
        const books: Datalist[] = await booksController.getListBooks();

        const bookListContainer = document.createElement('div');
        bookListContainer.className = "book-list-container";

        const bookList =document.createElement('ul');
        bookList.id = "book-list";
        bookListContainer.appendChild(bookList);
        this.container.appendChild(bookListContainer);

        const listTemplate = new ListTemplate(bookListContainer);
        listTemplate.render(books);
    }
}