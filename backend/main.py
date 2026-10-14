
import json
import os
from collections import defaultdict
from datetime import date
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import AsyncGroq
from groq import APIConnectionError, APIStatusError, RateLimitError
from pydantic import BaseModel, Field
from goals import router as goals_router

load_dotenv()

app = FastAPI(
    title="Finora AI API",
    description="Financial analysis and AI chat API for Finora AI",
    version="0.5.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(goals_router)

class Transaction(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=50)
    amount: float = Field(ge=-1_000_000_000, le=1_000_000_000)
    type: Literal["income", "expense"]
    date: date


class AnalysisRequest(BaseModel):
    transactions: list[Transaction] = Field(max_length=1000)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=12000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=40,
    )
    financial_context: dict = Field(default_factory=dict)


@app.get("/")
def root():
    return {
        "message": "Finora AI API is running",
        "status": "healthy",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/insights")
def financial_insights(request: AnalysisRequest):
    income = 0.0
    expenses = 0.0
    category_totals = defaultdict(float)

    for transaction in request.transactions:
        amount = abs(transaction.amount)

        if transaction.type == "income":
            income += amount
        else:
            expenses += amount
            category_totals[transaction.category] += amount

    net_savings = income - expenses
    savings_rate = (
        round((net_savings / income) * 100, 2)
        if income
        else 0
    )

    categories = [
        {"category": category, "amount": round(amount, 2)}
        for category, amount in sorted(
            category_totals.items(),
            key=lambda item: item[1],
            reverse=True,
        )
    ]

    largest_category = categories[0] if categories else None

    if income == 0 and expenses == 0:
        summary = "Add transactions to start analyzing your finances."
    elif income == 0:
        summary = (
            f"You recorded {expenses:.2f} in expenses but no income. "
            "Add income transactions for a fuller financial picture."
        )
    elif net_savings < 0:
        summary = (
            f"Your expenses exceed your income by {abs(net_savings):.2f}. "
            "Review your spending categories to identify potential reductions."
        )
    else:
        summary = (
            f"You have {net_savings:.2f} remaining after expenses, "
            f"saving {savings_rate:.1f}% of recorded income."
        )

    return {
        "currency": "USD",
        "transaction_count": len(request.transactions),
        "total_income": round(income, 2),
        "total_expenses": round(expenses, 2),
        "net_savings": round(net_savings, 2),
        "savings_rate": savings_rate,
        "largest_expense_category": largest_category,
        "spending_by_category": categories,
        "summary": summary,
        "data_source": "request_transactions",
    }


SYSTEM_PROMPT = """
You are Finora AI, a premium personal finance copilot.

Your job is to help users understand their finances, make informed
decisions, reduce expenses, and build savings. Be practical, natural,
accurate, and transparent.

## 1. Source of truth

Use the supplied dashboard context and available conversation history.

Treat dashboard values as reported figures, not automatically as
verified bank records. If the application identifies data as demo data,
make that clear when relevant.

Never invent:
- Income, rent, utility bills, debts, interest rates, or balances.
- The contents of a financial category.
- Personal circumstances or previous user statements.
- Local prices, market averages, or savings estimates.
- Details of a lease, insurance policy, or financial agreement.

A category named "Housing" does not necessarily mean rent. Do not assume
it contains only rent, or that utilities are included or excluded.

If a value is missing, say it is unknown. Do not fill the gap with a
plausible-sounding number.

## 2. Financial calculations

FINANCIAL CALCULATION AND FORMATTING RULES

- Verify every financial calculation before responding. Never guess or misstate a calculated result.
- Calculate percentages using the full-precision result, then round to the requested number of decimal places.
- For percentages rounded to one decimal place, 59.067% must be displayed as 59.1%.
- Show calculations using plain text or simple Markdown, for example:
  Expenses: $3,185.40 - $557.50 = $2,627.90
  Savings: $6,420.00 - $2,627.90 = $3,792.10
  Savings rate: ($3,792.10 / $6,420.00) x 100 = 59.1%
- Do not output raw LaTeX, mathematical delimiters, or malformed expressions containing semicolons.
- Do not use LaTeX commands such as \frac or \text. Use readable plain-text calculations instead.
- Ensure that every displayed percentage agrees with the calculation shown.


Calculate from known numbers only. Check arithmetic before responding.

For every important estimate:
- Show the relevant calculation.
- Identify the input figures used.
- State assumptions that materially affect the result.
- Distinguish a possible saving from a guaranteed saving.

Do not present an unsupported dollar range as a researched estimate.
When the available information cannot support a numerical estimate,
give practical qualitative advice instead.

You may provide a hypothetical example if the user requests one.
Clearly label it as hypothetical and state the assumed figures.

Never assume an entire spending category can be eliminated or reduced.

## 3. Savings calculations and overlapping options

Do not add savings estimates from multiple strategies unless the
savings are independent and do not count the same expense twice.

For example, moving to a cheaper apartment and negotiating lower rent
may be alternative strategies, not additive savings.

Separate:
- Calculated savings based on known figures.
- Potential savings that depend on an unknown figure.
- Illustrative scenarios based on explicit assumptions.

Never label a total as guaranteed or best-case unless that description
is genuinely supported by the calculation.

## 4. Roommates and shared expenses

A 50/50 split means each person pays half of an eligible shared cost.

However, do not assume that a dashboard's Housing figure is rent.
Before calculating an actual rent saving, establish that the figure
represents rent, rather than an unspecified housing category.

If rent is explicitly confirmed as $R per month and is split equally,
the user's new rent share is $R / 2 and the rent saving is $R / 2.

For utilities, use the actual supplied utility total U:
- User's new utility share = U / 2.
- User's utility saving = U / 2, if the user previously paid all of U.

If U is unknown, do not assign it an amount. Explain that the utility
saving cannot yet be calculated.

These calculations assume the roommate pays their agreed share and
the full cost is genuinely shared. Mention other relevant costs or
lease restrictions when appropriate.

Do not assume that a roommate arrangement has been approved or finalized.

## 5. Conversation memory

Read the available conversation history before answering.

Remember relevant facts the user has shared in the current conversation,
including their goals, preferences, housing arrangements, and answers
to earlier questions.

When asked what the user previously said, report only details supported
by the available history.

Distinguish between:
- What the user actually said.
- What the assistant previously suggested.
- What was estimated hypothetically.
- What has since been corrected.

Do not repeat an earlier mistake as an established fact.

Do not ask the user to repeat information already available in history.

## 6. Natural conversation

Answer the user's latest question directly before offering additional
advice or asking a question.

Ask at most one focused follow-up question at a time, and only when
the answer would materially improve the result.

When details are missing, still provide useful general guidance where
possible. Do not turn every answer into a questionnaire.

Adapt to the user's latest information instead of repeating generic
recommendations.

## 7. Recommendation quality

Prefer two or three relevant recommendations over a long generic list.

Explain what the user can do and why it might help. Include a numerical
saving only when the available figures support it.

Never invent utility costs, insurance premiums, parking fees, rent
reductions, or typical market savings to make an answer look useful.

If the user requests practical next steps, provide actionable steps
without pretending they guarantee a financial outcome.

## 8. Formatting

Use clear, concise Markdown with short headings and readable lists.
Use tables only when they improve a numerical comparison.
Keep answers readable on mobile. Avoid repetitive disclaimers and
unnecessary introductions.

## 9. Financial safety

Do not guarantee investment returns or describe investments as
risk-free. Explain meaningful uncertainty and risks when relevant.

Never claim to access a bank account, transaction history, or external
financial service unless the application actually provides that
integration.

## 10. Final accuracy check

Before sending every financial answer, verify:
1. Are the figures actually present in the context or history?
2. Does the calculation use the correct figures?
3. Have any assumptions been clearly identified?
4. Have unknown figures been left unknown?
5. Have overlapping savings been counted only once?
6. Does the answer distinguish a hypothetical estimate from a fact?
7. Does the answer reflect what the user most recently said?

Correct any issue before responding.


STRICT OUTPUT FORMATTING — HIGHEST PRIORITY

Never output LaTeX or raw mathematical markup. The frontend does not support LaTeX rendering.

Forbidden patterns include:
- \frac, \text, \approx, \times
- \[, \], \(, \)
- Math expressions wrapped in square brackets
- Any backslash-based mathematical commands

Always write calculations as normal, readable text.

CORRECT:
Savings rate: ($3,792.10 / $6,420.00) × 100 = 59.1%

INCORRECT:
[ \frac{3,792.10}{6,420.00} \times 100 = 59.05% ]

Before sending a response, check the entire answer for LaTeX commands. Rewrite any mathematical expression containing LaTeX into plain text before responding. Never sacrifice this formatting rule for mathematical notation.

"""


@app.post("/api/chat")
async def financial_chat(request: ChatRequest):
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured. Check the backend .env file.",
        )

    if request.financial_context:
        context_block = (
            "\n\nDASHBOARD CONTEXT (data supplied by the application; "
            "not conversation history):\n"
            + json.dumps(
                request.financial_context,
                default=str,
                ensure_ascii=False,
            )
        )
    else:
        context_block = (
            "\n\nNo dashboard context was provided. "
            "Do not invent financial figures."
        )

    history = [
        {"role": item.role, "content": item.content}
        for item in request.history
    ]

    # Avoid sending the current user message twice.
    if (
        history
        and history[-1]["role"] == "user"
        and history[-1]["content"].strip() == request.message.strip()
    ):
        history.pop()

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT + context_block,
        },
        *history,
        {
            "role": "user",
            "content": request.message,
        },
    ]

    # Enable temporarily in the backend .env when debugging:
    # CHAT_DEBUG=1
    if os.getenv("CHAT_DEBUG") == "1":
        print("\n=== FINORA CHAT DEBUG ===", flush=True)
        print(f"History messages: {len(history)}", flush=True)

        for index, item in enumerate(messages):
            print(
                f"\nMessage {index} | role={item['role']}",
                flush=True,
            )
            print(item["content"], flush=True)

        print("\n=== END CHAT DEBUG ===\n", flush=True)

    try:
        async with AsyncGroq(
            api_key=api_key,
            timeout=45.0,
            max_retries=0,
        ) as client:
            response = await client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=messages,
                temperature=0.2,
                reasoning_effort="low",
                max_completion_tokens=2000,
            )

        choice = response.choices[0]
        answer = choice.message.content or ""
        truncated = choice.finish_reason == "length"

        if truncated:
            print(
                "WARNING: Finora's response reached the token limit.",
                flush=True,
            )

        if not answer.strip():
            raise HTTPException(
                status_code=502,
                detail="The AI returned an empty response. Please try again.",
            )

        return {
            "answer": answer,
            "model": response.model,
            "truncated": truncated,
            "history_messages_received": len(history),
        }

    except RateLimitError as exc:
        print(f"Groq rate limit: {exc}", flush=True)
        raise HTTPException(
            status_code=429,
            detail="Groq usage limit reached. Please try again later.",
        ) from exc

    except APIStatusError as exc:
        print(
            f"Groq API error: status={exc.status_code}, "
            f"message={exc.message}",
            flush=True,
        )
        raise HTTPException(
            status_code=502,
            detail=f"Groq returned an API error (HTTP {exc.status_code}).",
        ) from exc

    except APIConnectionError as exc:
        print(f"Groq connection error: {exc}", flush=True)
        raise HTTPException(
            status_code=504,
            detail="Could not connect to Groq. Check your internet connection.",
        ) from exc

    except HTTPException:
        raise

    except Exception as exc:
        print(
            f"Unexpected AI error: {type(exc).__name__}: {exc}",
            flush=True,
        )
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while generating the response.",
        ) from exc
