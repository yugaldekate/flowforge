<div align="center">

# ⚙️ FlowForge

<p align="center">
  <img src="https://github.com/user-attachments/assets/d8e2c851-15ea-4029-ba6f-353170f65dac" alt="FlowForge Workflow Editor" width="100%" />
</p>

### Visual Workflow Automation Platform with AI-Powered Execution

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
![Better Auth](https://img.shields.io/badge/-Better%20Auth-black?style=for-the-badge&logoColor=white&logo=betterauth&color=black)
![Shadcn](https://img.shields.io/badge/-Shadcn-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=black)
![Inngest](https://img.shields.io/badge/-Inngest-black?style=for-the-badge&logoColor=white&logo=inngest&color=black)

**Design, execute, and monitor complex workflows with a dependency-aware DAG execution engine**

[Features](#-key-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## 🎯 What is FlowForge?

FlowForge is a **modern workflow automation platform** that combines the visual simplicity of Zapier with the power of distributed execution frameworks like Temporal. Built with TypeScript and designed for developers who need **reliable, scalable automation**.

### Why FlowForge?

- 🎨 **Visual-First Design** - Build complex workflows with an intuitive drag-and-drop interface
- 🧠 **Smart Execution** - DAG-based dependency resolution ensures correct execution order
- ⚡ **Scale Effortlessly** - Distributed background processing with automatic retries
- 🤖 **AI-Native** - Built-in support for OpenAI, Gemini, and Anthropic
- 🔐 **Security First** - Encrypted credential storage with BYOC (Bring Your Own Credentials)
- 🔄 **Real-Time Monitoring** - Track execution status and debug failures instantly

---

## ✨ Key Features

### 🧠 **Dependency-Aware Execution**
Workflows are executed as **Directed Acyclic Graphs (DAGs)** using topological sorting, ensuring nodes run in the correct order based on their dependencies. No race conditions, no guesswork.

### 🎛️ **Visual Workflow Editor**
Built with **React Flow**, featuring:
- Drag-and-drop node placement
- Real-time connection validation
- Visual dependency tracking
- Context-aware node configuration
- Zoom, pan, and minimap navigation

### ⚡ **Distributed Background Execution**
Powered by **Inngest** for production-grade workflow orchestration:
- Non-blocking async execution
- Automatic retries with exponential backoff
- Step-level execution tracing
- Pause, resume, and cancel workflows
- Real-time status updates via WebSocket

### 🤖 **AI-Powered Nodes**
Native integrations with leading AI providers:
- **OpenAI** (GPT-4, GPT-3.5)
- **Google Gemini** (gemini-2.0-flash, gemini-pro)
- **Anthropic Claude** (claude-3.5-sonnet, claude-3-opus)

Features:
- Dynamic prompt templating with workflow context
- Streaming responses (coming soon)
- Token usage tracking
- Error handling and fallbacks

### 🔐 **Secure BYOC Credential Management**
Your credentials, your control:
- AES-256 encrypted storage
- User-scoped access control
- Never exposed to frontend
- Audit logging (coming soon)
- Support for OAuth2 flows

### 🔔 **Triggers & Integrations**

**Triggers:**
- Manual execution
- HTTP webhooks
- Stripe events
- Google Forms submissions

**Actions:**
- HTTP requests (GET, POST, PUT, DELETE)
- Slack messages
- Discord webhooks

### 💳 **Subscriptions & Access Control**
Built-in monetization with **Polar**:
- Tiered subscription plans
- Feature gating
- Usage-based billing
- Checkout flow integration

---

## 🖼️ Demo

### Workflow Editor
<p align="center">
  <img src="https://github.com/user-attachments/assets/d8e2c851-15ea-4029-ba6f-353170f65dac" alt="FlowForge Workflow Editor" width="100%" />
</p>

> **Example Workflow:** Trigger via webhook → Fetch data via HTTP → Process with Gemini AI → Send notifications to Slack and Discord

### Real-Time Execution Monitoring
```
[Manual Trigger] ✓ Completed (0.2s)
    ↓
[HTTP Request] ✓ Completed (1.4s)
    ↓
[Gemini AI] ⏳ Running...
    ↓
[Slack] ⏸️ Waiting
    ↓
[Discord] ⏸️ Waiting
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  Next.js + React Flow + Jotai State Management              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (tRPC)                         │
│        End-to-end type safety + Request validation          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Workflow Execution Engine                  │
│  1. Load workflow DAG from PostgreSQL                       │
│  2. Compute execution order (Topological Sort)              │
│  3. Queue background job via Inngest                        │
│  4. Execute nodes sequentially with dependency checking     │
│  5. Stream status updates to frontend                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Node Executors                            │
│  AI Nodes | HTTP Nodes | Trigger Handlers | Integrations   │
└─────────────────────────────────────────────────────────────┘
```

### Execution Flow

1. **Workflow Definition** - User creates a visual workflow in the editor
2. **DAG Construction** - Nodes and edges are stored as a directed graph
3. **Topological Sort** - Execution order is computed deterministically
4. **Job Scheduling** - Workflow is queued in Inngest for background processing
5. **Sequential Execution** - Nodes execute only after dependencies complete
6. **Status Broadcasting** - Real-time updates via WebSocket/SSE
7. **Error Handling** - Failed nodes trigger retries or halt execution

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### **Frontend**
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router & Turbopack
- **[React 19](https://react.dev/)** - UI library
- **[React Flow (@xyflow/react)](https://reactflow.dev/)** - Workflow visualization
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Radix UI component library
- **[Jotai](https://jotai.org/)** - Atomic state management
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[nuqs](https://nuqs.47ng.com/)** - Type-safe URL state
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety

</td>
<td width="50%" valign="top">

### **Backend**
- **[tRPC 11](https://trpc.io/)** - End-to-end type-safe APIs
- **[Prisma 7](https://www.prisma.io/)** - Database ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database with pg adapter
- **[Inngest](https://www.inngest.com/)** - Background job orchestration & real-time updates
- **[better-auth](https://www.better-auth.com/)** - Authentication (@polar-sh/better-auth)
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - Unified AI provider interface
- **[Zod 4](https://zod.dev/)** - Schema validation
- **[SuperJSON](https://github.com/blitz-js/superjson)** - JSON serialization
- **[Node.js](https://nodejs.org/)** - Runtime environment

</td>
</tr>
</table>

### **AI & Integrations**
- **AI Providers:** OpenAI (`@ai-sdk/openai`), Google Gemini (`@ai-sdk/google`), Anthropic Claude (`@ai-sdk/anthropic`)
- **Payment Processing:** Polar SDK (`@polar-sh/sdk`) for subscriptions & billing
- **OAuth Providers:** GitHub, Google (via better-auth)
- **External APIs:** Stripe, Slack, Discord, Google Forms
- **Monitoring:** Sentry (`@sentry/nextjs`) for error tracking
- **Utilities:** Handlebars (templating), Cryptr (encryption), date-fns, toposort (DAG sorting)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and **npm** 9+
- **PostgreSQL** 14+ database
- **OAuth credentials** for GitHub and/or Google (for authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/yugaldekate/flowforge.git
cd flowforge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your configuration:

```bash
cp .env.example .env
```

**Required variables:**

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/flowforge"

# Authentication (Required)
BETTER_AUTH_SECRET="your-random-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Encryption for credentials (Required)
ENCRYPTION_KEY="your-32-character-encryption-key"

# App Configuration (Required)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Optional variables:**

```env
# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Monitoring & Billing
SENTRY_AUTH_TOKEN="..."
POLAR_ACCESS_TOKEN="..."
POLAR_SUCCESS_URL="http://localhost:3000"
```

> **Note:** AI provider API keys (OpenAI, Gemini, Anthropic) are managed through the BYOC credential system in the app, not environment variables.

### 4. Set Up the Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see FlowForge in action! 🎉

---

## 📖 Documentation

### Creating Your First Workflow

1. **Navigate to Workflows** - Click "Workflows" in the sidebar
2. **Create New Workflow** - Click the "+" button
3. **Add a Trigger** - Drag a "Manual Trigger" node onto the canvas
4. **Add an Action** - Drag an "HTTP Request" node
5. **Connect Nodes** - Click and drag from the trigger's output to the HTTP node's input
6. **Configure Node** - Click the HTTP node and enter a URL
7. **Save & Execute** - Click "Save" then "Execute Workflow"

### Available Node Types

| Node Type | Description | Use Case |
|-----------|-------------|----------|
| Manual Trigger | Start workflow manually | Testing, on-demand execution |
| HTTP Request | Call external APIs | Fetch data, trigger webhooks |
| OpenAI | GPT-powered text generation | Content creation, summarization |
| Gemini | Google's multimodal AI | Text analysis, code generation |
| Anthropic | Claude AI models | Complex reasoning, long context |
| Slack | Send Slack messages | Team notifications |
| Discord | Send Discord webhooks | Community updates |
| Google Forms | React to form submissions | Lead capture, surveys |
| Stripe Webhook | React to Stripe events | Payment processing |

---

## 🔐 Security

FlowForge takes security seriously:

- ✅ All credentials encrypted with AES-256
- ✅ User-scoped access control on all resources
- ✅ CSRF protection via better-auth
- ✅ SQL injection prevention via Prisma ORM
- ✅ XSS protection via React's built-in escaping
- ✅ Environment variables never exposed to frontend
- ✅ Secure session management with HTTP-only cookies

---

## 📊 Use Cases

### 🤖 **AI-Powered Automation**
- Content generation workflows
- Automated customer support
- Data analysis pipelines
- Code generation and review

### 🔗 **Integration Orchestration**
- Multi-step API workflows
- Data synchronization between platforms
- Event-driven architectures
- Webhook relay and transformation

### 📈 **Business Process Automation**
- Lead scoring and routing
- Invoice processing
- Reporting automation
- Notification systems

### 🛠️ **Internal Tools**
- DevOps automation
- Onboarding workflows
- Incident response playbooks
- Data migration pipelines

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Yugal D. Dekate**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yugaldekate)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yugaldekate72)

---

## 🌟 Support

If you find FlowForge useful, please consider:

- ⭐ **Starring the repository** on GitHub
- 🐛 **Reporting bugs** via GitHub Issues
- 💡 **Suggesting features** in Discussions
- 📢 **Sharing** with your network

---

<div align="center">

**Built with ❤️ using TypeScript, Next.js, and modern web technologies**

[⬆ Back to Top](#-flowforge)

</div>
