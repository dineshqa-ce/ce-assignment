const BasePage = require('./base');

class HomePage extends BasePage {
    constructor(page) {
        super(page);
        this.opinionLink = page.locator('#csw').getByRole('link', { name: 'Opinión' });
        this.acceptAlert = page.getByLabel('Agree and close: Agree to our');
    }

    async goToOpinionSection() {
        await this.opinionLink.waitFor({ state: 'visible' });
        await this.opinionLink.click();
    }

    async acceptMsg() {
        await this.page.waitForLoadState('load');
        await this.acceptAlert.waitFor({ state: 'visible' });
        await this.acceptAlert.click();
    }
}

module.exports = HomePage;
