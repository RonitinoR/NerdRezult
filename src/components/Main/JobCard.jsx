import React from 'react';

interface JobCardProps {
  icon: string;
  title: string;
  tag: string;
  rate: string;
  highlights: string[];
  requirements: string[];
  meta: {
    posted: string;
    applicants: string;
    rating: string;
    location: string;
  };
  theme: "blue" | "red";
}

const JobCard: React.FC<JobCardProps> = ({
  icon,
  title,
  tag,
  rate,
  highlights,
  requirements,
  meta,
  theme,
}) => {
  const themeClass = theme === "blue" ? "blue" : "red";
  const tagClass = theme === "blue" ? "featured" : "urgent";

  return (
    <article className={`job-card job-card-${themeClass}`}>
      <div className={`job-icon job-icon-${themeClass}`}>{icon}</div>
      <div className="job-content">
        <div className="job-header">
          <h2 className="job-title">{title}</h2>
          <span className={`job-tag job-tag-${tagClass}`}>{tag}</span>
          <span className={`job-rate job-rate-${themeClass}`}>{rate}</span>
        </div>
        <div>
          <h3 className="section-title">Project Highlights:</h3>
          <ul className="job-highlights">
            {highlights.map((highlight, index) => (
              <li key={index} className="job-highlight-item">
                {highlight}
              </li>
            ))}
          </ul>
          <h3 className="section-title">Requirements:</h3>
          <div className="skills-list">
            {requirements.map((skill, index) => (
              <span key={index} className={`skill-tag skill-tag-${themeClass}`}>
                {skill}
              </span>
            ))}
          </div>
          <div className="job-meta">
            <span className="meta-item">🕒 Posted {meta.posted}</span>
            <span className="meta-item">👥 {meta.applicants} applicants</span>
            <span className="meta-item">⭐ {meta.rating} rating</span>
            <span className="meta-item">📍 {meta.location}</span>
          </div>
          <button className={`apply-btn apply-btn-${themeClass}`}>
            Apply Now
          </button>
        </div>
      </div>
    </article>
  );
};

export default JobCard;