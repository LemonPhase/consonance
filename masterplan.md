## `masterplan.md`

---

## 30-Second Elevator Pitch

A **structured debate platform for public policy**.

- Every policy question has **two sides: For and Against**.
- Arguments must compete on **evidence, logic, and sources**, not popularity.
- AI continuously **summarizes the strongest arguments** so anyone can understand the debate in seconds.
- Real-identity users create **accountable, high-signal policy discussions**.

Think:

**“Wikipedia-level clarity + Reddit participation + AI debate summaries.”**

---

# Problem & Mission

## The Problem

Most political discussion platforms fail because they produce:

- **Noise over insight**
- **Echo chambers**
- **Unstructured arguments**
- **Emotional reactions instead of evidence**

Traditional comment threads create:

- circular arguments
- buried good ideas
- impossible-to-follow debates

Result: **cognitive dissonance dominates discourse**.

People defend positions instead of **updating beliefs**.

---

## Mission

Create the **clearest public reasoning engine for policy debates**.

Goals:

- Make the **best arguments easy to find**
- Reward **evidence and reasoning**
- Reduce **tribal argument dynamics**
- Help citizens **understand trade-offs in governance**

The platform should answer:

> “What are the strongest arguments on both sides of this policy?”

In under **30 seconds**.

---

# Target Audience

## Primary Users

### 1. Policy-interested citizens

People who want deeper discussion than social media.

Examples:

- students
- journalists
- politically engaged voters

---

### 2. Policy professionals

Examples:

- researchers
- economists
- policy analysts
- think-tank members
- civil servants

They contribute **high-quality arguments and sources**.

---

### 3. Curious learners

People who want to **understand complex issues quickly**.

Example:

> “What are the strongest arguments for and against rent control?”

---

# Core Features

## 1. Policy Debate Pages

Every policy has a dedicated page.

Example:

```
Should Universal Basic Income be implemented?
```

The page contains:

- AI summary
- strongest arguments
- full debate tree
- sources

---

## 2. Two-Sided Debate Structure

Each policy splits into:

```
FOR
AGAINST
```

Arguments grow as **debate trees**, not flat threads.

Example:

```
UBI reduces poverty
 └ Counterargument: discourages work
     └ Rebuttal: evidence from Finland trial
```

This structure makes arguments **traceable and coherent**.

---

## 3. Structured Argument Posts

Users can create **high-quality arguments**.

Structure:

- Claim
- Reasoning
- Evidence / sources
- Counterarguments addressed (optional)

Example:

```
Claim:
UBI reduces poverty.

Reasoning:
Provides guaranteed income floor.

Evidence:
Finland UBI experiment.
```

---

## 4. Freeform Comments (Lower Weight)

Users may still post **simple comments**.

However:

- lower ranking
- not included in summaries
- less influence on debate visibility.

This keeps the platform **open but quality-biased**.

---

## 5. AI Debate Summaries

At the top of every policy page:

AI generates:

```
Strongest Arguments For
Strongest Arguments Against
```

Each summary point links to the **original argument**.

Users can understand a debate in **seconds**.

---

## 6. Source Verification Engine

When a source is added:

The system evaluates:

- credibility
- relevance
- whether it supports the claim.

Example output:

```
Source: Finland UBI study

Result:
Partially supports claim

Confidence: 78%
```

---

## 7. Source Credibility Ratings

Sources receive credibility levels.

Example scale:

```
Peer-reviewed research
Government data
Major journalism
Independent analysis
Blog/opinion
Social media
```

Higher credibility improves **argument ranking**.

---

## 8. Argument Quality Score

Arguments are ranked by a composite score.

Example inputs:

```
Community votes
Source credibility
Structure completeness
AI clarity score
```

This ensures **best reasoning rises to the top**.

---

## 9. Contradiction Detection

AI detects logical inconsistencies.

Example:

```
Your previous argument states that
government spending causes inflation.

Your current argument supports
large subsidy expansion.

Would you like to address this contradiction?
```

Purpose:

Reduce **cognitive dissonance**.

