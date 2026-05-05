const { delay, gentleScroll, safeNavigate } = require('./scraperUtils');

module.exports = async function scrapeHack2Skill(page) {
  await safeNavigate(page, 'Hack2Skill', 'https://hack2skill.com', ['a[href*="/event/"]']);
  await gentleScroll(page);
  await delay(1200);

  return page.evaluate(() => {
    const ignored = /^(register now|registration closed|know more|explore more|login\/sign up)$/i;
    const titleNoise = /^(free|paid|virtual|online|offline|hybrid|in-person|free\s*\|.*|paid\s*\|.*|starts?|ends?|deadline|registration|registered|\d+|[A-Z]{3}\s+\d{1,2}|mon|tue|wed|thu|fri|sat|sun)/i;

    return Array.from(document.querySelectorAll('a[href*="/event/"]'))
      .map((linkEl) => {
        let card = linkEl;
        for (let i = 0; i < 5 && card.parentElement; i += 1) {
          card = card.parentElement;
          const usefulLines = (card.innerText || '')
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line && !ignored.test(line));
          if (usefulLines.length >= 2) break;
        }

        const lines = (card.innerText || '')
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line && !ignored.test(line));
        const fallbackTitle = linkEl.href
          .split('/event/')[1]
          ?.split(/[/?#]/)[0]
          ?.replace(/[-_]+/g, ' ')
          ?.replace(/\b\w/g, (char) => char.toUpperCase()) || '';
        const title = lines.find((line) => !titleNoise.test(line)) || fallbackTitle || lines[0] || '';
        const body = (card.innerText || '').toLowerCase();
        const mode = body.includes('offline') || body.includes('in-person')
          ? 'offline'
          : body.includes('hybrid')
            ? 'hybrid'
            : 'online';

        return {
          title,
          platform: 'Hack2Skill',
          link: linkEl.href,
          mode,
          dateText: card.innerText || '',
          tags: [],
        };
      })
      .filter((item) => item.title && item.link);
  });
};
