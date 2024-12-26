const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/home');
const OpinionPage = require('../pages/opinion');
const config = require('../config.json');

let homePage;
let opinionPage;
let articles;

test.describe('Scraping, Translating, and Analyzing Articles from El País', () => {

    test.beforeAll(async ({ page }) => {
        console.log('Setup: Initializing page objects and navigating to El País');
        homePage = new HomePage(page);
        opinionPage = new OpinionPage(page);

        await homePage.navigateTo(config.BASE_URL);
    });

    test.beforeEach(async () => {
        console.log('Preparing: Accepting cookie message and navigating to the Opinion section');
        await homePage.acceptMsg();
        await homePage.goToOpinionSection();
        articles = await opinionPage.getFirstFiveArticles();
    });

    test.afterEach(async () => {
        console.log('Clean-up: Finished individual test step.');
    });

    test.afterAll(async () => {
        console.log('Final clean-up: All tests completed.');
    });

    test('Scrape, Translate, and Analyze Articles from El País', async () => {
        // 1. Validate Language
        const lang = await homePage.page.locator('html').getAttribute('lang');
        console.log(`Page Language Attribute: ${lang}`);
        expect(lang).toBe('es-ES');

        // 2. Print and Translate Article Titles, Content, and Image Status
        console.log('📰 **First Five Articles from Opinion Section:**');
        const translatedTitles = []; // To store translated titles for analysis
        const originalTitles = [];   // To store original Spanish titles for fallback analysis

        for (const [index, article] of articles.entries()) {
            console.log(`\nArticle ${index + 1}:`);
            console.log(`Title (ES): ${article.title}`);
            console.log(`Content: ${article.content}`);
            console.log(`Image Status: ${article.imageStatus}`);

            if (article.title && article.title !== 'No Title') {
                originalTitles.push(article.title); // Store the original Spanish title

                try {
                    // 3. Attempt to Translate Title
                    const translatedTitle = await opinionPage.translateText(article.title);

                    if (translatedTitle && translatedTitle !== 'Translation failed') {
                        console.log(`Title (EN): ${translatedTitle}`);
                        translatedTitles.push(translatedTitle);
                    } else {
                        console.warn('⚠️ Translation failed, using original Spanish title for analysis.');
                    }
                } catch (error) {
                    console.error('Error during translation:', error.message);
                    console.warn('⚠️ Falling back to original Spanish title for analysis.');
                }
            } else {
                console.log('Title (EN): No Title to Translate');
            }
        }

        // 4. Analyze Titles (Fallback Logic Included)
        let repeatedWords;
        if (translatedTitles.length > 0) {
            repeatedWords = opinionPage.analyzeRepeatedWords(translatedTitles);
            console.log('\n **Repeated Words in Translated Titles:**');
        } else {
            repeatedWords = opinionPage.analyzeRepeatedWords(originalTitles);
            console.log('\n **Repeated Words in Original Spanish Titles (Fallback):**');
        }

        if (Object.keys(repeatedWords).length > 0) {
            for (const [word, count] of Object.entries(repeatedWords)) {
                console.log(`Word: "${word}", Count: ${count}`);
            }
        } else {
            console.log('No repeated words found more than twice.');
        }

        // 5. Validate Articles Fetched
        expect(articles.length).toBeGreaterThanOrEqual(1);
        expect(originalTitles.length).toBeGreaterThanOrEqual(1);
    });
});
