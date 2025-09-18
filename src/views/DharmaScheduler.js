import React, { useState, useEffect } from "react";
import "./DharmaScheduler.css";

import S1 from "../images/S1.png";
import S2 from "../images/S2.png";
import S3 from "../images/S3.png";

import K1 from "../images/k1.png";
import K2 from "../images/k2.png";
import K3 from "../images/k3.png";

import G1 from "../images/g1.png";
import G2 from "../images/g2.png";
import G3 from "../images/g3.png";
import G4 from "../images/g4.png";
import G5 from "../images/g5.png";

import KarmicBG from "../images/b1.jpg";
import Q1 from "../images/q1.png"; // explore background
import Q2 from "../images/q2.png"; // progress background

function DharmaScheduler() {
  const [mode, setMode] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [exploreMode, setExploreMode] = useState(false);
  const [progressPage, setProgressPage] = useState(false);

  const [goals, setGoals] = useState([]);
  const [goalInput, setGoalInput] = useState("");

  const [progress, setProgress] = useState([]);
  const [progressTitle, setProgressTitle] = useState("");
  const [progressSummary, setProgressSummary] = useState("");

  const [currentSlide, setCurrentSlide] = useState(0);

  const modes = {
    warrior: {
      title: "Warrior Mode",
      desc: "Step into a disciplined mindset for goals, hustle, and achievements. Warrior mode gives you energy to fight challenges.",
      img: K1,
    },
    healing: {
      title: "Healing Mode",
      desc: "Slow down, reflect, and nurture your mind and soul. This mode focuses on journaling, mindfulness, and inner peace.",
      img: K2,
    },
    dreamer: {
      title: "Dreamer Mode",
      desc: "Imagine your best future self. Dreamer mode inspires vision boards, creativity, and bold aspirations.",
      img: K3,
    },
  };

  const quotes = [
    "Dream big, work hard, stay humble.",
    "Healing starts with self-love.",
    "The warrior fights not to win, but to grow.",
    "Your vision creates your reality.",
    "Peace is the ultimate power.",
  ];
  const images = [G1, G2, G3, G4, G5];

  const progressQuotes = [
    "Small steps build great journeys.",
    "Consistency beats intensity.",
    "Every day is progress, no matter how small.",
    "Discipline creates freedom.",
    "Your effort today is your reward tomorrow.",
  ];

  // 🟦 Auto carousel effect
  useEffect(() => {
    if (exploreMode) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [exploreMode, images]); // ✅ fixed dependency

  // 🟦 Add goal
  const addGoal = (e) => {
    e.preventDefault();
    if (goalInput.trim() !== "") {
      setGoals([
        ...goals,
        { text: goalInput, date: new Date().toLocaleDateString(), done: false },
      ]);
      setGoalInput("");
    }
  };

  // 🟦 Toggle goal done
  const toggleGoal = (index) => {
    const updatedGoals = [...goals];
    updatedGoals[index].done = !updatedGoals[index].done;
    setGoals(updatedGoals);
  };

  // 🟦 Add progress (30 days limit)
  const addProgress = (e) => {
    e.preventDefault();
    if (progressTitle.trim() !== "" && progressSummary.trim() !== "") {
      let updated = [
        {
          title: progressTitle,
          summary: progressSummary,
          date: new Date().toLocaleDateString(),
        },
        ...progress,
      ];
      if (updated.length > 30) updated = updated.slice(0, 30);
      setProgress(updated);
      setProgressTitle("");
      setProgressSummary("");
    }
  };

  // 🟦 Progress Page
  if (progressPage) {
    return (
      <div className="progress-page" style={{ backgroundImage: `url(${Q2})` }}>
        <button className="back-btn" onClick={() => setProgressPage(false)}>
          ⬅ Back
        </button>

        <h1 className="progress-heading">Your Daily Progress</h1>

        <div className="progress-big-cards">
          {progress.map((p, i) => (
            <div key={i} className="progress-big-card">
              <div className="completed-badge">Day {progress.length - i}</div>
              <div className="date-badge">{p.date}</div>
              <h2>{p.title}</h2>
              <p>{p.summary}</p>
              <div className="progress-quote">
                {progressQuotes[i % progressQuotes.length]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🟦 Main Page
  return (
    <div
      className="dharma-page"
      style={{ backgroundImage: `url(${KarmicBG})` }}
    >
      {!exploreMode && (
        <>
          <header className="dharma-header">
            <h1>Dharma Scheduler</h1>
            <p>Select your Life Mode — let your sword guide the way.</p>
          </header>

          <section className="sword-container">
            {Object.keys(modes).map((key) => (
              <div
                key={key}
                className={`sword-box ${mode === key ? "active" : ""}`}
                onClick={() => {
                  setMode(key);
                  setShowCard(true);
                }}
              >
                <img
                  src={key === "warrior" ? S1 : key === "healing" ? S2 : S3}
                  alt={`${modes[key].title} Sword`}
                  className="sword-img"
                />
                <h2>{modes[key].title}</h2>
              </div>
            ))}
          </section>

          {showCard && (
            <div className="mode-card-overlay">
              <div className="mode-card">
                <h3>{modes[mode].title}</h3>
                <p>{modes[mode].desc}</p>
                <img
                  src={modes[mode].img}
                  alt={modes[mode].title}
                  className="mode-img"
                />
                <div className="card-buttons">
                  <button
                    className="explore-btn"
                    onClick={() => {
                      setShowCard(false);
                      setExploreMode(true);
                    }}
                  >
                    Explore
                  </button>
                  <button
                    className="back-btn"
                    onClick={() => setShowCard(false)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {exploreMode && (
        <div
          className="explore-page"
          style={{ backgroundImage: `url(${Q1})` }}
        >
          <div className="explore-content">
            <div className="quotes-carousel">
              <div
                className="quote-slide"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  display: "flex",
                  transition: "transform 0.8s ease",
                  width: `${images.length * 100}%`,
                }}
              >
                {images.map((img, i) => (
                  <div
                    key={i}
                    style={{ flex: "0 0 100%", position: "relative" }}
                  >
                    <img src={img} alt={`bg-${i}`} />
                    {/* ✅ Safe quote access */}
                    <div className="quote-text">{quotes[i % quotes.length]}</div>
                  </div>
                ))}
              </div>
            </div>

            <form className="goal-form" onSubmit={addGoal}>
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Add your goal..."
              />
              <button type="submit">Add Goal</button>
            </form>

            <div className="goals-list">
              {goals.map((goal, i) => (
                <div key={i} className={`goal-item ${goal.done ? "done" : ""}`}>
                  <input
                    type="checkbox"
                    checked={goal.done}
                    onChange={() => toggleGoal(i)}
                  />
                  <span>
                    {goal.text} ({goal.date})
                  </span>
                </div>
              ))}
            </div>

            <form className="progress-form" onSubmit={addProgress}>
              <h3>Add Your Progress</h3>
              <input
                type="text"
                value={progressTitle}
                onChange={(e) => setProgressTitle(e.target.value)}
                placeholder="Progress Title"
              />
              <textarea
                value={progressSummary}
                onChange={(e) => setProgressSummary(e.target.value)}
                placeholder="Daily Summary"
              ></textarea>
              <button type="submit">Save Progress</button>
            </form>

            <button className="back-btn" onClick={() => setProgressPage(true)}>
              See Your Progress
            </button>

            <button className="back-btn" onClick={() => setExploreMode(false)}>
              Back to Modes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DharmaScheduler;
