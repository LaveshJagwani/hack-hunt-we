const express = require('express');
const router = express.Router();
const Hackathon = require('../models/Hackathon');
const { updateDatabase } = require('../services/scheduler');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseDeadline(raw) {
  if (!raw || typeof raw !== 'string') return null;

  const cleaned = raw.trim();
  if (!cleaned || /^(unknown|check website|n\/a|tbd)$/i.test(cleaned)) return null;

  const direct = new Date(cleaned);
  if (!Number.isNaN(direct.getTime()) && direct.getFullYear() > 2000) {
    return direct;
  }

  const currentYear = new Date().getFullYear();
  const monthFirstMatch = cleaned.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,\s*|\s+)?(\d{4})?/i
  );
  const dayFirstMatch = cleaned.match(
    /\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\.|,)?(?:\s+(\d{4}))?/i
  );
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
  const buildUtcDate = (monthName, day, year) => (
    new Date(Date.UTC(Number(year || currentYear), monthLookup[monthName.slice(0, 3).toLowerCase()], Number(day)))
  );

  const parsed = monthFirstMatch
    ? buildUtcDate(monthFirstMatch[1], monthFirstMatch[2], monthFirstMatch[3])
    : dayFirstMatch
      ? buildUtcDate(dayFirstMatch[2], dayFirstMatch[1], dayFirstMatch[3])
      : null;

  if (!parsed) return null;

  if (!Number.isNaN(parsed.getTime()) && parsed.getFullYear() > 2000) {
    return parsed;
  }

  return null;
}

function toClientHackathon(hackathon) {
  const item = hackathon.toObject ? hackathon.toObject() : hackathon;
  const parsedDeadline = parseDeadline(item.deadline);

  return {
    ...item,
    parsedDeadline: parsedDeadline ? parsedDeadline.toISOString() : null,
  };
}

