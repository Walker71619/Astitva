import React from "react";
import "./karmic.css";
import M1 from "../images/M1.png";
import M2 from "../images/M2.png";
import M3 from "../images/M3.png";
import M4 from "../images/M4.png";

const seekers = [
  { name: "Mahira", tribe: "Mind Balance", tags: ["Anxiety", "Time Management", "Procrastination"], image: M1 },
  { name: "Anshul", tribe: "Self Discipline", tags: ["Anxiety", "Discipline", "Focus"], image: M2 },
  { name: "Avanya", tribe: "Calm Minds", tags: ["Overthinking", "Time Management", "Procrastination"], image: M3 },
  { name: "Gourika", tribe: "Inner Peace", tags: ["Meditation", "sleeping", "Clarity"], image: M4 },
];

const Tribes = () => {
  return (
    <div className="karmic-page">
      <div className="tribe-container">
        {seekers.map((seeker, index) => (
          <div
            className="tribe-card"
            key={index}
            style={{
              backgroundImage: `url(${seeker.image})`,
            }}
          >
            <div className="tribe-content">
              <h3>{seeker.name}</h3>
              <p><strong>Tribe:</strong> {seeker.tribe}</p>
              <div className="tags">
                {seeker.tags.map((tag, idx) => <span className="tag" key={idx}>{tag}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tribes;
