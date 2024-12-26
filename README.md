El País Opinion Section Automation with Playwright:

Project Overview:
This project automates the process of scraping, translating, analyzing, and validating articles from the El País Opinion section using Playwright, JavaScript, and external APIs. It focuses on cross-browser scalability, error handling, and fallback mechanisms to ensure robustness.

Key Features:

1. Web Scraping & Data Extraction
Extract first five articles from the Opinion section.
Fetch details including:
- Title
- Content
- Cover Image (downloaded locally)

2. Real-Time Translation
Integrates with Rapid Translate Multi Traduction API.
Translates article titles from Spanish (es) to English (en).
Implements rate-limit handling with retries for API failures.

3. Text Analysis for Repeated Words
Analyzes translated or original titles to identify repeated words.
Provides word frequency counts for patterns or anomalies.

4. Cross-Browser Testing with BrowserStack
Ensures compatibility across multiple browsers and platforms.
Scales automation scripts for parallel testing.

5. Error Handling & Fallback Mechanism
If translation API fails, falls back to analyzing original Spanish titles.
Clear logging and retry mechanisms for smoother execution.

6. Configuration Management
Config File: config.json file is used to fetch credentials and other configuration parameters, instead of hardcoding sensitive information in the code.
This enhances security and flexibility, enabling easy updates to credentials and configurations.

7. Test Reporting with Allure
Allure Reports: Integrated Allure reporting to generate detailed and visually appealing test reports.
Helps track test execution, view detailed logs, and monitor the overall health of the tests.


Test Scenarios:

Scenario 1: Navigate and Validate Language
Goal: Ensure the webpage is in Spanish (lang="es-ES").
Steps:
1. Navigate to elpais.com.
2. Validate the lang attribute of the HTML tag.
Expected Outcome: Language attribute is es-ES.

Scenario 2: Accept Cookie Message
Goal: Ensure the cookie message does not obstruct interactions.
Steps:
1. Detect and accept cookie consent messages.
Expected Outcome: Cookie popup is dismissed successfully.

Scenario 3: Scrape First Five Articles
Goal: Extract details from the first five articles.
Steps:
1. Scrape title, content, and image from five articles.
2. Download cover images locally.
Expected Outcome: Five articles with details and saved images.

Scenario 4: Translate Titles to English
Goal: Translate article titles from Spanish to English.
Steps:
1. Use Rapid Translate API for translation.
2. Handle retries in case of rate limits or API failure.
Expected Outcome: Titles are successfully translated to English.

Scenario 5: Analyze Repeated Words
Goal: Identify repeated words in article titles.
Steps:
1. Analyze translated titles for word frequency.
2. If translation fails, analyze original Spanish titles.
Expected Outcome: List of repeated words with their occurrence count.

Scenario 6: Cross-Browser Validation
Goal: Ensure consistent behavior across browsers.
Steps:
1. Run tests on BrowserStack for cross-browser compatibility.
Expected Outcome: Tests pass successfully on multiple browsers.


Tech Stack:
Browser Automation - Playwright
Backend Runtime Environment - Node.js
Scripting Language - Javascript
Text Translation API - RapidAPI
HTTP Requests for API Calls - Axios
Cross-Browser Testing - Browserstack
Image Downloading and Storage - fs(File System)


Error Handling:
1. Translation API Rate-Limit: Automatic retry after 5 seconds.
2. Fallback for Analysis: Uses Spanish titles if translations fail.
3. Image Download Failures: Logs error without breaking execution.


Best Practices Followed
1. Modular code with reusable Page Object Model (POM).
2. Error retries and fallbacks for robustness.
3. Detailed logs and meaningful console outputs.
4. Scalability with BrowserStack integration.
5. Configuration Management: Sensitive data like credentials are managed via config.json for security and flexibility.
6. Test Reporting: Integration with Allure for detailed and user-friendly test reports.