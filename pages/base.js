class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigateTo(url) {
        await this.page.goto(url);
    }

    async clickElement(selector) {
        await this.page.locator(selector).click();
    }

    async getText(selector) {
        return await this.page.locator(selector).innerText();
    }
}

module.exports = BasePage;
