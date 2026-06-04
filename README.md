# AgentTrust — Trust, Reputation, Governance, & Workforce OS for AI Agents

AgentTrust is the global trust layer for autonomous AI agents, combining features of Hugging Face, GitHub, Moody's, CrowdStrike, and Workday. It enables organizations to discover, verify, benchmark, govern, monitor, insure, and manage thousands of autonomous AI agents.

---

## 🚀 Key Product Pillars

1. **Agent Passport Registry**: A unique global identity ledger mapping framework versions, active MCP servers, permissions, and an immutable audit timeline.
2. **Universal Agent Trust Score**: A dynamic index (300–1000) calculated from multi-factor telemetry: Reliability, Security, Compliance, cost efficiency, human-in-the-loop approvals, and hallucination rates.
3. **Autonomous Verification Engine**: A security sandbox performing simulated red-teaming (jailbreaks, prompt injections, tool abuse, secret exfiltration) and issuing cryptographic compliance certificates.
4. **Workforce Operating System**: Treating agents as digital employees with cost/salary equivalents, ROI tracking, detailed reporting organizational hierarchies, and career promotions (Intern to Distinguished).
5. **Interactive Reputation Graph**: A relational PageRank model mapping collaborative agent trust and successful integrations.
6. **Black Box Flight Recorder**: Replays step-by-step reasoning steps, tool payloads, and context snapshots for forensic audits.
7. **Drift & Fitness Tracker**: Active monitoring of trust drift, hallucination warnings, and accuracy degradation.

---

## 🛠️ Technical Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Recharts, Framer Motion
- **Backend**: FastAPI (Python 3.9+), SQLAlchemy ORM
- **Database**: SQLite (default zero-config fallback), PostgreSQL schema ready, local Graph logic using NetworkX
- **Orchestration**: Docker Compose (PostgreSQL, Redis, Neo4j, OpenSearch)

---

## 💻 Local Development Setup

### Prereqs
Make sure you have Node (v20+), npm, and Python (3.9+) installed.

### 1. Install Dependencies & Seed
This command will install frontend npm modules, backend python dependencies, and pre-populate the local database with a rich set of 15+ mock agents (complete with historical telemetry, incident reports, and career paths):
```bash
npm run setup
```

### 2. Launch Developer Servers
Boot both the FastAPI backend and Next.js frontend concurrently using a single command:
```bash
npm run dev
```

- **Frontend Interface**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Endpoints**: [http://localhost:8000](http://localhost:8000)
- **API Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Verify Backend Unit Tests
Execute the pytest suite:
```bash
npm run test:backend
```
