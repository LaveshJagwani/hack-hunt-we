import React from 'react';

const HackathonCard = ({ hackathon }) => {
  const formattedDate = hackathon.deadline && hackathon.deadline !== 'Check Website'
    ? hackathon.deadline
    : 'Check Website';

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{hackathon.title}</h3>
        <span className="platform-badge">{hackathon.platform}</span>
      </div>
      <div className="card-body">
        <p><strong>Mode:</strong> <span style={{ textTransform: 'capitalize'}}>{hackathon.mode}</span></p>
        <p><strong>Deadline:</strong> {formattedDate}</p>
        {hackathon.tags && hackathon.tags.length > 0 && (
          <div className="tags">
            {hackathon.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="card-footer">
        <a href={hackathon.link} target="_blank" rel="noopener noreferrer" className="apply-btn">
          View & Apply
        </a>
      </div>
    </div>
  );
};

export default HackathonCard;
