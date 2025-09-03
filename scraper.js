import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-notifications"]
    });

    const page = await browser.newPage();
    await page.goto("https://www.insurancedekho.com/bike-insurance/quotes-page", { waitUntil: "networkidle2" });

    const tabs = [{
        tabName: 'Comprehensive',
        tabSelector: 'div.tabbs > div:nth-child(1)',
    }, {
        tabName: 'Third Party',
        tabSelector: 'div.tabbs > div:nth-child(2)',
    }, {
        tabName: 'Own Damage',
        tabSelector: 'div.tabbs > div:nth-child(3)',
    }];

    let allQuotes = [];

    for (const tab of tabs) {
        await page.click(tab.tabSelector);
        await page.waitForSelector(".tpcards_bike", { visible: true });

        const seeMoreBtn = await page.$("a.link.showmore.bold");
        if (seeMoreBtn) {
            await seeMoreBtn.click();
            await page.waitForSelector(".tpcards_bike", { visible: true });
        }

        const quotes = await page.$$eval(
            ".tpcards_bike",
            (cards, tabName) =>
                cards.map((card) => {
                    const name = card.querySelector(".lname")?.innerText.trim();
                    const price = card.querySelector(".starting span")?.innerText.trim();
                    
                    const features1 = Array.from(
                        card.querySelectorAll(".keyfeature ul li")
                    ).map((f) => f.innerText.trim());

                    const features2 = Array.from(
                        card.querySelectorAll(".tpAdvantage ul li span")
                    ).map((f) => f.innerText.trim());

                    const features = [...features1, ...features2];

                    return { name, price, type: tabName, features };
                }),
            tab.tabName
        );

        allQuotes.push(...quotes);
    }

    fs.writeFileSync("quotes.json", JSON.stringify(allQuotes, null, 2));

    await browser.close();
})();
