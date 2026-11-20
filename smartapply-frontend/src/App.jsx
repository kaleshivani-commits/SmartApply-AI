
import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API_URL = "http://localhost:8080/api/applications";
const AI_API_URL = "http://localhost:8080/api/analyzer/analyze";
const INTERVIEW_API_URL =
  "http://localhost:8080/api/analyzer/interview-questions";

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // AI Job Analyzer state
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // AI Interview Questions state
  const [interviewTopic, setInterviewTopic] = useState("Core Java");
  const [customTopic, setCustomTopic] = useState("");
  const [interviewResult, setInterviewResult] = useState(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [interviewError, setInterviewError] = useState("");

  // Practice Mode state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    location: "",
    status: "APPLIED",
    jobDescription: "",
    notes: "",
  });

  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      const response = await axios.get(API_URL);
      setApplications(response.data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not load applications. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle form changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      companyName: "",
      jobTitle: "",
      location: "",
      status: "APPLIED",
      jobDescription: "",
      notes: "",
    });

    setEditingId(null);
  };

  // Add or update application
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setMessage("Application updated successfully!");
      } else {
        await axios.post(API_URL, formData);
        setMessage("Application added successfully!");
      }

      resetForm();
      await fetchApplications();
    } catch (err) {
      console.error("Save error:", err);
      setError("Could not save application.");
    }
  };

  // Edit application
  const handleEdit = (application) => {
    setEditingId(application.id);

    setFormData({
      companyName: application.companyName || "",
      jobTitle: application.jobTitle || "",
      location: application.location || "",
      status: application.status || "APPLIED",
      jobDescription: application.jobDescription || "",
      notes: application.notes || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete application
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await axios.delete(`${API_URL}/${id}`);

      setMessage("Application deleted successfully!");

      if (editingId === id) {
        resetForm();
      }

      await fetchApplications();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Could not delete application.");
    }
  };

  // Search by company, job title or location
  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.trim().toLowerCase();

    const company = String(
      application.companyName || ""
    ).toLowerCase();

    const jobTitle = String(
      application.jobTitle || ""
    ).toLowerCase();

    const location = String(
      application.location || ""
    ).toLowerCase();

    const matchesSearch =
      company.includes(search) ||
      jobTitle.includes(search) ||
      location.includes(search);

    const applicationStatus = String(
      application.status || ""
    ).toUpperCase();

    const matchesStatus =
      statusFilter === "ALL" ||
      applicationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Dashboard statistics
  const totalApplications = applications.length;

  const interviewCount = applications.filter(
    (app) =>
      String(app.status || "").toUpperCase() === "INTERVIEW"
  ).length;

  const appliedCount = applications.filter(
    (app) =>
      String(app.status || "").toUpperCase() === "APPLIED"
  ).length;

  const rejectedCount = applications.filter(
    (app) =>
      String(app.status || "").toUpperCase() === "REJECTED"
  ).length;

  const offerCount = applications.filter(
    (app) =>
      String(app.status || "").toUpperCase() === "OFFER"
  ).length;

  // Clear search and filter
  const clearSearch = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
  };

  // AI Job Analyzer
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description first.");
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisError("");
      setAnalysisResult("");

      const response = await axios.post(AI_API_URL, {
        jobDescription: jobDescription,
      });

      setAnalysisResult(response.data.analysis);

    } catch (err) {
      console.error("AI Analysis Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "AI analysis failed. Please check your backend and API configuration.";

      setAnalysisError(errorMessage);

    } finally {
      setAnalyzing(false);
    }
  };

  // AI Interview Questions Generator
  const handleGenerateQuestions = async () => {
    const topic =
      interviewTopic === "Custom Topic"
        ? customTopic.trim()
        : interviewTopic;

    if (!topic) {
      setInterviewError("Please enter a topic first.");
      return;
    }

    try {
      setGeneratingQuestions(true);
      setInterviewError("");
      setInterviewResult(null);
      setCurrentQuestionIndex(0);
      setShowAnswer(false);

      const response = await axios.post(INTERVIEW_API_URL, {
        topic: topic,
      });

      const data = response.data;

      if (
        !data ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error("No valid interview questions were returned.");
      }

      setInterviewResult(data);

    } catch (err) {
      console.error("Interview Questions Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Could not generate interview questions. Please check your backend and API configuration.";

      setInterviewError(errorMessage);

    } finally {
      setGeneratingQuestions(false);
    }
  };

  // Show next question
  const handleNextQuestion = () => {
    if (
      interviewResult &&
      currentQuestionIndex < interviewResult.questions.length - 1
    ) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
      setShowAnswer(false);
    }
  };

  // Show previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((previousIndex) => previousIndex - 1);
      setShowAnswer(false);
    }
  };

  // Restart practice
  const handleRestartPractice = () => {
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
  };

  const questions = interviewResult?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const completedQuestions = showAnswer
    ? currentQuestionIndex + 1
    : currentQuestionIndex;

  const progressPercentage =
    totalQuestions > 0
      ? (completedQuestions / totalQuestions) * 100
      : 0;

  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">SmartApply AI</h2>

        <nav>
          <a href="#dashboard" className="nav-link active">
            Dashboard
          </a>

          <a href="#applications" className="nav-link">
            My Applications
          </a>

          <a href="#analyzer" className="nav-link">
            AI Job Analyzer
          </a>

          <a href="#interview" className="nav-link">
            Interview Questions
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">

        <header className="top-header">
          <h1>Dashboard</h1>
          <p>Track and manage your job applications.</p>
        </header>

        {/* Dashboard cards */}
        <section className="stats-container" id="dashboard">

          <div className="stat-card">
            <h3>Total Applications</h3>
            <p>{totalApplications}</p>
          </div>

          <div className="stat-card">
            <h3>Interviews</h3>
            <p>{interviewCount}</p>
          </div>

          <div className="stat-card">
            <h3>Applied</h3>
            <p>{appliedCount}</p>
          </div>

          <div className="stat-card">
            <h3>Rejected</h3>
            <p>{rejectedCount}</p>
          </div>

          <div className="stat-card">
            <h3>Offers</h3>
            <p>{offerCount}</p>
          </div>

        </section>

        {/* Add or Edit Application */}
        <section className="form-section">

          <h2>
            {editingId !== null
              ? "Edit Application"
              : "Add New Application"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>Company Name</label>

                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Title</label>

                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Enter job title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="OFFER">Offer</option>
                </select>
              </div>

            </div>

            <div className="form-group">
              <label>Job Description</label>

              <textarea
                name="jobDescription"
                placeholder="Enter job description"
                value={formData.jobDescription}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>

              <textarea
                name="notes"
                placeholder="Add your notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
              />
            </div>

            <div className="form-buttons">

              <button type="submit" className="primary-button">
                {editingId !== null
                  ? "Update Application"
                  : "Add Application"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

          {message && (
            <p className="success-message">{message}</p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

        </section>

        {/* My Applications */}
        <section
          className="applications-section"
          id="applications"
        >

          <div className="section-heading">

            <div>
              <h2>Recent Applications</h2>
              <p>Search and manage your saved job applications.</p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={fetchApplications}
            >
              Refresh
            </button>

          </div>

          {/* Search and Filter */}
          <div className="search-filter">

            <div className="form-group search-box">
              <label>Search Applications</label>

              <input
                type="text"
                placeholder="Search company, job title or location..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <div className="form-group filter-box">
              <label>Filter by Status</label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="ALL">All Statuses</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="REJECTED">Rejected</option>
                <option value="OFFER">Offer</option>
              </select>
            </div>

            <button
              type="button"
              className="clear-button"
              onClick={clearSearch}
            >
              Clear Search
            </button>

          </div>

          <p className="result-count">
            Showing <strong>{filteredApplications.length}</strong> of{" "}
            <strong>{applications.length}</strong> applications
          </p>

          {loading ? (
            <p className="info-message">
              Loading applications...
            </p>
          ) : filteredApplications.length === 0 ? (
            <p className="info-message">
              No applications found. Try another search or clear the filter.
            </p>
          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company</th>
                    <th>Job Title</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((application) => (

                    <tr key={application.id}>

                      <td>{application.id}</td>
                      <td>{application.companyName}</td>
                      <td>{application.jobTitle}</td>
                      <td>{application.location || "-"}</td>

                      <td>
                        <span
                          className={`status-badge ${String(
                            application.status || ""
                          ).toLowerCase()}`}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              handleEdit(application)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(application.id)
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* AI Job Analyzer */}
        <section
          className="analyzer-section"
          id="analyzer"
        >

          <div className="analyzer-heading">
            <h2>AI Job Analyzer</h2>
            <p>
              Turn job descriptions into actionable career insights
              with AI-powered skill analysis and interview preparation.
            </p>
          </div>

          <div className="analyzer-input">

            <label htmlFor="jobDescription">
              Add Job Description
            </label>

            <textarea
              id="jobDescription"
              placeholder=" Write here....."
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setAnalysisResult("");
                setAnalysisError("");
              }}
              rows="8"
            />

          </div>

          <button
            type="button"
            className="primary-button analyze-button"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing
              ? "Analyzing..."
              : "Analyze Job Description"}
          </button>

          <div className="analyzer-placeholder">

            <h3>Analysis Results</h3>

            {analyzing && (
              <p className="info-message">
                AI is analyzing your job description. Please wait...
              </p>
            )}

            {analysisError && (
              <p className="error-message">
                {analysisError}
              </p>
            )}

            {analysisResult && (
              <div className="analysis-result">
                <ReactMarkdown>
                  {analysisResult.replace(/\\([*_`])/g, "$1")}
                </ReactMarkdown>
              </div>
            )}

            {!analyzing && !analysisError && !analysisResult && (
              <p>
                Your required technical skills, important keywords
                and skill-match analysis will appear here.
              </p>
            )}

          </div>

        </section>

        {/* AI Interview Questions and Practice Mode */}
        <section
          className="analyzer-section"
          id="interview"
        >

          <div className="analyzer-heading">
            <h2>AI Interview Practice Mode</h2>

            <p>
              Prepare for your next software developer interview
              with AI-generated questions and answers.
            </p>
          </div>

          <div className="analyzer-input">

            <label htmlFor="interviewTopic">
              Select Interview Topic
            </label>

            <select
              id="interviewTopic"
              value={interviewTopic}
              onChange={(event) => {
                setInterviewTopic(event.target.value);
                setInterviewResult(null);
                setInterviewError("");
                setCurrentQuestionIndex(0);
                setShowAnswer(false);
              }}
            >
              <option value="Core Java">Core Java</option>

              <option value="Object Oriented Programming (OOP)">
                OOP Concepts
              </option>

              <option value="Java 8 Features and Java 17">
                Java 8 and Java 17
              </option>

              <option value="Spring Boot">
                Spring Boot
              </option>

              <option value="SQL and MySQL">
                SQL and MySQL
              </option>

              <option value="React.js">
                React.js
              </option>

              <option value="Custom Topic">
                Custom Topic
              </option>
            </select>

            {interviewTopic === "Custom Topic" && (
              <input
                type="text"
                placeholder="Enter your interview topic"
                value={customTopic}
                onChange={(event) => {
                  setCustomTopic(event.target.value);
                  setInterviewResult(null);
                  setInterviewError("");
                }}
              />
            )}

          </div>

          <button
            type="button"
            className="primary-button analyze-button"
            onClick={handleGenerateQuestions}
            disabled={generatingQuestions}
          >
            {generatingQuestions
              ? "Generating Questions..."
              : "Generate Interview Questions"}
          </button>

          {generatingQuestions && (
            <p className="info-message">
              Gemini AI is preparing your interview questions. Please wait...
            </p>
          )}

          {interviewError && (
            <p className="error-message">
              {interviewError}
            </p>
          )}

          {/* Practice Mode */}
          {interviewResult && currentQuestion && (
            <div className="analyzer-placeholder practice-container">

              <h3>
                {interviewResult.topic || "Interview Practice"}
              </h3>

              {/* Progress */}
              <div className="practice-progress">

                <div className="progress-info">
                  <span>
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>

                  <span>
                    {Math.round(progressPercentage)}% completed
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

              </div>

              {/* Question */}
              <div className="practice-question">

                <h3>
                  Question {currentQuestionIndex + 1}
                </h3>

                <h2>{currentQuestion.question}</h2>

              </div>

              {/* Reveal Answer */}
              {!showAnswer ? (

                <div className="practice-reveal">
                  <p>
                    Think about your answer before revealing the solution.
                  </p>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setShowAnswer(true)}
                  >
                    Show Answer
                  </button>
                </div>

              ) : (

                <div className="practice-answer">

                  <h3>Suggested Answer</h3>

                  <ReactMarkdown>
                    {currentQuestion.answer || "No answer provided."}
                  </ReactMarkdown>

                  {currentQuestion.example && (
                    <>
                      <h3>Practical Example</h3>

                      <ReactMarkdown>
                        {currentQuestion.example}
                      </ReactMarkdown>
                    </>
                  )}

                  {currentQuestion.followUp && (
                    <>
                      <h3>Follow-up Question</h3>

                      <p>{currentQuestion.followUp}</p>
                    </>
                  )}

                </div>

              )}

              {/* Navigation */}
              <div className="practice-navigation">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous Question
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (

                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleNextQuestion}
                    disabled={!showAnswer}
                  >
                    Next Question
                  </button>

                ) : (

                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleRestartPractice}
                    disabled={!showAnswer}
                  >
                    Restart Practice
                  </button>

                )}

              </div>

              {/* Completion message */}
              {currentQuestionIndex === totalQuestions - 1 &&
                showAnswer && (
                  <div className="success-message">
                    <h3>Congratulations! 🎉</h3>
                    <p>
                      You have completed all {totalQuestions} interview
                      questions. Keep practising to improve your confidence!
                    </p>
                  </div>
                )}

              <p className="practice-completed">
                Questions completed: {completedQuestions} / {totalQuestions}
              </p>

            </div>
          )}

          {!generatingQuestions &&
            !interviewError &&
            !interviewResult && (
              <div className="analyzer-placeholder">
                <h3>Interview Preparation</h3>

                <p>
                  Select a topic and click Generate Interview Questions.
                  You can then practise one question at a time and reveal
                  the suggested answer when you are ready.
                </p>
              </div>
            )}

        </section>

      </main>
    </div>
  );
}

export default App;















