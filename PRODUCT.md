# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Businesses and entrepreneurs in Saudi Arabia who have an idea, a business problem, or an existing system that needs work, and want a single partner to take it from idea through launch and beyond — rather than hiring separate freelancers or agencies for design, development, automation, and AI. Site copy defaults to Arabic (`defaultLocale = "ar"`), with English as the secondary language, confirming Arabic-speaking Saudi businesses as the primary audience.

## Product Purpose

Lumen is a technology studio (a small team, not a solo operation) offering end-to-end digital product services: website and web app design/development, mobile apps, UI/UX design, business automation, AI solutions, custom software/dashboards/CRM/SaaS, full digital product development from idea, paid technology consulting, and ongoing post-launch support. The public site markets these services, lets visitors request a project or book a paid consultation, and gives the Lumen team an admin panel to manage inquiries, bookings, and proposals.

## Positioning

Lumen's differentiator is acting as a full product-building partner across the entire journey (idea → requirements → strategy → UX → UI → development → testing → launch → ongoing development), not just an execution contractor hired for one isolated piece. It is stack-agnostic ("we choose the right tool for each project, not the other way around") and spans traditional web/app development alongside automation and applied AI — a broader combination than a typical single-discipline agency offers.

## Operating Context

- Public marketing site (bilingual ar/en, RTL for Arabic) covering services, pricing, portfolio, process, FAQ, and legal pages.
- **Start a Project** flow: an inquiry form (name, company, email, phone, project type, budget, timeline, details) that starts a conversation — not a binding commitment.
- **Consultations** flow: visitor picks a consultation category (project idea, apps/websites, automation, AI, systems review, digital transformation), books a 45-minute slot (SAR 150/hr) through a multi-step Details → Schedule → Review booking form, and submits a request. Payment is confirmed manually by the Lumen team afterward by email — there is no integrated payment gateway in the codebase today, despite the Privacy Policy currently describing a "trusted third-party payment provider"; treat that copy as ahead of the actual implementation.
- **Proposals** flow: clients view a proposal at a unique link showing payment milestones, and self-report each milestone as paid ("I've Sent the Transfer for This Milestone") for the Lumen team to confirm manually — this is a manual bank-transfer attestation flow, not an automated payment gateway.
- **Admin panel** at `/admin`: single shared-password auth (HMAC session cookie, no multi-user login) for the Lumen team to manage inquiries, bookings, and proposals.
- Data stored in Supabase; email notifications sent via Resend.

## Capabilities and Constraints

- Next.js App Router, i18n via a custom dictionary system (`src/lib/i18n`) with `ar` and `en`, `ar` is the default locale.
- Tailwind CSS v4 for styling.
- No payment gateway is integrated — all payment confirmation (consultations and proposal milestones) is currently a manual, human-confirmed process. Do not design or imply automated online payment (e.g. card checkout) without this being explicitly rebuilt.
- Admin auth is a single shared password, not per-user accounts — any admin UI work should assume one undifferentiated "Lumen team" role, not individual user permissions.
- Deployed on Vercel under the custom domain `lumen.com.sa`.

## Brand Commitments

- Name: **Lumen** (Arabic: لُمِن). Tagline: "We turn your ideas into complete digital solutions."
- Lumen is run by a small team (confirmed by the user); site copy referring to "the Lumen team" is literal, not a stylistic device for a solo operator.
- Existing wordmark component: `src/components/LumenMark.tsx`.

## Evidence on Hand

- Three portfolio case studies in `src/lib/i18n/en.ts` (`portfolio.projects`) — Lead Qualification & CRM Automation, AI Customer Support Agent (WhatsApp), and Qarrib (community delivery app) — are confirmed real projects Lumen actually delivered, not illustrative examples. They currently have no screenshots ("Screenshot coming soon" placeholder in `Portfolio.tsx`) — future work must not fabricate visuals implying real product screenshots without the user supplying them.
- No testimonials, press mentions, or client logos exist anywhere in the codebase — do not invent any.
- Privacy Policy and Terms of Service are explicitly marked in-copy as "a general first draft" pending legal review — do not treat their content as fully finalized product/legal fact.

## Product Principles

- End-to-end partnership over piecemeal execution: every surface should reinforce that Lumen carries a project from idea to launch and beyond, not just one discipline.
- Stack-agnostic, results-focused: technology choices serve the business goal, never presented as an end in themselves.
- Honesty about current process: consultations and milestone payments are manually confirmed by a human team, not automated — copy and flows should not overclaim automation that isn't built yet.
- Bilingual by default, Arabic-first: Arabic is the default locale and primary audience language; English is secondary, not an afterthought bolted onto an English-first design.
- Small, real team: "the Lumen team" refers to an actual small team — do not inflate it into an impersonal large-company voice, and do not fabricate individual team member identities without the user's input.
