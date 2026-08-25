const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('request', request => {
    if (request.url().includes('/api/ai/')) {
      console.log('API Request:', request.url(), request.headers());
    }
  });
  page.on('response', async response => {
    if (response.url().includes('/api/ai/')) {
      console.log('API Response:', response.url(), response.status());
      try {
        console.log('API Response Body:', await response.text());
      } catch (e) {}
    }
  });

  console.log('Navigating...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // We need to login if needed. 
  // For now let's just see what happens.
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
