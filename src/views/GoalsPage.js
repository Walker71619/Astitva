import React, { useState } from "react";
import Bg4 from "../images/bg-4.png"; // main page bg
import patr from "../images/patr.jpg"; // parchment image for progress modal
import "./GoalsPage.css";

function GoalsPage() {
  const [goals, setGoals] = useState([
    { id: 1, title: "Learn React Basics" },
    { id: 2, title: "Daily Meditation" },
  ]);

  // form/modal states
  const [showModal, setShowModal] = useState(false); // roadmap form
  const [showProgress, setShowProgress] = useState(false); // parchment progress
  const [selectedGoal, setSelectedGoal] = useState(null);

  // roadmap form data (local until saved into a goal)
  const [roadmap, setRoadmap] = useState({
    title: "",
    startDate: "",
    endDate: "",
    subgoals: [""],
    checklist: [],
  });

  // open roadmap form for a particular goal (allow editing existing roadmap)
  const handleOpenModal = (goal) => {
    setSelectedGoal(goal);
    // if goal already has a roadmap saved, prefill the form
    if (goal.roadmap) {
      setRoadmap({
        title: goal.roadmap.title || "",
        startDate: goal.roadmap.startDate || "",
        endDate: goal.roadmap.endDate || "",
        subgoals: Array.isArray(goal.roadmap.subgoals) && goal.roadmap.subgoals.length > 0 ? goal.roadmap.subgoals : [""],
        checklist: Array.isArray(goal.roadmap.checklist) ? goal.roadmap.checklist : [],
      });
    } else {
      // else clear
      setRoadmap({
        title: "",
        startDate: "",
        endDate: "",
        subgoals: [""],
        checklist: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGoal(null);
    setRoadmap({
      title: "",
      startDate: "",
      endDate: "",
      subgoals: [""],
      checklist: [],
    });
  };

  // Save roadmap into the selected goal
  const handleSaveRoadmap = () => {
    if (!selectedGoal) return;
    const updatedGoals = goals.map((g) =>
      g.id === selectedGoal.id ? { ...g, roadmap: { ...roadmap } } : g
    );
    setGoals(updatedGoals);
    // update selectedGoal reference to saved roadmap
    const updatedSelected = updatedGoals.find((g) => g.id === selectedGoal.id);
    setSelectedGoal(updatedSelected);
    setShowModal(false);
  };

  const handleAddSubgoal = () => {
    setRoadmap({ ...roadmap, subgoals: [...roadmap.subgoals, ""] });
    setRoadmap(prev => ({
      ...prev,
      checklist: [...(prev.checklist || []), false]
    }));
  };

  const handleSubgoalChange = (index, value) => {
    const newSubgoals = [...roadmap.subgoals];
    newSubgoals[index] = value;
    setRoadmap({ ...roadmap, subgoals: newSubgoals });
  };

  const handleChecklistToggle = (index) => {
    const newChecklist = [...(roadmap.checklist || [])];
    newChecklist[index] = !newChecklist[index];
    setRoadmap({ ...roadmap, checklist: newChecklist });
  };

  // Open progress parchment for a goal (reads roadmap from goal if exists)
  const handleOpenProgress = (goal) => {
    setSelectedGoal(goal);
    setShowProgress(true);
    // If goal has roadmap, set local roadmap as that so checklist toggles reflect same array
    if (goal.roadmap) {
      setRoadmap({
        title: goal.roadmap.title || "",
        startDate: goal.roadmap.startDate || "",
        endDate: goal.roadmap.endDate || "",
        subgoals: goal.roadmap.subgoals || [""],
        checklist: goal.roadmap.checklist || Array.from({ length: (goal.roadmap.subgoals || []).length }, () => false),
      });
    } else {
      setRoadmap({
        title: "",
        startDate: "",
        endDate: "",
        subgoals: [""],
        checklist: [],
      });
    }
  };

  // When toggling checklist inside progress modal — update both local roadmap and the goal's roadmap (if saved)
  const toggleProgressChecklist = (index) => {
    const newChecklist = [...(roadmap.checklist || [])];
    newChecklist[index] = !newChecklist[index];
    setRoadmap({ ...roadmap, checklist: newChecklist });

    if (selectedGoal && selectedGoal.roadmap) {
      const updatedGoals = goals.map((g) =>
        g.id === selectedGoal.id
          ? { ...g, roadmap: { ...g.roadmap, checklist: newChecklist } }
          : g
      );
      setGoals(updatedGoals);
      // refresh selectedGoal reference
      setSelectedGoal(updatedGoals.find(g => g.id === selectedGoal.id));
    }
  };

  // small helpers for progress numbers
  const computeCompleted = (rm) => {
    if (!rm || !Array.isArray(rm.checklist)) return 0;
    return rm.checklist.filter(Boolean).length;
  };
  const computeTotal = (rm) => {
    if (!rm || !Array.isArray(rm.subgoals)) return 1;
    return Math.max(rm.subgoals.length, 1);
  };

  // Save changes made in the progress modal back to the goal (when user closes progress)
  const handleCloseProgress = () => {
    // if selectedGoal existed and had roadmap, update stored roadmap to current local roadmap
    if (selectedGoal) {
      const updatedGoals = goals.map((g) =>
        g.id === selectedGoal.id ? { ...g, roadmap: { ...roadmap } } : g
      );
      setGoals(updatedGoals);
    }
    setShowProgress(false);
    setSelectedGoal(null);
    setRoadmap({
      title: "",
      startDate: "",
      endDate: "",
      subgoals: [""],
      checklist: [],
    });
  };

  // render
  return (
    <div className="goals-page" style={{ backgroundImage: `url(${Bg4})` }}>
      <h1 className="page-title">MY GOALS</h1>

      <div className="goals-container">
        {goals.map((goal) => (
          <div key={goal.id} className="goal-card">
            <h2>{goal.title}</h2>

            {/* show small summary if roadmap exists */}
            {goal.roadmap ? (
              <p className="goal-sub">
                {computeCompleted(goal.roadmap)} / {computeTotal(goal.roadmap)} done
              </p>
            ) : (
              <p className="goal-sub">No roadmap yet</p>
            )}

            <div className="card-actions">
              <button className="add-roadmap-btn" onClick={() => handleOpenModal(goal)}>
                Add / Edit Roadmap
              </button>

              <button className="progress-btn" onClick={() => handleOpenProgress(goal)}>
                Progress
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap Form Modal */}
      {showModal && selectedGoal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Roadmap for: {selectedGoal.title}</h2>

            <input
              type="text"
              placeholder="Roadmap Title"
              value={roadmap.title}
              onChange={(e) => setRoadmap({ ...roadmap, title: e.target.value })}
            />

            <div className="date-row">
              <input
                type="date"
                value={roadmap.startDate}
                onChange={(e) => setRoadmap({ ...roadmap, startDate: e.target.value })}
              />
              <input
                type="date"
                value={roadmap.endDate}
                onChange={(e) => setRoadmap({ ...roadmap, endDate: e.target.value })}
              />
            </div>

            <h3>Subgoals</h3>
            {roadmap.subgoals.map((sg, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Subgoal ${i + 1}`}
                value={sg}
                onChange={(e) => handleSubgoalChange(i, e.target.value)}
              />
            ))}
            <button className="add-subgoal-btn" onClick={handleAddSubgoal}>
              + Add Subgoal
            </button>

            <h3>Checklist</h3>
            {roadmap.subgoals.map((sg, i) => (
              <label key={i} className="checklist-item">
                <input
                  type="checkbox"
                  checked={roadmap.checklist[i] || false}
                  onChange={() => handleChecklistToggle(i)}
                />
                {sg || `Subgoal ${i + 1}`}
              </label>
            ))}

            <div className="form-buttons">
              <button className="save-roadmap-btn" onClick={handleSaveRoadmap}>
                Save Roadmap
              </button>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Scroll Modal (parchment using patr.jpg) */}
      {showProgress && selectedGoal && (
        <div className="scroll-overlay">
          <div
            className="scroll-wrapper"
            style={{ backgroundImage: `url(${patr})` }} // ensure patr.jpg exists in src/images
          >
            <div className="scroll-rod top" aria-hidden="true"></div>

            <div className="scroll-content">
              <h2 className="scroll-heading">📜 Progress — {selectedGoal.title}</h2>

              {/* big percentage */}
              <div className="big-percent">
                {Math.round((computeCompleted(roadmap) / computeTotal(roadmap)) * 100) || 0}%
              </div>

              <p className="progress-summary">
                {computeCompleted(roadmap)} of {computeTotal(roadmap)} completed
              </p>

              <div className="ink-progress">
                <div
                  className="ink-fill"
                  style={{
                    width: `${(computeCompleted(roadmap) / computeTotal(roadmap)) * 100}%`,
                  }}
                />
              </div>

              <div className="subgoals-list">
                {roadmap.subgoals.map((sg, i) => {
                  const done = (roadmap.checklist && roadmap.checklist[i]) || false;
                  return (
                    <div key={i} className={`subgoal-row ${done ? "done" : ""}`}>
                      <button
                        className={`bullet ${done ? "bullet-done" : ""}`}
                        onClick={() => toggleProgressChecklist(i)}
                        aria-label={done ? "mark undone" : "mark done"}
                      >
                        {done ? "✔" : i + 1}
                      </button>
                      <div className="text">{sg || `Subgoal ${i + 1}`}</div>
                    </div>
                  );
                })}
              </div>

              <div className="progress-footer">
                <div className="dates">
                  <small>Start: {roadmap.startDate || "—"}</small>
                  <small>End: {roadmap.endDate || "—"}</small>
                </div>

                <button className="close-scroll" onClick={handleCloseProgress}>
                  Close Scroll
                </button>
              </div>
            </div>

            <div className="scroll-rod bottom" aria-hidden="true"></div>
          </div>
        </div>
      )}
    </div>
  );
}
{/* Progress Scroll Modal */}
{showProgress && (
  <div className="scroll-overlay">
    <div className="scroll-wrapper unfold-animation">   {/* 👈 yaha class add ki */}
      <div className="scroll-rod top"></div>

      <div className="scroll-content">
        <h2>📜 Progress of {selectedGoal?.title}</h2>
        <p>
          {completed} / {total} tasks done ({percent}%)
        </p>

        <div className="ink-progress">
          <div className="ink-fill" style={{ width: `${percent}%` }}></div>
        </div>

        {roadmap.subgoals.map((sg, i) => (
          <p key={i}>
            {roadmap.checklist[i] ? "✔️" : "⭕"} {sg || `Subgoal ${i + 1}`}
          </p>
        ))}

        <button
          className="close-scroll"
          onClick={() => setShowProgress(false)}
        >
          Close
        </button>
      </div>

      <div className="scroll-rod bottom"></div>
    </div>
  </div>
)}


export default GoalsPage;


