# GEMINI.md
---

## 1. Project Overview

This project is a **multi-tenant eCommerce SaaS platform**. Every feature must be designed for high performance, security, and strict tenant isolation.

> **MANDATORY:** Before implementing any new feature or making structural changes, you **MUST** read this file in its entirety to ensure alignment with project standards and the existing tech stack.

* **Full-Stack Tech Stack:**
  * **Backend:** Node.js + Express (v5.x)
  * **Frontend:** Next.js (v15+) + React (v19) + Tailwind CSS (v4)
  * **Database:** PostgreSQL (via Prisma v7.x)
  * **Validation:** Zod
  * **State Management:** TanStack Query (Frontend)
  * **UI Components:** Shadcn UI (Radix UI) + Hugeicons
  * **Observability:** OpenTelemetry (Tracing)
  * **Storage:** AWS S3
  * **Auth:** JWT + Google OAuth

---

## 2. Dependency Management

To prevent package bloating and version conflicts:

1.  **Check Existing:** Before adding a new library, verify if an existing dependency can fulfill the requirement.
2.  **Compatibility:** Ensure any new frontend package is compatible with **React 19** and **Next.js 15**.
3.  **Strict Typing:** Prefer packages with built-in TypeScript definitions.
4.  **No Duplicate Logic:** Do not add libraries that overlap with existing ones (e.g., don't add `axios` if `fetch` or an existing utility is preferred, unless specified).

---

## 3. AI Assistant Role

Act as a **Senior Full-Stack Engineer & Architect**. Your goal is to maintain the structural integrity of the SaaS platform.

---

## 4. Coding Standards (Backend & Frontend)

### 4.1 General Rules
* **Zero 'any' Tolerance:** Everything must be strictly typed.
* **Validation:** All inputs (API or Forms) must be validated via **Zod**.
* **Naming:** `snake_case` for DB, `camelCase` for TS/JS, `kebab-case` for files.

### 4.2 Error Handling
* **Backend:** Use `AppError` and `catchAsync`.
* **Frontend:** Use `sonner` for UI feedback and TanStack Query error states.

---

## 5. Architecture Rules (Backend)

*   **Repository-Service Pattern:** Mandatory. Services handle logic; Repositories handle Prisma calls.
*   **Tenant Isolation:** `tenantId` is mandatory in all core tables and must be verified in every request.

---

## 6. Architecture Rules (Frontend)

*   **App Router:** Follow Next.js 15 App Router conventions.
*   **Server Components:** Default to Server Components; use `'use client'` only when interaction is required.
*   **Styling:** Tailwind 4 ONLY. Use the `cn()` utility for class merging.

---

## 7. Progress & Implementation Log

### 7.1 Auth & Tenant Core (COMPLETED)
* **Simplified Registration**: Only Email/Password required.
* **Auto-Provisioning**: Automatic creation of `Tenant` and `Owner` on signup.
* **Google OAuth**: Full Login/Register integration with automatic store generation for new users.
* **Session Management**: Cookie-based authentication (`lax` policy for development).

### 7.2 Dashboard & UI (COMPLETED)
* **Onboarding Wizard**: Intelligent "New Store" detection with a mandatory setup form.
* **Professional Layout**: Sidebar navigation and fixed Topbar with User profile/avatar sync.
* **Mobile-First Design**: Fully responsive dashboard with collapsible hamburger menu and adaptive components.
* **Shadcn UI Standardization**: Unified design language using Shadcn primitives (`Card`, `Input`, `Tabs`, etc.) across all pages.

### 7.3 Storefront Architecture (COMPLETED)
* **Multi-Tenant Middleware**: Subdomain detection and dynamic URL rewriting (`slug.localhost:3000`).
* **Public APIs**: Exposed tenant/store data endpoints without auth requirements.
* **Storefront Template**: Dynamic, branded public home page and layout.

### 7.4 Product Management (COMPLETED)
* **Full CRUD**: Create, Read, Update, and Delete products with transactional consistency.
* **Prisma Alignment**: Form supports complex model fields (Logistics, SKUs, Inventory, Media).
* **Deep Linking**: "View on Store" logic for direct product access on merchant storefronts.

### 7.5 Organization & Taxonomy (COMPLETED)
* **Category Management**: Dedicated module for grouping products with child/parent relationship support.
* **Brand Management**: dedicated module for managing store brands.
* **Dynamic Integration**: Product form now includes dynamic category and brand selection.

---

## 8. Final Rule

Always design for:

> **Scalability, Maintainability, and Multi-Tenant Safety**
