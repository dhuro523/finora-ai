
import sqlite3
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/goals", tags=["Savings Goals"])

DB_PATH = Path(__file__).with_name("finora.db")


def get_connection():
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS savings_goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                target_amount REAL NOT NULL CHECK (target_amount > 0),
                current_amount REAL NOT NULL DEFAULT 0
                    CHECK (current_amount >= 0),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


initialize_database()


class GoalCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    target_amount: float = Field(gt=0, le=1_000_000_000_000)
    current_amount: float = Field(
        default=0, ge=0, le=1_000_000_000_000
    )


class GoalUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    target_amount: Optional[float] = Field(
        default=None, gt=0, le=1_000_000_000_000
    )
    current_amount: Optional[float] = Field(
        default=None, ge=0, le=1_000_000_000_000
    )


def serialize_goal(row):
    goal = dict(row)
    goal["progress_percent"] = round(
        min(goal["current_amount"] / goal["target_amount"] * 100, 100),
        1,
    )
    goal["remaining_amount"] = round(
        max(goal["target_amount"] - goal["current_amount"], 0), 2
    )
    return goal


@router.get("")
def list_goals():
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM savings_goals ORDER BY id DESC"
        ).fetchall()

    return {"goals": [serialize_goal(row) for row in rows]}


@router.post("", status_code=201)
def create_goal(goal: GoalCreate):
    name = goal.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Goal name cannot be empty.")

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO savings_goals (name, target_amount, current_amount)
            VALUES (?, ?, ?)
            """,
            (name, goal.target_amount, goal.current_amount),
        )
        row = connection.execute(
            "SELECT * FROM savings_goals WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()

    return serialize_goal(row)


@router.patch("/{goal_id}")
def update_goal(goal_id: int, updates: GoalUpdate):
    changes = updates.model_dump(exclude_unset=True)
    changes = {key: value for key, value in changes.items() if value is not None}

    if "name" in changes:
        changes["name"] = changes["name"].strip()
        if not changes["name"]:
            raise HTTPException(
                status_code=422, detail="Goal name cannot be empty."
            )

    if not changes:
        raise HTTPException(
            status_code=400, detail="Provide at least one field to update."
        )

    with get_connection() as connection:
        existing = connection.execute(
            "SELECT id FROM savings_goals WHERE id = ?", (goal_id,)
        ).fetchone()

        if existing is None:
            raise HTTPException(status_code=404, detail="Savings goal not found.")

        assignments = ", ".join(f"{field} = ?" for field in changes)
        values = list(changes.values()) + [goal_id]
        connection.execute(
            f"UPDATE savings_goals SET {assignments} WHERE id = ?", values
        )

        row = connection.execute(
            "SELECT * FROM savings_goals WHERE id = ?", (goal_id,)
        ).fetchone()

    return serialize_goal(row)


@router.delete("/{goal_id}")
def delete_goal(goal_id: int):
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM savings_goals WHERE id = ?", (goal_id,)
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Savings goal not found.")

    return {"message": "Savings goal deleted", "id": goal_id}
