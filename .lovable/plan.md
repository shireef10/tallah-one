# Tallah One — Build Plan

## Vision
Build a unified internal digital workplace for Tallah employees. "Everything you need. One place." The experience should feel like a modern internal operating system — inspired by Notion, Linear, and Atlassian — with a warm, elegant, beauty-industry aesthetic.

## Reasonable Defaults (Skipped Questions)
- **Scope approach:** Phased delivery. Phase 1 = full UI shell + authentication + 3 real backend modules. Remaining modules as UI-ready pages with mock data, then backend-activated in follow-up phases.
- **Design direction:** Rose & Champagne premium palette. Warm, soft, elegant — fitting a beauty/cosmetics brand. Clean SaaS structure with rounded cards, subtle gradients, and modern typography.
- **Language:** English (LTR). All copy, navigation, and content in English. RTL/bilingual can be added in a later phase.
- **Tool links:** External link cards. Each workspace tool is a card with logo, description, and buttons to open the external system in a new tab. No SSO/iframe embedding.

## Phase 1 — Foundation + First Real Modules

### 1. Design System
- Define color tokens in `src/styles.css` using a warm rose/champagne palette (primary rose, secondary warm beige, background soft cream, foreground deep charcoal).
- Set modern font stack (Inter + optional display font).
- Add sidebar and card tokens.
- Light mode default. Dark mode toggle wired but not fully themed yet.

### 2. Authentication & Authorization (Lovable Cloud)
- Enable Lovable Cloud (Supabase backend).
- Build login page with Email/Password + Google OAuth.
- Role-based access control table (`user_roles` with `app_role` enum: `super_admin`, `digital_transformation`, `department_manager`, `employee`).
- Create `profiles` table linked to `auth.users`.
- Auto-create profile on signup via database trigger.
- Add protected route layout under `src/routes/_authenticated/`.
- Add `src/start.ts` auth attacher for server function bearer tokens.
- Super Admin seed user.

### 3. Application Shell
- **Sidebar Navigation** (collapsible, icon-capable):
  - Dashboard
  - Workspace
  - Learning Center
  - Knowledge Base
  - Process Library
  - Support Center
  - Service Requests
  - Book a Meeting
  - Team Directory
  - Announcements
  - FAQs
  - Settings
- **Top Header:** Global search bar (UI-only for Phase 1), notification bell with unread counter, user avatar dropdown.
- **Layout:** `SidebarProvider` + `AppSidebar` + `SidebarInset` wrapping all authenticated pages.

### 4. Dashboard (Home) — Fully Functional UI
- Hero greeting with employee name from profile.
- Quick Action Cards grid: ERP, CX, WhatsApp, SMS, Website, Marketing, Email, Learning, Support.
- Widget sidebar/cards:
  - Latest Updates
  - Latest Tutorials
  - Recent Announcements
  - Upcoming Meetings
  - Open Service Requests
  - Open Support Tickets
  - Recently Added Documentation
- All dashboard widgets pull from real tables (see modules below) or show empty states.

### 5. Workspace — UI Page
- Categorized tool grid with external link cards.
- Categories: ERP, CX, WhatsApp Campaigns, SMS Campaigns, Website & E-Commerce, Marketing Tools, Communication, Employee Resources.
- Each card: placeholder logo, description, Access button (external link), Tutorial button, Documentation button.
- Admin-editable tool metadata stored in `workspace_tools` table.

### 6. Learning Center (Tallah Academy) — Backend-Ready Module
- Database: `tutorials` table (id, title, category, description, video_url, pdf_url, thumbnail, duration, created_at, views, owner_id).
- Database: `tutorial_progress` table (user_id, tutorial_id, progress_percent, completed, last_watched_at).
- Database: `tutorial_bookmarks` table.
- Frontend:
  - Category sidebar: ERP Academy, CX Academy, E-Commerce Academy, Marketing Academy, Partners Academy, Onboarding Academy.
  - Video library grid with search and filters.
  - Video player page with progress tracking, bookmarks, favorites.
  - Admin upload interface (video URL / file, PDF, thumbnail).

### 7. Team Directory — Backend-Ready Module
- Database: `team_members` table (id, name, position, department, email, phone, photo_url, bio, created_at).
- Frontend:
  - Grid of employee cards with photo, name, position, department.
  - Contact buttons (email, phone).
  - QR code for team WhatsApp group.
  - Admin CRUD interface.

### 8. Announcements — Backend-Ready Module
- Database: `announcements` table (id, title, content, category, priority, pinned, published_at, created_by, banner_image_url).
- Frontend:
  - Announcement feed with pinning, priority badges, categories.
  - Banner management (admin).
  - Scheduled publishing support via `published_at`.

### 9. Global Search (UI + Backend)
- Search bar in header.
- Server function querying across: tutorials, announcements, team members, knowledge base, processes, FAQs.
- Results page with categorized tabs.

### 10. Remaining Pages — UI Shell with Mock Data
All other navigation items get a realistic page shell with proper layout, empty states, and mock data so the app feels complete:
- Knowledge Base (wiki-style list, article view UI)
- Process Library (process cards, flowchart placeholder, PDF placeholder)
- Support Center (ticket form UI, ticket list UI)
- Service Requests (request form UI, status pipeline UI)
- Book a Meeting (calendar UI, slot picker UI)
- FAQs (collapsible Q&A UI, search, categories)
- Settings (profile form, password change, preferences UI)

### 11. Admin Panel Shell
- Admin-only route (`/admin`) gated by `super_admin` or `digital_transformation` role.
- Sidebar with admin sections:
  - Dashboard (analytics overview with mock charts)
  - Users & Roles
  - Tutorials Management
  - Knowledge Base Management
  - Processes Management
  - Announcements Management
  - Team Members Management
  - Support Tickets Management
  - Service Requests Management
  - Categories & Quick Links
  - Activity Logs (table UI)
- Each admin section has a functional CRUD interface for its module.

## Technical Stack
- **Framework:** TanStack Start v1 (React 19, Vite 7, file-based routing)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Components:** shadcn/ui (already installed)
- **Backend:** Lovable Cloud (PostgreSQL + Auth)
- **Server Logic:** TanStack `createServerFn` with `requireSupabaseAuth` middleware
- **State/Queries:** TanStack Query (`useSuspenseQuery` + `ensureQueryData` in loaders)
- **Icons:** Lucide React

## Phase 2+ (Follow-up Iterations — Not in Phase 1)
- Dark mode full theming
- Notifications system (bell + email)
- Support tickets full backend with status workflow
- Service requests backend with approval pipeline
- Knowledge Base rich text editor + versioning
- Process Library flowchart rendering
- Book a Meeting calendar integration
- FAQ ratings and analytics
- Admin analytics dashboard with real charts
- Backup & restore data
- Search engine refinements (full-text, filters)

## Acceptance Criteria for Phase 1
1. App builds without errors.
2. Authentication works (login, logout, Google OAuth, role assignment).
3. Sidebar navigation routes to every page without 404s.
4. Dashboard shows real data from Learning Center, Team Directory, and Announcements modules.
5. Admin panel allows CRUD on users, tutorials, team members, and announcements.
6. Global search returns real results from backend-enabled modules.
7. All pages have realistic mock data and proper empty states.
8. UI is responsive (desktop-first, mobile-friendly).
9. Role-based access control gates admin routes and features.
