# `implementation-plan.md` (Hackathon MVP Version)

## Goal of the MVP

Demonstrate **one powerful idea**:

> A policy page where AI summarizes the strongest arguments for and against.

Everything else supports this.

If judges understand the debate **in 10 seconds**, the demo works.

---

# Core Demo Flow

User visits a page:

```
Should Universal Basic Income exist?
```

They immediately see:

```
AI Summary

FOR
• Reduces poverty by providing a guaranteed income floor
• Simplifies welfare systems

AGAINST
• High fiscal cost
• Risk of reduced labor participation
```

Below that:

```
Arguments
```

Users can read arguments and sources.

That’s enough to **demonstrate the product vision**.

---

# What You Actually Build (MVP Features)

Only **four components**.

### 1️⃣ Policy Page

One main page.

Example:

```
/policy/ubi
```

Sections:

```
Policy Question
AI Summary
Arguments For
Arguments Against
```

---

### 2️⃣ Arguments List

Arguments are **simple objects**.

Example data:

```json
{
  "id": 1,
  "side": "for",
  "claim": "UBI reduces poverty",
  "reasoning": "Guarantees minimum income",
  "source": "Finland UBI trial"
}
```

For hackathon:

- **hardcode or store in SQLite**

---

### 3️⃣ Post Argument Form

Simple form:

```
Claim
Reasoning
Source
Side: For / Against
```

Submit → appears in argument list.

---

### 4️⃣ AI Summary Generator

Button:

```
Generate Summary
```

Flow:

1. collect arguments
2. send to LLM
3. generate:

```
Strongest arguments FOR
Strongest arguments AGAINST
```

This is your **wow moment**.

---

# Recommended Tech Stack (Hackathon)

Keep it **ultra simple**.

### Frontend

```
Next.js
Tailwind
```

Fast and easy UI.

---

### Backend

Just use:

```
Next.js API routes
```

No separate backend needed.

---

### Database

Option 1 (fastest):

```
SQLite
```

Option 2 (even faster):

```
mock JSON data
```

---

### AI

Use:

```
OpenAI API
```

Prompt example:

```
You are summarizing a policy debate.

Given these arguments, produce:

Strongest arguments FOR
Strongest arguments AGAINST

Arguments:
{arguments}
```

---

# 3-Hour Build Timeline

## Hour 1 — Basic App

Build UI.

Tasks:

```
create Next.js app
create policy page
create arguments list
style with Tailwind
```

Use **mock arguments**.

Checkpoint:

You can view the debate.

---

## Hour 2 — Posting Arguments

Add form.

Tasks:

```
create argument form
store in local state or sqlite
display new arguments
```

Checkpoint:

Users can add arguments.

---

## Hour 3 — AI Summary

Add summarizer.

Tasks:

```
create API route
send arguments to OpenAI
display summary
```

Checkpoint:

Click button → summary appears.

---

# Data Model (Ultra Simple)

```
Policy
 - id
 - title
```

```
Argument
 - id
 - side (for / against)
 - claim
 - reasoning
 - source
```

That’s it.

---

# Simple UI Layout

```
----------------------------------
Policy Title

AI Summary
----------------------------------
FOR
• argument
• argument

AGAINST
• argument
• argument

----------------------------------
Add Argument Form
----------------------------------
Arguments List
----------------------------------
```

Very readable.

---

# Optional Hackathon “Wow” Feature

If you have **extra time (20 minutes)**:

Add **source verification badge**.

Example:

```
Source: Finland UBI Study
AI Confidence: 82% Supports Claim
```

Even if it’s just **LLM analysis**, it feels powerful.

---

# Hackathon Demo Script (Very Important)

Your presentation should be:

1️⃣ Show messy Reddit debate screenshot.

Say:

> “Policy discussions online are chaotic and impossible to understand.”

2️⃣ Open your app.

Say:

> “Our platform structures arguments and summarizes the debate.”

3️⃣ Click **Generate Summary**.

Boom:

```
Strongest arguments FOR
Strongest arguments AGAINST
```

4️⃣ Add a new argument live.

Re-generate summary.

---

Judges immediately see:

**“Oh wow, this actually makes debates understandable.”**

---

# Realistic Hackathon Architecture

```
Next.js
  ├ Policy Page
  ├ Arguments List
  ├ Argument Form
  └ AI Summary

SQLite or JSON
```