---

## 10. Verified Identity System

All users must verify identity.

Benefits:

- reduces trolling
- increases accountability
- increases argument credibility.

Displayed identity:

```
Real name OR verified pseudonym
```

Verification ensures **one real person per account**.

---

# High-Level Tech Stack

## Frontend

**React / Next.js**

Why:

- fast UI
- scalable
- great component ecosystem

---

## Backend

**Node.js or Python (FastAPI)**

Why:

- strong AI integration
- scalable API architecture.

---

## Database

**PostgreSQL**

Why:

- structured relational data
- ideal for debate graphs.

---

## Graph Layer

Debate relationships stored as:

```
Argument → Counterargument → Rebuttal
```

Can use:

- PostgreSQL graph relations
- or Neo4j (optional).

---

## AI Systems

Models used for:

- argument summarization
- source verification
- contradiction detection
- moderation support.

Possible providers:

- OpenAI
- Anthropic
- open-source LLMs.

---

## Infrastructure

Cloud:

```
AWS / GCP / Vercel
```

Components:

- API services
- vector search
- content moderation.

---

# Conceptual Data Model (Simple ERD in Words)

Entities:

```
User
Policy
Argument
Comment
Source
Vote
VerificationResult
```

Relationships:

```
Policy → contains → Arguments

Argument → supports/opposes → Policy

Argument → counters → Argument

Argument → cites → Source

User → writes → Argument

Users → vote → Arguments
```

This creates a **debate graph**.

---

# UI Design Principles (Krug's Laws)

Following **“Don’t Make Me Think.”**

## 1. Big Picture First

Users should immediately see:

```
Policy Question
Summary of Arguments
For vs Against
```

---

## 2. Scan-Friendly Design

Each page prioritizes:

- headings
- bullet points
- short arguments
- visual debate trees.

---

## 3. Three Mindless Clicks Rule

Users should reach:

```
policy summary
argument
source
```

Within **three clicks**.

---

## 4. Evidence Over Emotion

Visual cues highlight:

- sources
- evidence strength
- argument quality.

---

# Security & Compliance

## Identity Verification

Possible providers:

- Persona
- Stripe Identity
- Onfido

Ensures:

```
one person = one account
```

---

## Abuse Prevention

Tools:

- AI moderation
- rate limiting
- community reporting.

---

## Privacy

Store minimal identity data.

Personal info separated from public identity.

---

# Phased Roadmap

## Phase 1 — MVP

Core features:

- policy pages
- arguments (for/against)
- structured posts
- simple voting
- basic summaries.

Goal:

**validate discussion quality.**

---

## Phase 2 — Intelligence Layer

Add:

- AI summaries
- source verification
- argument quality scoring
- moderation AI.

---

## Phase 3 — Debate Graph

Add:

- argument trees
- rebuttal linking
- debate maps.

---

## Phase 4 — Expert Ecosystem

Add:

- expert verification
- policy institutions
- academic partnerships.

---

# Risks & Mitigations

## Risk: Low Participation

Debate platforms fail without contributors.

Mitigation:

- invite policy experts
- university partnerships
- curated early topics.

---

## Risk: AI Misinterpretation

AI may summarize poorly.

Mitigation:

- human feedback loops
- transparent summaries
- citation linking.

---

## Risk: Political Polarization

Users may still form camps.

Mitigation:

- highlight strongest arguments from **both sides equally**.

---

## Risk: Source Gaming

Users may cite misleading sources.

Mitigation:

- verification engine
- credibility scores.

---

# Future Expansion Ideas

## Policy Simulation

Allow users to test policies with models.

Example:

```
What happens to tax revenue if UBI is introduced?
```

---

## Argument Evolution Tracking

Track how arguments change over time.

Example:

```
Top arguments about climate policy in 2024 vs 2030
```

---

## Government & Institution Partnerships

Potential uses:

- public consultation
- citizen debate platforms
- policy crowdsourcing.

---

## Public Reasoning Archive

Over time, the platform becomes:

> **The largest structured archive of policy arguments.**
