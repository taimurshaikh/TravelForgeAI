import sqlite3
import json


def init_db():
    conn = sqlite3.connect("tasks.db")
    c = conn.cursor()
    c.execute(
        """CREATE TABLE IF NOT EXISTS tasks
                 (id TEXT PRIMARY KEY, state TEXT, result TEXT)"""
    )
    conn.commit()
    conn.close()


def store_task(task_id, state, result=None):
    conn = sqlite3.connect("tasks.db")
    c = conn.cursor()
    c.execute(
        "INSERT OR REPLACE INTO tasks VALUES (?, ?, ?)",
        (task_id, state, json.dumps(result) if result else None),
    )
    conn.commit()
    conn.close()


def get_task(task_id):
    conn = sqlite3.connect("tasks.db")
    c = conn.cursor()
    c.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    task = c.fetchone()
    conn.close()
    if task:
        return {
            "id": task[0],
            "state": task[1],
            "result": json.loads(task[2]) if task[2] else None,
        }
    return None
