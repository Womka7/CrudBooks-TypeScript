export class Header {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render(): void {
        this.container.innerHTML = '';
        const header = document.createElement('header');

        const homeLink = document.createElement('a');
        homeLink.innerText = 'Home';
        homeLink.href = '#home';

        const adminLink = document.createElement('a');
        adminLink.innerText = 'Admin';
        adminLink.href = '#admin';

        header.appendChild(homeLink);
        header.appendChild(adminLink);

        this.container.appendChild(header);
    }
}