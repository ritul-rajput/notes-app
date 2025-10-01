# Quick Notes App - Feature Implementation Playbook

This document is a step-by-step implementation playbook for each feature of the Quick Notes App. It complements `PROJECT_PLAN.md`, `TECHNICAL_SPECIFICATIONS.md`, and `DEVELOPMENT_CHECKLIST.md` by detailing how to build, verify, and accept each feature.

For each feature below, you will find:
- Objectives and scope
- Dependencies and prerequisites
- Data model updates
- UI/UX requirements
- Implementation steps (detailed)
- Testing plan (unit, integration, E2E)
- Acceptance criteria
- Metrics and instrumentation
- Risks and mitigations
- Rollout and rollback plan

References:
- Project Plan: `PROJECT_PLAN.md`
- Technical Specs: `TECHNICAL_SPECIFICATIONS.md`
- Checklist: `DEVELOPMENT_CHECKLIST.md`

---

## Template: Per-Feature Plan

Use this template when adding new features not listed below.

- Objective
- Scope (In/Out)
- Dependencies
- Data Model Changes
- UI/UX Changes
- Implementation Steps
- Testing Plan
- Acceptance Criteria
- Metrics/Instrumentation
- Risks/Mitigations
- Rollout/Rollback

---

## 1) Guest Mode with 24-hour Auto-Delete and Auth

- Objective
  - Allow users to use the app without an account with local-only notes auto-deleted after 24 hours; provide smooth upgrade to registered account with data migration.

- Scope (In/Out)
  - In: Guest notes, auto-delete timer, countdown indicator, Firebase Auth sign-in/sign-up, biometric sign-in, password reset, account deletion.
  - Out: Cloud sync for guest.

- Dependencies
  - Firebase Auth configured
  - Local storage (SQLite, AsyncStorage)
  - Security services (Keychain/Keystore), see `TECHNICAL_SPECIFICATIONS.md` Security Interfaces

- Data Model Changes
  - `notes.auto_delete_at` (epoch ms) for guest notes
  - `users` table entries optional in offline; guest user has transient ID

- UI/UX Changes
  - `WelcomeScreen` with “Continue as Guest” and Auth options
  - Note list showing remaining time for guest notes (badge/timer)
  - Upgrade flow CTA to register and migrate

- Implementation Steps
  1. Create `GuestModeManager` service
     - Generates guest user ID on first launch and stores in `AsyncStorage`
     - Sets `auto_delete_at` for new guest notes (now + 24h)
     - Background cleanup job removes notes where `auto_delete_at < now`
  2. Implement visual countdown in note list cells and note detail header
     - Compute remaining time based on `auto_delete_at`
  3. Add Firebase Auth integration in `AuthService`
     - Email/password, sign-up, sign-in, sign-out, reset password
     - Biometric sign-in option using secure token storage
  4. Data migration `DataMigrationService`
     - On successful registration, copy all local notes from guest user ID to new user ID; remove `auto_delete_at` unless user opts to keep
  5. Security
     - Store tokens and encryption keys in Keychain/Keystore
  6. Edge cases
     - App in background during timer expiry
     - User upgrades after some notes expired

- Testing Plan
  - Unit: `GuestModeManager` timer logic; `AuthService` flows; `DataMigrationService` mapping
  - Integration: Guest to Registered migration with notes retained; biometric sign-in unlock
  - E2E (Detox): Guest note creation → timer badge visible → upgrade → notes persist

- Acceptance Criteria
  - Guest notes reliably auto-delete at or shortly after 24h without user action
  - Upgrade preserves non-expired notes and removes guest limitation
  - All auth flows pass error handling and validation

- Metrics/Instrumentation
  - Events: `guest_started`, `guest_note_created`, `guest_auto_delete`, `user_upgraded`
  - Error tracking on auth and migration failures

- Risks/Mitigations
  - Risk: Unexpected deletion; Mitigation: Visible countdown + grace window (e.g., 5 minutes) and confirmatory notice

- Rollout/Rollback
  - Feature flag: `guest_mode_enabled`
  - Rollback by disabling flag; migration is idempotent

---

## 2) Offline-First Data Architecture and Sync Foundation

- Objective
  - Provide reliable offline CRUD for notes with future-ready sync hooks for premium users.

- Scope (In/Out)
  - In: SQLite schema, repositories, offline queue, FTS index, validation
  - Out: Full bidirectional cloud sync (handled in Premium Sync feature)

