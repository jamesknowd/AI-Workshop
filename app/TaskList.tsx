"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getSupabase } from "./lib/supabase";

const SKILLS = [
  "Reading",
  "Writing",
  "Listening",
  "Speaking",
  "Vocabulary",
  "Grammar",
] as const;

type Skill = (typeof SKILLS)[number];

type Task = {
  id: string;
  text: string;
  skill: Skill;
  done: boolean;
  list_id: string;
};

type List = {
  id: string;
  name: string;
};

const TASK_COLUMNS = "id, text, skill, done, list_id";

export default function TaskList({ userId }: { userId: string }) {
  const [lists, setLists] = useState<List[]>([]);
  const [currentListId, setCurrentListId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [skill, setSkill] = useState<Skill | "">("");
  const [taskListId, setTaskListId] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [listName, setListName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabase();

    // Row level security in Supabase returns only this user's rows.
    Promise.all([
      supabase
        .from("lists")
        .select("id, name")
        .order("created_at", { ascending: true }),
      supabase
        .from("tasks")
        .select(TASK_COLUMNS)
        .order("created_at", { ascending: true }),
    ]).then(([listsResult, tasksResult]) => {
      if (cancelled) return;
      const loadError = listsResult.error ?? tasksResult.error;
      if (loadError) {
        setError(loadError.message);
      } else {
        const loadedLists = (listsResult.data ?? []) as List[];
        setLists(loadedLists);
        setTasks((tasksResult.data ?? []) as Task[]);
        if (loadedLists.length > 0) {
          setCurrentListId(loadedLists[0].id);
          setTaskListId(loadedLists[0].id);
        }
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  function showList(id: string) {
    setCurrentListId(id);
    setTaskListId(id);
  }

  async function handleCreateList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = listName.trim();
    if (!trimmed) return;

    setBusy(true);
    setError(null);
    const { data, error } = await getSupabase()
      .from("lists")
      .insert({ name: trimmed, user_id: userId })
      .select("id, name")
      .single();

    if (error) {
      setError(error.message);
    } else {
      const created = data as List;
      setLists((current) => [...current, created]);
      showList(created.id);
      setListName("");
      setCreatingList(false);
    }
    setBusy(false);
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !skill || !taskListId) return;

    setBusy(true);
    setError(null);
    const { data, error } = await getSupabase()
      .from("tasks")
      .insert({ text: trimmed, skill, list_id: taskListId, user_id: userId })
      .select(TASK_COLUMNS)
      .single();

    if (error) {
      setError(error.message);
    } else {
      setTasks((current) => [...current, data as Task]);
      setText("");
      setSkill("");
    }
    setBusy(false);
  }

  async function toggleDone(task: Task) {
    const done = !task.done;
    setError(null);
    setTasks((current) =>
      current.map((t) => (t.id === task.id ? { ...t, done } : t)),
    );

    const { error } = await getSupabase()
      .from("tasks")
      .update({ done })
      .eq("id", task.id);

    if (error) {
      setError(error.message);
      // Put the checkbox back so the screen matches what was saved.
      setTasks((current) =>
        current.map((t) => (t.id === task.id ? { ...t, done: task.done } : t)),
      );
    }
  }

  const visibleTasks = tasks.filter((t) => t.list_id === currentListId);

  return (
    <section className="tasks">
      <h2>Your tasks</h2>

      {!loading && (
        <div className="list-bar">
          {lists.length > 0 && (
            <label>
              List
              <select
                value={currentListId}
                onChange={(e) => showList(e.target.value)}
              >
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {!creatingList && (
            <button type="button" onClick={() => setCreatingList(true)}>
              New list
            </button>
          )}
        </div>
      )}

      {creatingList && (
        <form className="task-form" onSubmit={handleCreateList}>
          <label>
            List name
            <input
              type="text"
              required
              maxLength={50}
              placeholder="Reading"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              autoFocus
            />
          </label>
          <button type="submit" disabled={busy}>
            Save
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setCreatingList(false);
              setListName("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {!loading && lists.length > 0 && (
        <form className="task-form" onSubmit={handleAdd}>
          <label>
            Task
            <input
              type="text"
              required
              maxLength={200}
              placeholder="Read one news article"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <label>
            Skill
            <select
              required
              value={skill}
              onChange={(e) => setSkill(e.target.value as Skill | "")}
            >
              <option value="" disabled>
                Choose a skill
              </option>
              {SKILLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Add to list
            <select
              required
              value={taskListId}
              onChange={(e) => setTaskListId(e.target.value)}
            >
              {lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={busy}>
            Add
          </button>
        </form>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}

      {loading ? (
        <p className="muted">Loading tasks…</p>
      ) : lists.length === 0 ? (
        <p className="muted">Click New list to make your first list.</p>
      ) : visibleTasks.length === 0 ? (
        <p className="muted">No tasks in this list yet. Add one above.</p>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li key={task.id} className={task.done ? "done" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task)}
                />
                <span className="task-text">{task.text}</span>
              </label>
              <span className="skill-tag">{task.skill}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
