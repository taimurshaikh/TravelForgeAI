"""
This module contains the database functions to store and retrieve tasks.
"""

import sqlite3
import json


def init_db():
    """
    Initializes the database by creating the tasks table if it doesn't exist.
    """
    conn = sqlite3.connect("tasks.db")
    c = conn.cursor()
    c.execute(
        """CREATE TABLE IF NOT EXISTS tasks
           (id TEXT PRIMARY KEY, state TEXT, result TEXT)"""
    )
    conn.commit()
    conn.close()


def store_task(task_id: str, state: str, result: dict = None):
    """
    Stores a task in the database.

    Args:
        task_id (str): The unique identifier for the task.
        state (str): The current state of the task.
        result (dict, optional): The result of the task. Defaults to None.
    """
    conn = sqlite3.connect("tasks.db")
    c = conn.cursor()
    c.execute(
        "INSERT OR REPLACE INTO tasks VALUES (?, ?, ?)",
        (task_id, state, json.dumps(result) if result else None),
    )
    conn.commit()
    conn.close()


def get_task(task_id: str) -> dict:
    """
    Retrieves a task from the database.

    Args:
        task_id (str): The unique identifier for the task.

    Returns:
        dict: The task details, or None if the task is not found.
    """
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


def drop_db():
    """
    Drops the tasks table from the database.
    """
    conn = sqlite3.connect("tasks.db")
    c = conn.cursor()
    c.execute("DROP TABLE tasks")
    conn.commit()
    conn.close()
