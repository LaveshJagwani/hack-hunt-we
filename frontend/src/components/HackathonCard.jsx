import React, { useState, useEffect } from 'react';

function parseDeadline(raw) {
  if (!raw || raw.toLowerCase() === 'check website' || raw.toLowerCase() === 'n/a') {
    return null;
  }
  const d = new Date(raw);
  if (!isNaN(d.getTime()) && d.getFullYear() > 2000) {
    return d;
  }
  return null;
}

function getTimeRemaining(deadline) {
  const now = new Date();
  const diff = deadline - now;

  if (diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { expired: false, days, hours, minutes };
}

function getUrgencyClass(remaining) {
  if (remaining.expired) return 'deadline-expired';
  if (remaining.days <= 2) return 'deadline-urgent';
  if (remaining.days <= 7) return 'deadline-soon';
  return '';
}

const HackathonCard = ({ hackathon }) => {
  const deadlineDate = parseDeadline(hackathon.deadline);
  const [remaining, setRemaining] = useState(
    deadlineDate ? getTimeRemaining(deadlineDate) : null
  );

  useEffect(() => {
    if (!deadlineDate) return;
    const timer = setInterval(() => {
      setRemaining(getTimeRemaining(deadlineDate));
    }, 60000);
    return () => clearInterval(timer);
  }, [deadlineDate]);

  const urgencyClass = remaining ? getUrgencyClass(remaining) : '';
  const platformSlug = hackathon.platform
    ? hackathon.platform.toLowerCase().replace(/\s+/g, '')
    : '';

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{hackathon.title}</h3>
        <span className="platform-badge" data-platform={platformSlug}>
          {hackathon.platform}
        </span>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <div className="card-meta-item">
            <span style={{ textTransform: 'capitalize' }}>
              📍 {hackathon.mode || 'Online'}
            </span>
          </div>
        </div>

        <div className={`deadline-section ${urgencyClass}`}>
          <div className="deadline-label">Deadline</div>
          <div className="deadline-value">
            {hackathon.deadline || 'Check Website'}
          </div>

          {remaining && !remaining.expired && (
            <div className="deadline-countdown">
              <div className="countdown-unit">
                <span className="countdown-number">{remaining.days}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-unit">
                <span className="countdown-number">{remaining.hours}</span>
                <span className="countdown-label">Hrs</span>
              </div>
              <div className="countdown-unit">
                <span className="countdown-number">{remaining.minutes}</span>
                <span className="countdown-label">Min</span>
              </div>
            </div>
          )}

          {remaining && remaining.expired && (
            <div className="deadline-expired-text">Registration closed</div>
          )}
        </div>

        {hackathon.tags && hackathon.tags.length > 0 && (
          <div className="tags">
            {hackathon.tags.map((tag, idx) => (
              <span key={`${tag}-${idx}`} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="card-footer">
        <a
          href={hackathon.link}
          target="_blank"
          rel="noopener noreferrer"
          className="apply-btn"
        >
          View & Apply
        </a>
      </div>
    </div>
  );
};

export default HackathonCard;
