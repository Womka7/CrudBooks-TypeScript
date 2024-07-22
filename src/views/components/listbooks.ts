import { Datalist } from "../../models/bookIList";
import '../../../public/styles/listStyle.scss';

export class ListTemplate {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render(books: Datalist[]): void {
        this.container.innerHTML = '';
        books.forEach(book => {
            const li = document.createElement('li');
            li.classList.add('book-item');

            const h4 = document.createElement('h4');
            h4.innerText = book.title;
            li.appendChild(h4);

            const pAuthor = document.createElement('p');
            pAuthor.innerText = `Author: ${book.author}`;
            li.appendChild(pAuthor);

            const pDescription = document.createElement('p');
            pDescription.innerText = `Description: ${book.description}`;
            li.appendChild(pDescription);

            this.container.appendChild(li);
        });
    }
}