- Dependencies
  - SQLite layer and migration system
  - Repository interfaces (see `TECHNICAL_SPECIFICATIONS.md`)

- Data Model Changes
  - Tables: `notes`, `notebooks`, `tags`, `note_tags`, `media`, `sync_queue`, `notes_fts`

- UI/UX Changes
  - None visible besides faster local operations; add subtle sync/pending indicators later

- Implementation Steps
  1. Implement database initialization and migrations
  2. Implement repositories per interface with robust error handling
  3. Implement `notes_fts` indexing hooks on create/update/delete
  4. Implement `OfflineQueue` with enqueue/dequeue and retry logic
  5. Implement `DataValidator` for schema-level constraints

- Testing Plan
  - Unit: Repository CRUD, FTS indexing, queue add/remove
  - Integration: App restart with pending queue; conflict placeholders

- Acceptance Criteria
  - All CRUD operations work offline; FTS returns expected results for large datasets

- Metrics/Instrumentation
  - `db_query_time`, `fts_search_time`, `offline_queue_length`

- Risks/Mitigations
  - Risk: Corruption or partial migrations; Mitigation: versioned migrations + backup/restore routine

- Rollout/Rollback
  - Behind `offline_arch_v1` flag for migration steps

---

## 3) Basic UI & Note Management

- Objective
  - Deliver core note creation, editing, list display, search, settings, theming, and pinning.

- Scope (In/Out)
  - In: Onboarding, notes list, editor, search, settings, dark/light theme, pin, swipe actions
  - Out: Rich formatting beyond basics (handled later if needed)

- Dependencies
  - Navigation, Redux Toolkit, design system base

- Data Model Changes
  - `notes.is_pinned`, basic formatting storage in `content`

- UI/UX Changes
  - `Welcome/Onboarding`, `NotesList`, `NoteEditor`, `Settings`

- Implementation Steps
  1. Create design system (colors, typography, spacing)
  2. Implement reusable components (Button, TextInput, Card, Icon)
  3. Build `NotesList` with pull-to-refresh, swipe actions (delete/lock)
  4. Build `NoteEditor` with basic formatting toolbar
  5. Implement debounce auto-save + undo/redo stack
  6. Implement search with local FTS (title/content/ocr_text)
  7. Implement theme toggle in `Settings`

- Testing Plan
  - Unit: editor formatting utils; undo/redo; search filtering
  - Integration: create→edit→pin→search→delete flows
  - E2E: Onboarding to first note creation and search

- Acceptance Criteria
  - Creating, editing, pinning, deleting, and searching notes work reliably offline

- Metrics/Instrumentation
  - `note_save_time`, `search_response_time`, `notes_created`

- Risks/Mitigations
  - Risk: Undo/redo edge cases; Mitigation: command-pattern with bounded history

- Rollout/Rollback
  - Progressive rollout; feature flags not required

---

## 4) Drawing & Handwriting (Skia) + Handwriting Recognition

- Objective
  - Enable high-performance drawing with pressure sensitivity and handwriting-to-text conversion.

- Scope (In/Out)
  - In: Pen/eraser/tools, layers, color picker, performance optimizations, export PNG/SVG
  - In: Handwriting recognition pipeline and text conversion stored in `ocr_text`
  - Out: Advanced vector editing beyond selection/layers

- Dependencies
  - React Native Skia, Apple Pencil APIs, OCR service (local/remote)

- Data Model Changes
  - `notes.content_type`, `notes.drawing_data`, `notes.ocr_text`

- UI/UX Changes
  - `DrawingCanvasScreen` with toolbar, layers panel
  - Export modal and quality options

- Implementation Steps
  1. Integrate Skia canvas and input handling with pressure support
  2. Implement tools: pen, eraser, shapes; maintain paths model
  3. Layers system with ordering and visibility
  4. Export pipeline to PNG/SVG and store references
  5. Handwriting recognition
     - Export drawing region snapshots
     - Send to OCR/handwriting model; store recognized text in `ocr_text`
  6. Performance: throttle, off-main-thread updates, memoization

- Testing Plan
  - Unit: path utils, layer operations, export routines
  - Integration: drawing→export→OCR→search flow
  - E2E: Create drawing note, convert to text, search found

- Acceptance Criteria
  - 60fps drawing on mid-tier devices; text extracted is searchable

- Metrics/Instrumentation
  - `drawing_latency_ms`, `drawing_usage`, `ocr_confidence`

