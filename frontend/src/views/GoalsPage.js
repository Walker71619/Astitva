import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { auth, firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Bg4 from "../images/bg-4.png";
import patr from "../images/patr.jpg";
import "./GoalsPage.css";

function GoalsPage() {
  const location = useLocation();
  const { lifeModeId, lifeModeTitle } = location.state || {}; // passed from LifeModeSelector

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const uid = auth.currentUser?.uid;

  // Fetch goals from Firestore for the specific LifeMode
  useEffect(() => {
    const fetchGoals = async () => {
      if (!uid || !lifeModeId) return;
      setLoading(true);
      try {
        const docRef = doc(firestore, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const lmGoals = data.lifeModes?.[lifeModeId]?.goals || [];
          // convert string goals to objects with id
          const formattedGoals = lmGoals.map((g, idx) => ({ id: idx + 1, title: g }));
          setGoals(formattedGoals);
        } else {
          setGoals([]);
        }
      } catch (err) {
        console.error("Error fetching goals:", err);
        setGoals([]);
      }
      setLoading(false);
    };
    fetchGoals();
  }, [uid, lifeModeId]);

  // --- Modal & Roadmap Functions ---
  const handleOpenModal = (goal) => {
    setSelectedGoal(goal);
    if (goal.roadmap) {
      setRoadmap({
        title: goal.roadmap.title || "",
        startDate: goal.roadmap.startDate || "",
        endDate: goal.roadmap.endDate || "",
        subgoals: goal.roadmap.subgoals || [""],
        checklist: goal.roadmap.checklist || Array.from({ length: (goal.roadmap.subgoals || []).length }, () => false),
      });
    } else {
      setRoadmap({ title: "", startDate: "", endDate: "", subgoals: [""], checklist: [] });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGoal(null);
    setRoadmap({ title: "", startDate: "", endDate: "", subgoals: [""], checklist: [] });
  };

  const handleSaveRoadmap = async () => {
    if (!selectedGoal) return;
    const updatedGoals = goals.map((g) =>
      g.id === selectedGoal.id ? { ...g, roadmap: { ...roadmap } } : g
    );
    setGoals(updatedGoals);

    // Save roadmap in Firestore under the same LifeMode
    try {
      const docRef = doc(firestore, "users", uid);
      const roadmapKey = `lifeModes.${lifeModeId}.roadmaps.${selectedGoal.id}`;
      await setDoc(
        docRef,
        {
          lifeModes: {
            [lifeModeId]: {
              roadmaps: {
                [selectedGoal.id]: roadmap
              }
            }
          }
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving roadmap:", err);
    }

    setShowModal(false);
  };

  const handleAddSubgoal = () => {
    setRoadmap((prev) => ({
      ...prev,
      subgoals: [...prev.subgoals, ""],
      checklist: [...(prev.checklist || []), false],
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

  const handleOpenProgress = (goal) => {
    setSelectedGoal(goal);
    setShowProgress(true);
    if (goal.roadmap) {
      setRoadmap(goal.roadmap);
    } else {
      setRoadmap({ title: "", startDate: "", endDate: "", subgoals: [""], checklist: [] });
    }
  };

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
      setSelectedGoal(updatedGoals.find((g) => g.id === selectedGoal.id));
    }
  };

  const computeCompleted = (rm) => rm?.checklist?.filter(Boolean).length || 0;
  const computeTotal = (rm) => Math.max(rm?.subgoals?.length || 1, 1);

  const handleCloseProgress = () => {
    if (selectedGoal) {
      const updatedGoals = goals.map((g) =>
        g.id === selectedGoal.id ? { ...g, roadmap: { ...roadmap } } : g
      );
      setGoals(updatedGoals);
    }
    setShowProgress(false);
    setSelectedGoal(null);
    setRoadmap({ title: "", startDate: "", endDate: "", subgoals: [""], checklist: [] });
  };

  return (
    <div className="goals-page" style={{ backgroundImage: `url(${Bg4})` }}>
      <h1 className="page-title">{lifeModeTitle || "My Goals"}</h1>

      {loading ? (
        <p>Loading goals...</p>
      ) : (
        <div className="goals-container">
          {goals.map((goal) => (
            <div key={goal.id} className="goal-card">
              <h2>{goal.title}</h2>
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
      )}

      {/* --- Roadmap Form Modal --- */}
      {showModal && selectedGoal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Roadmap for: {selectedGoal.title}</h2>
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

      {/* --- Progress Modal --- */}
      {showProgress && selectedGoal && (
        <div className="scroll-overlay">
          <div className="scroll-wrapper" style={{ backgroundImage: `url(${patr})` }}>
            <div className="scroll-rod top" aria-hidden="true"></div>

            <div className="scroll-content">
              <h2>📜 Progress — {selectedGoal.title}</h2>
              <div className="big-percent">
                {Math.round((computeCompleted(roadmap) / computeTotal(roadmap)) * 100) || 0}%
              </div>
              <p className="progress-summary">
                {computeCompleted(roadmap)} of {computeTotal(roadmap)} completed
              </p>

              <div className="ink-progress">
                <div
                  className="ink-fill"
                  style={{ width: `${(computeCompleted(roadmap) / computeTotal(roadmap)) * 100}%` }}
                />
              </div>

              <div className="subgoals-list">
                {roadmap.subgoals.map((sg, i) => {
                  const done = roadmap.checklist[i] || false;
                  return (
                    <div key={i} className={`subgoal-row ${done ? "done" : ""}`}>
                      <button
                        className={`bullet ${done ? "bullet-done" : ""}`}
                        onClick={() => toggleProgressChecklist(i)}
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

export default GoalsPage;
