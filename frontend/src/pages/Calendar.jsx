import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function formatDate(value) {
  if (!value) return 'Date to be announced';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function getMonthDays(date, events) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmpty = firstDay.getDay();
  const eventMap = events.reduce((map, event) => {
    const eventDate = new Date(event.date);
    if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
      const key = eventDate.getDate();
      map[key] = [...(map[key] || []), event];
    }
    return map;
  }, {});

  return [
    ...Array.from({ length: leadingEmpty }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      events: eventMap[index + 1] || [],
    })),
  ];
}

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/calendar?saved=true`);
        setCalendarEvents(response.data.data || []);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const calendarDays = useMemo(
    () => getMonthDays(calendarMonth, calendarEvents),
    [calendarEvents, calendarMonth]
  );

  const monthLabel = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(calendarMonth);

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Deadline planner</span>
        <h1>Calendar</h1>
      </section>

      <section className="section calendar-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Saved dates</span>
            <h2>Your hackathon calendar</h2>
          </div>
          <div className="calendar-controls">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
            >
              {'<'}
            </button>
            <span>{monthLabel}</span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
            >
              {'>'}
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <div className="calendar-layout">
            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div className="weekday" key={day}>{day}</div>
              ))}
              {calendarDays.map((day, index) => (
                <div className={day ? 'calendar-day' : 'calendar-day muted'} key={`${monthLabel}-${index}`}>
                  {day && (
                    <>
                      <span className="day-number">{day.day}</span>
                      {day.events.slice(0, 2).map((event) => (
                        <a href={event.link} target="_blank" rel="noopener noreferrer" key={event._id}>
                          {event.title}
                        </a>
                      ))}
                      {day.events.length > 2 && <small>+{day.events.length - 2} more</small>}
                    </>
                  )}
                </div>
              ))}
            </div>

            <aside className="upcoming-list">
              <h3>Saved hackathons</h3>
              {calendarEvents.slice(0, 5).length > 0 ? (
                calendarEvents.slice(0, 5).map((event) => (
                  <a className="upcoming-item" href={event.link} target="_blank" rel="noopener noreferrer" key={event._id}>
                    <span>{formatDate(event.date)}</span>
                    <strong>{event.title}</strong>
                    <small>{event.platform} / {event.mode || 'online'}</small>
                  </a>
                ))
              ) : (
                <p className="muted-copy">Save dated hackathons from Explore to add them here.</p>
              )}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

const LoadingState = () => (
  <div className="loading">
    <div className="loading-spinner"></div>
    <span className="loading-text">Loading calendar</span>
  </div>
);

export default Calendar;
