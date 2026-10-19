import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

async function apiRequest(path, token, options = {}) {
    const headers = { ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (options.body) headers["Content-Type"] = "application/json";

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const fieldErrors = data.errors ? Object.values(data.errors).join(". ") : "";
        const error = new Error(fieldErrors ? `${data.message}: ${fieldErrors}` : data.message || "The request failed");
        error.status = response.status;
        throw error;
    }
    return data;
}

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [authMode, setAuthMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(() => localStorage.getItem("task-manager-token"));
    const [user, setUser] = useState(null);
    const [sessionChecking, setSessionChecking] = useState(Boolean(localStorage.getItem("task-manager-token")));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            return undefined;
        }

        let cancelled = false;
        const restoreSession = async () => {
            setSessionChecking(true);
            try {
                const session = await apiRequest("/me", token);
                const taskList = await apiRequest("/tasks", token);
                if (!cancelled) {
                    setUser(session.user);
                    setTasks(taskList);
                }
            } catch (requestError) {
                if (!cancelled) {
                    setError(requestError.message);
                    setToken(null);
                    setUser(null);
                    setTasks([]);
                    localStorage.removeItem("task-manager-token");
                }
            } finally {
                if (!cancelled) setSessionChecking(false);
            }
        };

        restoreSession();
        return () => { cancelled = true; };
    }, [token]);

    const submitAuth = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        const registering = authMode === "register";
        const payload = registering ? { name, email, password } : { email, password };
        try {
            const result = await apiRequest(
                registering ? "/auth/register" : "/auth/login",
                null,
                { method: "POST", body: JSON.stringify(payload) }
            );

            if (registering) {
                setAuthMode("login");
                setPassword("");
                setMessage("Account created. Please log in.");
            } else {
                localStorage.setItem("task-manager-token", result.token);
                setToken(result.token);
                setUser(result.user);
                setTasks([]);
                setPassword("");
            }
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("task-manager-token");
        setToken(null);
        setUser(null);
        setTasks([]);
        setPassword("");
        setError("");
        setMessage("You have logged out.");
    };

    const handleProtectedError = (requestError) => {
        if (requestError.status === 401) {
            localStorage.removeItem("task-manager-token");
            setToken(null);
            setUser(null);
            setTasks([]);
            setError("Your session expired. Please log in again.");
        } else {
            setError(requestError.message);
        }
    };

    const addTask = async (event) => {
        event.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const result = await apiRequest("/tasks", token, {
                method: "POST",
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    completed: false
                })
            });
            setTasks((previous) => [...previous, result.task]);
            setTitle("");
            setDescription("");
            setMessage("Task created successfully");
        } catch (requestError) {
            handleProtectedError(requestError);
        } finally {
            setLoading(false);
        }
    };

    // PUT
    const updateTask = async (task) => {
        const newTitle = window.prompt(
            "Enter new task title:",
            task.title
        );

        if (!newTitle || !newTitle.trim()) {
            return;
        }

        const newDescription = window.prompt(
            "Enter new description:",
            task.description || ""
        );

        try {
            setLoading(true);
            setError("");
            const result = await apiRequest(`/tasks/${task._id}`, token, {
                method: "PUT",
                body: JSON.stringify({
                    title: newTitle.trim(),
                    description: (newDescription || "").trim(),
                    completed: task.completed
                })
            });
            setTasks((prevTasks) =>
                prevTasks.map((item) =>
                    item._id === task._id
                        ? result.task
                        : item
                )
            );
            setMessage("Task updated successfully");
        } catch (requestError) {
            handleProtectedError(requestError);
        } finally {
            setLoading(false);
        }
    };

    // DELETE
    const deleteTask = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            await apiRequest(`/tasks/${id}`, token, { method: "DELETE" });
            setTasks((prevTasks) =>
                prevTasks.filter(
                    (task) => task._id !== id
                )
            );
            setMessage("Task deleted successfully");
        } catch (requestError) {
            handleProtectedError(requestError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="app-shell">
            <header className="topbar">
                <a className="wordmark" href="#tasks">TASK / MANAGER</a>
                {user && (
                    <div className="account-tools">
                        <span>{user.name}</span>
                        <button className="quiet-button" type="button" onClick={logout}>Log out</button>
                    </div>
                )}
            </header>

            {error && <p className="notice error" role="alert">{error}</p>}
            {message && <p className="notice success" role="status">{message}</p>}

            {sessionChecking ? (
                <section className="loading-panel" aria-live="polite">Checking your session...</section>
            ) : !user ? (
                <section className="auth-layout">
                    <div className="auth-intro">
                        <p className="eyebrow">PRACTICAL 7 / SECURE ACCESS</p>
                        <h1>Make room<br />for what matters.</h1>
                        <p className="intro-copy">Your tasks, organized in one private workspace.</p>
                        <div className="security-note"><span className="security-mark">01</span><span>Protected with verified sign-in</span></div>
                    </div>
                    <div className="auth-panel">
                        <div className="auth-heading">
                            <p className="eyebrow">ACCOUNT</p>
                            <h2>{authMode === "login" ? "Welcome back" : "Create account"}</h2>
                        </div>
                        <div className="mode-switch" role="tablist" aria-label="Account action">
                            <button type="button" role="tab" aria-selected={authMode === "login"} className={authMode === "login" ? "active" : ""} onClick={() => { setAuthMode("login"); setError(""); setMessage(""); }}>Log in</button>
                            <button type="button" role="tab" aria-selected={authMode === "register"} className={authMode === "register" ? "active" : ""} onClick={() => { setAuthMode("register"); setError(""); setMessage(""); }}>Register</button>
                        </div>
                        <form className="auth-form" onSubmit={submitAuth}>
                            {authMode === "register" && (
                                <label>Name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} /></label>
                            )}
                            <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
                            <label>Password<input type="password" autoComplete={authMode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={authMode === "register" ? 8 : 1} /></label>
                            <button className="primary-button" type="submit" disabled={loading}>
                                {loading ? "Please wait..." : authMode === "login" ? "Log in" : "Create account"}
                            </button>
                        </form>
                    </div>
                </section>
            ) : (
                <section className="task-workspace" id="tasks">
                    <div className="workspace-heading">
                        <div>
                            <p className="eyebrow">YOUR WORKSPACE</p>
                            <h1>Tasks in focus</h1>
                        </div>
                        <p className="task-count">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</p>
                    </div>
                    <form className="task-form" onSubmit={addTask}>
                        <label>Task title<input type="text" placeholder="What needs doing?" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} required /></label>
                        <label>Description<input type="text" placeholder="Add a useful detail" value={description} onChange={(event) => setDescription(event.target.value)} /></label>
                        <button className="primary-button" type="submit" disabled={loading}>Add task</button>
                    </form>
                    <div className="task-list-heading"><h2>All tasks</h2><span>Private to your account</span></div>
                    {loading && <p className="loading-copy">Updating your workspace...</p>}
                    {tasks.length === 0 && !loading && <p className="empty-state">Nothing here yet. Add your first task above.</p>}
                    <div className="task-list">
                        {tasks.map((task) => (
                            <article className="task-row" key={task._id}>
                                <div className="task-copy">
                                    <h3>{task.title}</h3>
                                    <p>{task.description || "No description"}</p>
                                </div>
                                <span className={`task-status ${task.completed ? "completed" : "pending"}`}>
                                    {task.completed ? "Completed" : "Pending"}
                                </span>
                                <div className="task-buttons">
                                    <button className="quiet-button" type="button" onClick={() => updateTask(task)}>Edit</button>
                                    <button className="delete-button" type="button" onClick={() => deleteTask(task._id)}>Delete</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

export default App;
