# Dashboard Functional QA & Fix Plan

## Step 1: Inventory & audit (no code changes)
- [x] Read all remaining pages: UsersPage, ReportsPage, SettingsPage, SecurityPage, NotificationsPage, DigitalTwinsPage, TwinDetailPage, PreferencesPage.
- [x] Read dashboard subcomponents: TwinVisualizer, SimulationPipeline, SystemHealth, ActivityFeed, MetricCard.
- [x] Identify every clickable UI element that currently has no meaningful behavior (toast-only, inert buttons, missing route targets, etc.).

## Step 2: Implement fixes (meaningful behavior, not placeholders)
- [ ] Fix navigation consistency: verify every sidebar/href route exists.
- [ ] Replace toast-only actions with real in-page behavior or navigation.
- [ ] Implement working filtering/search controls.
- [ ] Implement working modals (open/close, state).
- [ ] Implement simulation controls with consistent UI state updates.
- [ ] Ensure AI Systems actions update UI state (details/modal or list state).

## Step 3: Dashboard-wide functional QA pass
- [ ] Re-audit all pages for inert clickable elements.
- [ ] Run typecheck/build/lint.

## Step 4: Final report
- [ ] Summarize what was fixed and where.

