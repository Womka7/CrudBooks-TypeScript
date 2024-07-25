import { BooksController } from "../../controllers/book.controller";
import { Datalist } from "../../models/bookIList";

export class AdminPage {
    private container: HTMLElement;
    private booksController: BooksController;
    private booksList: HTMLElement;
    private bookForm: HTMLFormElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.booksController = new BooksController('http://190.147.64.47:5155/');
        this.booksList = document.createElement('div');
        this.booksList.id = 'books-list';
        this.bookForm = this.createForm();
    }

    async render(): Promise<void> {
        this.container.innerHTML = '<h2>Book Management</h2>';

        // Add form to the container
        this.container.appendChild(this.bookForm);

        // Add books list container
        this.container.appendChild(this.booksList);

        // Render initial book list
        await this.renderBooksList();

        // Form submit event handler
        this.bookForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            await this.saveBook(this.bookForm);
        });
    }

    private createForm(): HTMLFormElement {
        const form = document.createElement("form");
        form.id = "book-form";
        form.classList.add("form-container");

        const fields = [
            { id: "book-id", label: "Book ID:", type: "hidden" },
            { id: "title", label: "Title:", type: "text" },
            { id: "author", label: "Author:", type: "text" },
            { id: "description", label: "Description:", type: "text" },
            { id: "summary", label: "Summary:", type: "text" }
        ];

        fields.forEach(field => {
            if (field.type !== "hidden") {
                const div = document.createElement("div");
                const label = document.createElement("label");
                label.setAttribute("for", field.id);
                label.textContent = field.label;
                div.appendChild(label);

                const input = document.createElement("input");
                input.setAttribute("type", field.type);
                input.setAttribute("id", field.id);
                input.setAttribute("name", field.id);
                input.required = true;
                div.appendChild(input);

                form.appendChild(div);
            } else {
                const input = document.createElement("input");
                input.setAttribute("type", field.type);
                input.setAttribute("id", field.id);
                input.setAttribute("name", field.id);
                form.appendChild(input);
            }
        });

        const submitButton = document.createElement("button");
        submitButton.setAttribute("type", "submit");
        submitButton.textContent = "Save Book";
        submitButton.classList.add('btn-submit');
        form.appendChild(submitButton);

        return form;
    }

    private async saveBook(form: HTMLFormElement): Promise<void> {
        const bookId = (form.elements.namedItem('book-id') as HTMLInputElement).value;
        const book: Datalist = {
            title: (form.elements.namedItem('title') as HTMLInputElement).value,
            author: (form.elements.namedItem('author') as HTMLInputElement).value,
            description: (form.elements.namedItem('description') as HTMLInputElement).value,
            summary: (form.elements.namedItem('summary') as HTMLInputElement).value
        };
    
        try {
            bookId
                ? await this.booksController.updateBook(bookId, book)
                : await this.booksController.postCreateBook(book);
    
            alert(`Book ${bookId ? 'updated' : 'created'} successfully!`);
            form.reset();
            (form.elements.namedItem('book-id') as HTMLInputElement).value = '';
            await this.renderBooksList();
        } catch (error) {
            console.error(`Failed to save book`, error);
            alert(`Failed to save book`);
        }
    }
    
    private async renderBooksList(): Promise<void> {
        try {
            const books = await this.booksController.getListBooks();
            this.booksList.innerHTML = `
                <h3>Current Books</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${books.map(book => `
                            <tr>
                                <td>${book.title}</td>
                                <td>${book.author}</td>
                                <td>${book.description}</td>
                                <td>
                                    <button class="btn btn-info edit-book" data-id="${book.id}">Edit</button>
                                    <button class="btn btn-danger delete-book" data-id="${book.id}">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
    
            this.booksList.querySelectorAll('.edit-book').forEach(button => {
                button.addEventListener('click', async (event) => {
                    await this.editBook((event.target as HTMLButtonElement).dataset.id!);
                });
            });
    
            this.booksList.querySelectorAll('.delete-book').forEach(button => {
                button.addEventListener('click', async (event) => {
                    await this.deleteBook((event.target as HTMLButtonElement).dataset.id!);
                });
            });
        } catch (error) {
            console.error(`Failed to fetch books`, error);
            this.booksList.innerHTML = '<p>Failed to load books.</p>';
        }
    }
    
    private async editBook(bookId: string): Promise<void> {
        try {
            const book = await this.booksController.getBook(bookId);
            console.log('data: ',book.data.summary);
            
            const form = document.getElementById('book-form') as HTMLFormElement;
            (form.elements.namedItem('book-id') as HTMLInputElement).value = book.data.id || '';
            (form.elements.namedItem('title') as HTMLInputElement).value = book.data.title;
            (form.elements.namedItem('author') as HTMLInputElement).value = book.data.author;
            (form.elements.namedItem('description') as HTMLInputElement).value = book.data.description;
            (form.elements.namedItem('summary') as HTMLInputElement).value = book.data.summary;
        } catch (error) {
            console.error(`Failed to fetch book details`, error);
            alert(`Failed to load book details for editing`);
        }
    }
    
    private async deleteBook(bookId: string): Promise<void> {
        if (confirm('Are you sure you want to delete this book?')) {
            try {
                await this.booksController.deleteBook(bookId);
                await this.renderBooksList();
                alert(`Book deleted successfully!`);
            } catch (error) {
                console.error(`Failed to delete book`, error);
                alert(`Failed to delete book`);
            }
        }
    }
}