function escapeIcsText(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function toIcsDate(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function toSafeFilename(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70) || 'hackathon';
}

function createCalendarEvent(hackathon, deadlineDate) {
  const startDate = toIcsDate(deadlineDate);
  const endDate = toIcsDate(new Date(deadlineDate.getTime() + 24 * 60 * 60 * 1000));
  const title = `${hackathon.title} registration deadline`;
  const description = [
    `Platform: ${hackathon.platform || 'Hackathon'}`,
    `Mode: ${hackathon.mode || 'online'}`,
    `Deadline shown on website: ${hackathon.deadline || 'Check Website'}`,
    `Apply: ${hackathon.link}`,
  ].join('\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HackHunt//Hackathon Deadline//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${hackathon._id}@hackhunt`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `URL:${hackathon.link}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function buildInsights(hackathons) {
  const platformSet = new Set();
  let onlineCount = 0;
  let upcomingCount = 0;
  const now = new Date();

  hackathons.forEach((hackathon) => {
    if (hackathon.platform) platformSet.add(hackathon.platform);
    if ((hackathon.mode || '').toLowerCase() === 'online') onlineCount++;

    const parsedDeadline = parseDeadline(hackathon.deadline);
    if (parsedDeadline && parsedDeadline >= now) upcomingCount++;
  });

  return {
    total: hackathons.length,
    platforms: platformSet.size,
    online: onlineCount,
    upcoming: upcomingCount,
  };
}

function scoreHackathon(hackathon) {
  let score = 0;
  const parsedDeadline = parseDeadline(hackathon.deadline);
  const tags = Array.isArray(hackathon.tags) ? hackathon.tags : [];
  const createdAt = hackathon.createdAt ? new Date(hackathon.createdAt).getTime() : 0;

  if (parsedDeadline) {
    const daysUntilDeadline = Math.ceil((parsedDeadline - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilDeadline >= 0) score += 80;
    if (daysUntilDeadline >= 0 && daysUntilDeadline <= 30) score += 35;
    if (daysUntilDeadline > 30) score += 15;
  }

  score += Math.min(tags.length, 5) * 6;
  if ((hackathon.mode || '').toLowerCase() === 'online') score += 10;
  if (hackathon.platform) score += 6;
  score += Math.min(createdAt / 100000000000, 20);

  return score;
}

// GET /hackathons -> returns stored data
router.get('/hackathons', async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 });
    res.json({
      data: hackathons.map(toClientHackathon),
      count: hackathons.length,
      insights: buildInsights(hackathons),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
});

// GET /top?limit=6 -> curated homepage list
router.get('/top', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 6, 12);
    const hackathons = await Hackathon.find().sort({ createdAt: -1 }).limit(80);
    const topHackathons = hackathons
      .sort((a, b) => scoreHackathon(b) - scoreHackathon(a))
      .slice(0, limit)
      .map(toClientHackathon);

    res.json({ data: topHackathons, count: topHackathons.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top hackathons' });
  }
});

// GET /calendar -> upcoming dated hackathons for calendar UI
router.get('/calendar', async (req, res) => {
  try {
    const savedOnly = req.query.saved === 'true';
    const filter = savedOnly ? { savedToCalendar: true } : {};
    const hackathons = await Hackathon.find(filter);
    const now = new Date();
    const events = hackathons
      .map((hackathon) => {
        const parsedDeadline = parseDeadline(hackathon.deadline);
        if (!parsedDeadline) return null;
        if (!savedOnly && parsedDeadline < now) return null;

        return {
          _id: hackathon._id,
          title: hackathon.title,
          platform: hackathon.platform,
          link: hackathon.link,
          mode: hackathon.mode,
          deadline: hackathon.deadline,
          startDate: hackathon.startDate,
          savedToCalendar: hackathon.savedToCalendar,
          date: parsedDeadline.toISOString(),
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ data: events, count: events.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

// POST /calendar/:id/save -> adds a hackathon to the app calendar
router.post('/calendar/:id/save', async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    const parsedDeadline = parseDeadline(hackathon.deadline);
    if (!parsedDeadline) {
      return res.status(422).json({
        error: 'This hackathon does not have a calendar-ready deadline yet',
      });
    }

    hackathon.savedToCalendar = true;
    await hackathon.save();

    res.json({
      message: 'Hackathon added to calendar.',
      data: toClientHackathon(hackathon),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save hackathon to calendar' });
  }
});

// GET /calendar/:id/ics -> downloads an .ics file for the scraped deadline date
router.get('/calendar/:id/ics', async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    const parsedDeadline = parseDeadline(hackathon.deadline);
    if (!parsedDeadline) {
      return res.status(422).json({
        error: 'This hackathon does not have a calendar-ready deadline yet',
      });
    }

    const ics = createCalendarEvent(hackathon, parsedDeadline);
    const filename = `${toSafeFilename(hackathon.title)}-deadline.ics`;

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(ics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
});

// GET /search?q= -> search by title/tags
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const hackathons = await Hackathon.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json({ data: hackathons.map(toClientHackathon), count: hackathons.length });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /filter?platform=&mode=
router.get('/filter', async (req, res) => {
  try {
    const { platform, mode } = req.query;
    const filter = {};
    if (platform) filter.platform = { $regex: new RegExp(`^${escapeRegex(platform)}$`, 'i') };
    if (mode) filter.mode = { $regex: new RegExp(`^${escapeRegex(mode)}$`, 'i') };

    const hackathons = await Hackathon.find(filter).sort({ createdAt: -1 });
    res.json({ data: hackathons.map(toClientHackathon), count: hackathons.length });
  } catch (error) {
    res.status(500).json({ error: 'Filter failed' });
  }
});

// GET /refresh -> triggers scraping manually
router.get('/refresh', async (req, res) => {
  try {
    console.log('Manual refresh triggered.');
    // Start non-blocking so the HTTP request doesn't timeout
    updateDatabase(); 
    res.json({ message: 'Scraping job started successfully. Check server logs for progress. Data will merge momentarily.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger refresh' });
  }
});

// POST /refresh -> runs scraping now and returns the scrape summary
router.post('/refresh', async (req, res) => {
  try {
    console.log('Manual refresh requested from frontend.');
    const result = await updateDatabase();
    res.json({
      message: 'Refresh completed.',
      result,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh hackathons' });
  }
});

module.exports = router;
