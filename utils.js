
function normalizeText(str) {
    return str
        .toLowerCase()              // ignore case
        .replace(/\s+/g, " ")       // collapse multiple spaces → single
        .trim();                    // trim ends
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitRandom = (min, max) => {
  return new Promise(res => setTimeout(res, Math.random() * (max - min) + min));
}

export async function selectBikeBrand(page, bikeBrand) {
    await delay(500);
    // await page.waitForSelector('div.elemntdropGroup.listMain.motorSelection');
    // const items = await page.$$('div.elemntdropGroup.listMain.motorSelection ul li');

    await page.waitForSelector('#oemId', { visible: true });
    await page.click('#oemId');

    await page.waitForSelector("#searchItemText");
    await page.type("#searchItemText", bikeBrand, { delay: 300 }); 

    const items = await page.$$('.searchableBox ul li');
    await delay(500);

    let clicked = false;
    for (const item of items) {
        const text = await item.evaluate(el => el.textContent.trim());
        if (text.toLowerCase() === bikeBrand.toLowerCase()) {
            await item.evaluate(el => el.scrollIntoView({ block: 'center' }));
            await item.click();
            console.log(`✅ Selected bike brand: ${text}`);
            clicked = true;
            break;
        }
    }

    if (!clicked) {
        throw new Error(`❌ Bike brand "${bikeBrand}" not found in list`);
    }
}

export async function selectBikeModel(page, bikeModal) {
     await delay(500);
    // await page.waitForSelector("div.elemntdropGroup.motorSelection.modelgrp", { visible: true });
    // const items = await page.$$("div.elemntdropGroup.motorSelection.modelgrp ul li");
    
    await page.waitForSelector('#modelId', { visible: true });
    await page.click('#modelId');

    await page.waitForSelector("#searchItemText");
    await page.type("#searchItemText", bikeModal, { delay: 300 }); 

    await delay(500);

    const items = await page.$$('.searchableBox ul li');

    let success;
    for (const item of items) {
        const text = await item.evaluate(el => el.textContent.trim());
        if (text.toLowerCase() === bikeModal.toLowerCase()) {
            await item.evaluate(el => el.scrollIntoView({ block: 'center' }));
            await item.click();
            console.log(`✅ Selected bike model: ${text}`);
            success = true;
            break;
        }
    }

    if (!success) {
        throw new Error(`❌ Bike model "${bikeModal}" not found in list`);
    }
}

export async function selectBikeVariant(page, bikeVariant) {
    await delay(500);
    await page.waitForSelector("div.elemntdropGroup.motorSelection.variantgrp", { visible: true });
    const items = await page.$$("div.elemntdropGroup.motorSelection.variantgrp ul li");
    // await page.waitForSelector('#variantId', { visible: true });
    // await page.click('#variantId');

    // await page.waitForSelector("#searchItemText");
    // // await page.type("#searchItemText", bikeVariant, { delay: 200 }); 

    // const items = await page.$$('.searchableBox ul li');

    let success;
    for (const item of items) {
        const text = await item.evaluate(el => el.textContent.trim());
        if (normalizeText(text) === normalizeText(bikeVariant)) {
            await item.evaluate(el => el.scrollIntoView({ block: 'center' }));
            await item.click();
            console.log(`✅ Selected bike variant: ${text}`);
            success = true;
            break;
        }
    }

    if (!success) {
        throw new Error(`❌ Bike variant "${bikeVariant}" not found in list`);
    }
}

export async function selectBikeCity(page, bikeCity) {
    await delay(500);
    await page.waitForSelector("div.elemntdropGroup.motorSelection", { visible: true });
    const items = await page.$$("div.elemntdropGroup.motorSelection ul li");
    // await page.waitForSelector('#cityId', { visible: true });
    // await page.click('#cityId');

    // await page.waitForSelector("#searchItemText");

    // const items = await page.$$('.searchableBox ul li');

    let success = true;
    for (const item of items) {
        const text = await item.evaluate(el => el.textContent.trim());
        if (normalizeText(text) === normalizeText(bikeCity)) {
            await item.evaluate(el => el.scrollIntoView({ block: 'center' }));
            await item.click();
            console.log(`✅ Selected bike city: ${text}`);
            success = true;
            break;
        }
    }

    if (!success) {
        throw new Error(`❌ Bike city "${bikeCity}" not found in list`);
    }
}

export async function selectRTO(page, rto) {
    await delay(500);
    let success = false;

    await page.waitForSelector(".wrapper > div");
    const cards = await page.$$(".wrapper > div");

    for (const card of cards) {
        const text = await card.evaluate(el => el.innerText.trim());
        if (text === rto) {
            success = true;
            await card.click();
            console.log(`✅ Clicked RTO: ${rto}`);
            break;
        }
    }

    if (!success) {
        throw new Error(`❌ RTO Number "${rto}" not found in list`);
    }
}

export async function selectBuyYear(page, year) {
     await delay(500);
    console.log('Selecting Buy Year ');

    const yearInput = await page.$('#year2');
    await yearInput.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await yearInput.click();

    await delay(1000);

    await page.waitForSelector(".searchableBox", { visible: true });
    await page.type(".searchableBox input", year, { delay: 500 }); 

    const items = await page.$$('.searchableBox ul li');

    let success;
    for (const item of items) {
        const text = await item.evaluate(el => el.textContent.trim());
        if (normalizeText(text) === normalizeText(year)) {
            await item.evaluate(el => el.scrollIntoView({ block: 'center' }));
            await item.click();
            console.log(`✅ Selected year: ${year}`);
            success = true;
            break;
        }
    }

    if (!success) {
        throw new Error(`❌ Year "${year}" not found in list`);
    }
}

export async function confirmDetails(page, knowPolicyEndDate, whenToInsure, previousPolicyEndDate, previousInsurer) {
    console.log("Waiting for confirm details page");

    try {
        await page.waitForSelector("div.gsc_modalWrapper.insuranceRenew", { visible: true, timeout: 10000 });
        console.log("✅ Modal opened");
    } catch (error) {
        throw new Error("Failed due to bot detection");
    }

    if (knowPolicyEndDate) {
        // Case 1: User knows policy end date → type into datepicker
        await page.waitForSelector("#customeDatePicker2", { visible: true });
        await page.click("#customeDatePicker2");

        await page.type("#customeDatePicker2", previousPolicyEndDate, { delay: 100 });
        console.log(`✅ Entered Previous Policy End Date: ${previousPolicyEndDate}`);
    } else {
        // Case 2: User does NOT know expiry date → click the link
        await page.waitForSelector("a.link", { visible: true });
        await page.click("a.link");
        console.log("✅ Clicked 'I don't know my expiry date'");

        // Select from dropdown "When do you want to insure your bike?"
        await page.waitForSelector("#prevPolicy", { visible: true });
        await page.click("#prevPolicy");

        await page.waitForSelector(".gs_ta_results ul li", { visible: true });
        const options = await page.$$(".gs_ta_results ul li");

        let matched = false;
        for (const option of options) {
            const text = await option.evaluate(el => el.innerText.trim());
            if (text.includes(whenToInsure)) {
                await option.click();
                console.log(`✅ Selected whenToInsure: ${text}`);
                matched = true;
                break;
            }
        }
        if (!matched) throw new Error(`❌ Could not find option for whenToInsure "${whenToInsure}"`);
    }

    await delay(500);

    // Common step: Select previous insurer
    await page.waitForSelector("#previous_insurer", { visible: true });
    await page.click("#previous_insurer");

    await page.waitForSelector(".gs_ta_results ul li", { visible: true });
    const insurers = await page.$$(".gs_ta_results ul li");

    let insurerMatched = false;
    for (const insurer of insurers) {
        const text = await insurer.evaluate(el => el.innerText.trim());
        if (text.includes(previousInsurer)) {
            await insurer.click();
            console.log(`✅ Selected Previous Insurer: ${text}`);
            insurerMatched = true;
            break;
        }
    }
    if (!insurerMatched) throw new Error(`❌ Previous insurer "${previousInsurer}" not found`);

    await delay(1000);

    // Click confirm button
    await page.waitForSelector("button.submitButton[name='submitBtn']", { visible: true });
    await page.click("button.submitButton[name='submitBtn']");
    console.log("✅ Clicked Confirm Details");
}

export async function getQuotes(page) {
  console.log("🔄 Waiting for quotes to load...");

  await page.waitForSelector(".quotesListe .plancardv3", { visible: true });

  let lastCount = 0;
  let stableFor = 0;
  const timeout = 4000; // 4s of stability
  const checkInterval = 500; // check every 0.5s

  while (true) {
    const currentCount = await page.$$eval(".quotesListe .plancardv3", cards => cards.length);

    if (currentCount === lastCount) {
      stableFor += checkInterval;
    } else {
      stableFor = 0; // reset timer if new quotes appear
      lastCount = currentCount;
    }

    if (stableFor >= timeout) {
      console.log(`✅ No new quotes detected for ${timeout / 1000}s. Total quotes: ${currentCount}`);
      break;
    }

    await delay(checkInterval);
  }

  // Extract quotes once stable
  const quotes = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".quotesListe .plancardv3"));

    return cards.map(card => {
      const brandName = card.querySelector(".brandNam")?.innerText.trim() || null;
      const logo = card.querySelector(".brandLogo img")?.src || null;
      const bikeValue = card.querySelector(".valgrp .val")?.innerText.trim() || null;
      const policyStartDate = Array.from(card.querySelectorAll(".valgrp .titl"))
        .find(el => el.innerText.includes("Policy Start Date"))
        ?.nextElementSibling?.innerText.trim() || null;
      const premium = card.querySelector(".right button span")?.innerText.replace(/arrow/i, "").trim() || null;
      const claimSettled = card.querySelector(".claimset")?.innerText.trim() || null;
      const policiesSold = card.querySelector(".policiesold")?.innerText.trim() || null;

      return {
        brandName,
        logo,
        bikeValue,
        policyStartDate,
        premium,
        claimSettled,
        policiesSold,
      };
    });
  });

  console.log(`📊 Extracted ${quotes.length} quotes`);
  return quotes;
}