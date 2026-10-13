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
};

export default function TaskList({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [skill, setSkill] = useState<Skill | "">("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Row level security in Supabase returns only this user's rows.
    getSupabase()
      .from("tasks")
      .select("id, text, skill, done")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setTasks((data ?? []) as Task[]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !skill) return;

    setBusy(true);
    setError(null);
    const { data, error } = await getSupabase()
      .from("tasks")
      .insert({ text: trimmed, skill, user_id: userId })
      .select("id, text, skill, done")
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

  return (
    <section className="tasks">
      <h2>Your tasks</h2>

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
        <button type="submit" disabled={busy}>
          Add
        </button>
      </form>

      {error && <p className="form-error" role="alert">{error}</p>}

      {loading ? (
        <p className="muted">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="muted">No tasks yet. Add your first one above.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
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
