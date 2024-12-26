const BasePage = require('./base');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../config.json');

class OpinionPage extends BasePage {
    constructor(page) {
        super(page);
        this.articleSelector = 'article.c.c-o.c-d.c--m-n'; // CSS selector for articles
        this.articleTitleSelector = 'h2'; // Selector for article title
        this.articleContentSelector = 'p'; // Selector for article content
        this.articleImageSelector = 'img'; // Selector for article image
        this.RAPID_API_HOST = config.RAPID_API_HOST; // API host from config
        this.RAPID_API_KEY = config.RAPID_API_KEY;   // API key from config
    }

    async getFirstFiveArticles() {
        await this.page.waitForSelector(this.articleSelector, { timeout: 5000 });
        const articles = await this.page.locator(this.articleSelector).all();
        console.log(`Total articles found: ${articles.length}`);
        const maxArticles = Math.min(5, articles.length); // Limit to 5 articles
        const articleData = [];

        for (let i = 0; i < maxArticles; i++) {
            const article = articles[i];

            // Extract Title
            const title = await article.locator(this.articleTitleSelector).isVisible()
                ? (await article.locator(this.articleTitleSelector).textContent())?.trim() || 'No Title'
                : 'No Title';

            // Extract Content
            const content = await article.locator(this.articleContentSelector).isVisible()
                ? (await article.locator(this.articleContentSelector).textContent())?.trim() || 'No Content'
                : 'No Content';

            // Download Cover Image if Available
            const imageStatus = await article.locator(this.articleImageSelector).isVisible()
                ? await this.downloadImage(await article.locator(this.articleImageSelector).getAttribute('src'), `article_${i + 1}.jpg`)
                : 'No Image';

            articleData.push({
                title,
                content,
                imageStatus
            });
        }

        return articleData;
    }

    async downloadImage(imageUrl, fileName) {
        const imagePath = path.join(__dirname, 'images'); // Folder to store images
        const filePath = path.join(imagePath, fileName);
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        return new Promise(resolve => {
            writer.on('finish', () => resolve(`Image saved: ${filePath}`));
            writer.on('error', () => resolve('Image Download Failed'));
        });
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async translateText(text, fromLang = 'es', toLang = 'en') {
        try {
            const response = await axios.post('https://rapid-translate-multi-traduction.p.rapidapi.com/t', {
                from: fromLang,
                to: toLang,
                q: text
            }, {
                headers: {
                    'X-RapidAPI-Key': this.RAPID_API_KEY,
                    'X-RapidAPI-Host': this.RAPID_API_HOST,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.translated_text || 'Translation failed';
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log('Rate limit exceeded. Retrying after 5 seconds...');
                // Wait for 5 seconds before retrying the request
                await this.sleep(5000);
                return this.translateText(text, fromLang, toLang); // Retry the translation after the delay
            }

            console.error('Error translating text:', error);
            return text; // Return the original text if translation fails
        }
    }

    async analyzeRepeatedWords(titles) {
        const wordCounts = {};
        const repeatedWords = {};
        titles.forEach((title) => {
            const words = title.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/); // Split by whitespace
            for (let word of words) {
                if (wordCounts[word]) {
                    wordCounts[word]++;
                } else {
                    wordCounts[word] = 1;
                }
            }
        });

        for (let word in wordCounts) {
            if (wordCounts[word] > 1) {
                repeatedWords[word] = wordCounts[word];
            }
        }

        return repeatedWords;
    }
}

module.exports = OpinionPage;