- Risks/Mitigations
  - Risk: OCR costs; Mitigation: batch requests, local model fallback, caching

- Rollout/Rollback
  - Feature flags: `drawing_enabled`, `handwriting_recognition`

---

## 5) Media Attachments (Image/Audio/Video) + OCR Integration

- Objective
  - Allow attaching media to notes with previews and OCR for images to power search.

- Scope (In/Out)
  - In: Camera/picker, compression, preview, gallery, OCR text extraction, trial limits for free tier
  - Out: Advanced editing of media content

- Dependencies
  - Camera/picker modules, Firebase Storage (premium), Cloud Vision API

- Data Model Changes
  - `media` table with `cloud_url` and `thumbnail_path`
  - `notes.ocr_text` enriched from image OCR results

- UI/UX Changes
  - Attachment button in editor, previews grid, media viewer screen

- Implementation Steps
  1. Implement media picker and camera capture
  2. Implement compression/transcoding where applicable
  3. Save media metadata to `media` table; link to note
  4. Generate thumbnail for images/videos
  5. OCR pipeline for images
     - Upload/locate file (local path or temp upload if required by API)
     - Extract text; append to `notes.ocr_text`; update FTS
  6. Enforce free-tier trial limits per month via counters in settings

- Testing Plan
  - Unit: compression utilities, OCR service mocks
  - Integration: attach→OCR→search; monthly limit enforcement
  - E2E: Capture image note, search by extracted text

- Acceptance Criteria
  - Media attaches quickly; OCR text is searchable; free limits correctly enforced

- Metrics/Instrumentation
  - `media_attach_time`, `ocr_requests`, `ocr_success_rate`

- Risks/Mitigations
  - Risk: Large file sizes; Mitigation: size caps, background uploads, compression

- Rollout/Rollback
  - Flags: `media_enabled`, `media_ocr_enabled`

---

## 6) Premium Features: Cloud Sync and Subscriptions (IAP)

- Objective
  - Provide cloud sync for premium users and subscription purchase/restore flows.

- Scope (In/Out)
  - In: React Native IAP, subscription management, receipt validation, sync engine (notes/notebooks/tags/media)
  - Out: Team collaboration (future)

- Dependencies
  - Firestore/Cloud Storage structure from `TECHNICAL_SPECIFICATIONS.md`
  - `sync_queue`, repositories, conflict resolution strategy

- Data Model Changes
  - Firestore collections: `users/{userId}/notes`, `notebooks`, `tags`, `media`
  - Local: `sync_status`, `version` fields maintained

- UI/UX Changes
  - Premium paywall, subscription status banners, restore purchases button
  - Sync toggle and status indicators

- Implementation Steps
  1. IAP Integration
     - Fetch products; display paywall; purchase; restore
     - Validate receipts (backend function if needed); persist premium status
  2. Sync Manager
     - Outbound sync: drain `sync_queue` to Firestore
     - Inbound sync: subscribe to Firestore changes and apply locally
     - Conflict resolution: last-write-wins with version checks, show conflicts UI if needed
  3. Media sync
     - Upload media to Cloud Storage; store `storageUrl` in Firestore

- Testing Plan
  - Unit: subscription state machine; sync transform functions
  - Integration: offline changes → come online → sync correctness
  - E2E: Purchase → premium unlocked → notes sync across two devices

- Acceptance Criteria
  - Stable subscription lifecycle; reliable two-way sync without data loss

- Metrics/Instrumentation
  - `premium_conversion`, `sync_success_rate`, `sync_duration`

- Risks/Mitigations
  - Risk: Sync conflicts; Mitigation: versioning + conflict UI and logs

- Rollout/Rollback
  - Flags: `premium_enabled`, `sync_enabled`

---

## 7) Organization & Hierarchy (Notebooks, Sub-notebooks, Tags)

- Objective
  - Provide notebook hierarchy and tag system with advanced filtering and bulk operations.

- Scope (In/Out)
  - In: CRUD for notebooks/tags, nested structures, breadcrumbs, tag autocomplete, bulk ops

- Dependencies
  - SQLite schema and repositories for `notebooks`, `tags`, `note_tags`

- Data Model Changes
  - `notebooks.parent_id`, `tags.parent_id`, `note_tags` junction

- UI/UX Changes
  - Notebook sidebar/list, breadcrumbs, tag chips, bulk selection toolbar

