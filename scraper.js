import puppeteer from "puppeteer-core";
//import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium"
import { delay, waitRandom, getQuotes, selectBikeBrand, selectBikeCity, selectBikeModel, selectBikeVariant, selectBuyYear, selectRTO, confirmDetails } from './utils.js';

export const scrapeQuotes = async (bikeData) => {
    const {
        bikeBrand, bikeModel, bikeVariant, bikeBuyYear,
        city, rtoNumber, knowPolicyEndDate, whenToInsure,
        previousPolicyEndDate, previousInsurer } = bikeData

    try {

        const browser = await puppeteer.launch({
            // executablePath: await chromium.executablePath(),
            // headless: chromium.headless,
            // defaultViewport: null,
            //args: [
                //...chromium.args,
                //"--disable-notifications",
                //"--window-size=1920,1080"
            //],
            executablePath: await chromium.executablePath(),
            headless: false,
            defaultViewport: { height: 1000, width: 1920 },
            args: [
                "--disable-notifications",
            ],
        });

        const page = await browser.newPage();
        await page.goto("https://www.insurancedekho.com/bike-insurance", {
            waitUntil: "networkidle2"
        });

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
        );

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
            Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
        });

        await selectBikeBrand(page, bikeBrand);
        await selectBikeModel(page, bikeModel);
        await selectBikeVariant(page, bikeVariant);
        await selectBikeCity(page, city);
        await selectRTO(page, rtoNumber);
        await selectBuyYear(page, bikeBuyYear);

        const submitBtn = await page.waitForSelector("button[name='submitBtn']", { visible: true });
        await submitBtn.click();

        console.log("✅ Submit button clicked");

        await delay(1000);

        await confirmDetails(page, knowPolicyEndDate, whenToInsure, previousPolicyEndDate, previousInsurer);

        const quotes = await getQuotes(page);

        return { quotes }

    } catch (error) {
        console.error("Error", error);
        throw new Error(error.message);
    }
}