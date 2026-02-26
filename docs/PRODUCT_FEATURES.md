# Echo — AI Voice Customer Support Platform

## Product Overview

Echo is an AI-powered voice customer support platform that enables businesses to deploy intelligent voice assistants for real-time customer interactions. The platform combines a management dashboard with an embeddable voice widget powered by Vapi AI.

## Current Features

| Feature | Status |
|---|---|
| Clerk Authentication (Org-based) | ✅ Shipped |
| Conversations Management (CRUD) | ✅ Shipped |
| Knowledge Base (Articles/FAQs/Docs) | ✅ Shipped |
| Floating Voice Widget (Vapi AI) | ✅ Shipped |
| Real-time Convex Backend | ✅ Shipped |

## New Features (v0.2)

### 1. Dashboard Overview (`/`)

Replace the placeholder YouTube embed with a real analytics dashboard.

- **Stats Cards**: Total conversations, active calls, knowledge base entries, ended conversations
- **Recent Activity**: Last 5 conversations with status and timestamp
- **Quick Actions**: Buttons to create conversation / add knowledge

### 2. Conversation Detail Page (`/conversations/[id]`)

Click into a conversation to see its full message transcript.

- **Conversation Header**: Customer name, status badge, duration, timestamps
- **Message Thread**: Scrollable transcript with user/assistant bubbles
- **Actions**: End conversation, delete, send test message
- **Back Navigation**: Breadcrumb to return to list

### 3. Settings Page (`/settings`)

Basic configuration page for the platform.

- **Profile Section**: Organization info from Clerk
- **AI Assistant Config**: Display current assistant ID, voice settings
- **Appearance**: Theme toggle (light/dark mode)

### 4. Sidebar Polish

- Remove hardcoded badge counts, use live counts from Convex
- Add Dashboard home link and Settings link
- Active state highlighting for current page

## Architecture

```
apps/web          — Next.js 15 dashboard (port 5090)
apps/widget       — Embeddable voice widget (port 5091)
packages/backend  — Convex schema, queries, mutations
packages/ui       — Shared shadcn/ui component library
```

## Deployment

- **Frontend**: Vercel (web + widget apps)
- **Backend**: Convex Cloud
- **Auth**: Clerk
- **Voice AI**: Vapi