- Implementation Steps
  1. Notebook management screens (create, rename, move, delete)
  2. Tagging UI with autocomplete and suggestions
  3. Bulk operations: select multiple notes → move/tag/delete
  4. Filtering: by notebook, tag, pinned, date

- Testing Plan
  - Unit: tree utilities for nested structures; bulk ops safety
  - Integration: move notes between nested notebooks; tag hierarchies

- Acceptance Criteria
  - Users can organize and find notes intuitively with nested notebooks and tags

- Metrics/Instrumentation
  - `organize_actions_count`, `filter_usage`

- Risks/Mitigations
  - Risk: Complex nesting bugs; Mitigation: invariants and tree validation

- Rollout/Rollback
  - No special flags; migrate progressively

---

## 8) Search (Text, OCR, Handwriting) and Advanced Filtering

- Objective
  - Provide fast, accurate search across text, OCR, and handwriting-derived text.

- Scope (In/Out)
  - In: Real-time suggestions, fuzzy matching, tag/date filters

- Dependencies
  - `notes_fts`, OCR pipelines from other features

- Data Model Changes
  - `notes_ocr_text` feeding FTS

- UI/UX Changes
  - Search bar with suggestions, filters panel, recent searches

- Implementation Steps
  1. Wire FTS to index `title`, `content`, `ocr_text`
  2. Implement suggestion service (prefix search + recent history)
  3. Fuzzy search option with configurable thresholds
  4. Filters: tags, date range, pinned, notebook

- Testing Plan
  - Unit: tokenizer, fuzzy scoring
  - Integration: OCR text presence → searchable results

- Acceptance Criteria
  - <200ms search responses for 10k+ notes; relevant results

- Metrics/Instrumentation
  - `search_response_time`, `search_usage`

- Risks/Mitigations
  - Risk: Large datasets; Mitigation: indices and pagination

- Rollout/Rollback
  - No special flags

---

## 9) Performance & Optimization

- Objective
  - Hit startup, memory, latency targets across common devices.

- Scope (In/Out)
  - In: Lazy loading, virtualization, caching, image optimization, background sync tuning

- Dependencies
  - Monitoring service and metrics

- Data Model Changes
  - None

- UI/UX Changes
  - None directly; ensure smooth interactions

- Implementation Steps
  1. Virtualize long lists; memoize item renderers
  2. Image caching and compression; responsive thumbnails
  3. Database query indices and prepared statements
  4. Background sync batching and backoff

- Testing Plan
  - Performance tests: cold/warm start, memory snapshots, list scroll FPS

- Acceptance Criteria
  - Meets targets in `TECHNICAL_SPECIFICATIONS.md` Performance section

- Metrics/Instrumentation
  - `app_startup_time`, `memory_usage`, `fps_scroll`

- Risks/Mitigations
  - Risk: Device variability; Mitigation: test matrix across low/mid/high tier

- Rollout/Rollback
  - Gradual rollout; monitor metrics

---

## 10) Testing & QA Strategy Enablement

- Objective
  - Ensure automation and coverage across unit, integration, and E2E with CI.

- Scope (In/Out)
  - In: Jest, RN Testing Library, Detox; CI integration

- Dependencies
  - GitHub Actions workflows, device/emulator configs

- Implementation Steps
  1. Configure Jest, coverage thresholds, and module mocks
  2. Build representative integration tests for repositories and sync
  3. Create Detox E2E smoke tests for core flows
  4. Wire CI to run all tiers on PRs and main branches

- Acceptance Criteria
  - >80% unit coverage; green CI; stable E2E smoke suite

---

## 11) Beta, Feedback, and Launch Readiness

- Objective
  - Validate with real users via TestFlight/Play Console and prepare for GA.

- Scope (In/Out)
  - In: Beta distribution, feedback capture, analytics, crash reporting, ASO assets, support docs

- Dependencies
  - Firebase Analytics, Crashlytics, store accounts

- Implementation Steps
  1. Configure analytics events and Crashlytics
  2. Build feedback capture UI
  3. Prepare store listings, screenshots, and keywords
  4. Set up support docs and FAQs

- Acceptance Criteria
  - Stable beta KPIs, crash rate <0.1%, readiness checklists met

---

# Execution Guidance

- Always keep `DEVELOPMENT_CHECKLIST.md` in sync with completed items.
- When adding new features, copy the template in this file and link to related sections in `PROJECT_PLAN.md` and `TECHNICAL_SPECIFICATIONS.md`.
- Track flags and rollout plans to reduce risk during releases.
