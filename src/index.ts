import { authHome } from "./views/components/login";
import { Header } from "./views/components/header";
import { HomePage } from "./views/pages/home";
import { AdminPage } from "./views/pages/admin";

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root') as HTMLElement;
    const token = localStorage.getItem('token');

    const renderPage = async (): Promise<void> => {
        root.innerHTML = '';
        const headerContainer = document.createElement('div');
        root.appendChild(headerContainer);

        const header = new Header(headerContainer);
        header.render();

        const mainContainer = document.createElement('div');
        root.appendChild(mainContainer);
        mainContainer.classList.add('container-div');

        switch (window.location.hash) {
            case '#home':
                const homePage = new HomePage(mainContainer);
                await homePage.render();
                break;
            case '#admin':
                const adminPage = new AdminPage(mainContainer);
                await adminPage.render();
                break;
            default:
                const defaultHomePage = new HomePage(mainContainer);
                await defaultHomePage.render();
        }
    };

    if (token) {
        renderPage();
        window.addEventListener('hashchange', renderPage);
    } else {
        authHome();
    }
});