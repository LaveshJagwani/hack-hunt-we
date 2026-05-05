const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setupPage(page, platform) {
  page.setDefaultNavigationTimeout(45000);
  page.setDefaultTimeout(15000);
  page.on('error', (error) => {
    console.error(`[Scraper Error] ${platform} page crashed: ${error.message}`);
  });
  page.on('pageerror', (error) => {
    console.error(`[Scraper PageError] ${platform}: ${error.message}`);
  });
  await page.setUserAgent(DEFAULT_USER_AGENT);
  await page.setViewport({ width: 1366, height: 900 });
}

async function safeNavigate(page, platform, url, selectors = []) {
  console.log(`[Scraper] ${platform}: navigating to ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  console.log(`[Scraper] ${platform}: DOM loaded`);

  if (selectors.length) {
    try {
      await Promise.any(
        selectors.map((selector) =>
          page.waitForSelector(selector, { timeout: 15000 }).catch((error) => {
            throw new Error(`${selector}: ${error.message}`);
          })
        )
      );
      console.log(`[Scraper] ${platform}: content selector found`);
    } catch (error) {
      console.warn(`[Scraper] ${platform}: selectors were not found before timeout`);
    }
  }

  await delay(1500);
}

async function gentleScroll(page) {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const steps = 3;
    for (let i = 0; i < steps; i += 1) {
      window.scrollBy(0, Math.floor(window.innerHeight * 0.9));
      await wait(450);
    }
  });
}

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function parseDate(text, preferEnd = false) {
  if (!text || typeof text !== 'string') return 'Unknown';

  const cleaned = cleanText(text)
    .replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, '$1')
    .replace(/\s*[-–—]\s*/g, ' - ');

  const isoMatch = cleaned.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (isoMatch) return isoMatch[0];

  const currentYear = new Date().getFullYear();
  const monthNames = 'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?';
  const monthFirst = new RegExp(`\\b(${monthNames})\\.?\\s+(\\d{1,2})(?:\\s*-\\s*(\\d{1,2}))?(?:,?\\s*(\\d{4}))?`, 'i');
  const dayFirst = new RegExp(`\\b(\\d{1,2})(?:\\s*-\\s*(\\d{1,2}))?\\s+(${monthNames})\\.?(?:,?\\s*(\\d{4}))?`, 'i');

  const monthFirstMatch = cleaned.match(monthFirst);
  const dayFirstMatch = cleaned.match(dayFirst);
  const monthLookup = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  const buildUtcDate = (monthName, day, year) => {
    const month = monthLookup[monthName.slice(0, 3).toLowerCase()];
    return new Date(Date.UTC(Number(year || currentYear), month, Number(day)));
  };
  const parsed = monthFirstMatch
    ? buildUtcDate(monthFirstMatch[1], preferEnd && monthFirstMatch[3] ? monthFirstMatch[3] : monthFirstMatch[2], monthFirstMatch[4])
    : dayFirstMatch
      ? buildUtcDate(dayFirstMatch[3], preferEnd && dayFirstMatch[2] ? dayFirstMatch[2] : dayFirstMatch[1], dayFirstMatch[4])
      : null;

  if (!parsed || Number.isNaN(parsed.getTime())) return 'Unknown';
  return parsed.toISOString().slice(0, 10);
}

function extractDateInfo(text) {
  const cleaned = cleanText(text);
  if (!cleaned) {
    return { deadline: 'Unknown', startDate: 'Unknown' };
  }

  const directIsoDates = cleaned.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [];
  if (directIsoDates.length) {
    return {
      deadline: directIsoDates[directIsoDates.length - 1],
      startDate: directIsoDates[0],
    };
  }

  const datePatternSource = String.raw`(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*[-–—]\s*\d{1,2}(?:st|nd|rd|th)?)?(?:,?\s*\d{4})?|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\.|,)?(?:\s*[-–—]\s*\d{1,2}(?:st|nd|rd|th)?)?(?:\s+\d{4})?|\d{4}-\d{2}-\d{2}`;
  const isoDates = cleaned.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [];
  const dates = [...(cleaned.match(new RegExp(datePatternSource, 'gi')) || []), ...isoDates];
  const deadlineLine = cleaned.match(/(?:deadline|ends?|closes?|register by|registration|submission|apply by|last date)[^.!?\n]{0,120}/i);
  const startLine = cleaned.match(/(?:starts?|begins?|from|opens?)[^.!?\n]{0,120}/i);
  const deadlineText = deadlineLine && [
    ...(deadlineLine[0].match(new RegExp(datePatternSource, 'gi')) || []),
    ...(deadlineLine[0].match(/\b\d{4}-\d{2}-\d{2}\b/g) || []),
  ];
  const startText = startLine && [
    ...(startLine[0].match(new RegExp(datePatternSource, 'gi')) || []),
    ...(startLine[0].match(/\b\d{4}-\d{2}-\d{2}\b/g) || []),
  ];

  return {
    deadline: parseDate((deadlineText && deadlineText[deadlineText.length - 1]) || dates[dates.length - 1], true),
    startDate: parseDate((startText && startText[0]) || dates[0]),
  };
}

function normalizeHackathon(item) {
  const title = cleanText(item.title);
  const link = cleanText(item.link);
  if (!title || !link || !/^https?:\/\//i.test(link)) return null;

  const extracted = extractDateInfo([
    item.deadline,
    item.startDate,
    item.dateText,
    item.title,
  ].filter(Boolean).join(' '));

  return {
    title,
    platform: item.platform,
    link,
    deadline: extracted.deadline,
    startDate: extracted.startDate,
    mode: item.mode || 'online',
    tags: Array.isArray(item.tags) ? item.tags : [],
  };
}

async function runCardScraper(page, config) {
  await safeNavigate(page, config.platform, config.url, config.waitSelectors || [config.cardSelector]);
  await gentleScroll(page);
  await delay(config.afterScrollDelay || 1200);

  return page.evaluate((cfg) => {
    function textOf(root, selectors) {
      for (const selector of selectors) {
        const el = root.querySelector(selector);
        if (el && el.innerText && el.innerText.trim()) return el.innerText.trim();
      }
      return '';
    }

    function hrefOf(root, selector, baseUrl) {
      const el = selector
        ? (root.matches && root.matches(selector) ? root : root.querySelector(selector))
        : root;
      const href = el && (el.href || el.getAttribute('href'));
      if (!href) return '';
      try {
        return new URL(href, baseUrl).href;
      } catch (error) {
        return href;
      }
    }

    function dateTextOf(root) {
      const selectors = [
        'time',
        '[datetime]',
        '[class*="deadline" i]',
        '[class*="date" i]',
        '[class*="time" i]',
        '[class*="end" i]',
        '[class*="start" i]',
        '[class*="reg" i]',
        '[class*="submission" i]',
      ];
      const parts = [root.innerText || ''];
      selectors.forEach((selector) => {
        root.querySelectorAll(selector).forEach((el) => {
          if (el.getAttribute('datetime')) parts.push(el.getAttribute('datetime'));
          if (el.innerText) parts.push(el.innerText);
        });
      });
      return parts.join(' ');
    }

    return Array.from(document.querySelectorAll(cfg.cardSelector))
      .map((card) => {
        const firstLine = (card.innerText || '').split('\n').map((line) => line.trim()).find(Boolean) || '';
        const title = textOf(card, cfg.titleSelectors) || firstLine;
        const link = hrefOf(card, cfg.linkSelector, cfg.baseUrl || cfg.url);
        const body = (card.innerText || '').toLowerCase();
        const mode = body.includes('digital') || body.includes('online')
          ? 'online'
          : body.includes('offline') || body.includes('in-person')
          ? 'offline'
          : body.includes('hybrid')
            ? 'hybrid'
            : cfg.defaultMode || 'online';

        return {
          title,
          platform: cfg.platform,
          link,
          mode,
          dateText: dateTextOf(card),
          tags: [],
        };
      })
      .filter((item) => item.title && item.link);
  }, config);
}

module.exports = {
  delay,
  extractDateInfo,
  normalizeHackathon,
  parseDate,
  gentleScroll,
  runCardScraper,
  safeNavigate,
  setupPage,
};
