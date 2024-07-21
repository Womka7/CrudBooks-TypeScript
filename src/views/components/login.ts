import { BooksController } from "../../controllers/book.controller";
import { RequestLoginBooks } from "../../models/bookIRequest";
import { ResponseLoginBooks } from "../../models/bookIResponse";

let main: HTMLElement;

const authHome = function (): void {
    main = document.createElement("main");
    const authSection = document.createElement("section") as HTMLElement;
    authSection.classList.add('container');

    const formLogin = document.createElement("form") as HTMLFormElement;
    formLogin.setAttribute("id", "login-form");

    const title = document.createElement("h2") as HTMLHeadingElement;
    title.innerText = "Login Books Riwi";

    const div = document.createElement("div") as HTMLDivElement;
    div.classList.add("container-input");

    const emailGroup = document.createElement("div") as HTMLDivElement;
    emailGroup.classList.add('form-group');
    const emailLabel = document.createElement("label") as HTMLLabelElement;
    emailLabel.setAttribute("for", "email");
    emailLabel.innerText = "Email Address";
    const emailInput = document.createElement("input") as HTMLInputElement;
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("id", "email");
    emailInput.setAttribute("placeholder", " ");

    const passwordGroup = document.createElement("div") as HTMLDivElement;
    passwordGroup.classList.add('form-group');
    const passwordLabel = document.createElement("label") as HTMLLabelElement;
    passwordLabel.setAttribute("for", "password");
    passwordLabel.innerText = "Password";
    const passwordInput = document.createElement("input") as HTMLInputElement;
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("id", "password");
    passwordInput.setAttribute("placeholder", " ");

    const loginButton = document.createElement("button") as HTMLButtonElement;
    loginButton.setAttribute("type", "submit");
    loginButton.innerText = "Log in";
    loginButton.classList.add('btn-login');

    main.appendChild(authSection);
    authSection.appendChild(formLogin);
    formLogin.append(title, div);
    div.append(emailGroup, passwordGroup, loginButton);
    emailGroup.append(emailInput, emailLabel);
    passwordGroup.append(passwordInput, passwordLabel);

    formLogin.addEventListener("submit", async (event: Event): Promise<void> => {
        event.preventDefault();
        const dataToLogin: RequestLoginBooks = {
            email: emailInput.value,
            password: passwordInput.value
        }
        const booksController = new BooksController('http://190.147.64.47:5155/');
        try {
            const resultLogin: ResponseLoginBooks = await booksController.postLogin(dataToLogin);
            alert((resultLogin.message));
        } catch (error) {
            alert((error as Error).message);
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    authHome();
    document.getElementById('root')?.appendChild(main);
});