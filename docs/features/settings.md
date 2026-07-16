# Feature: Settings

> **Status:** Deferred — Phase 4 (not in codebase yet)

## Feature Goal

Workspace and account settings: rename workspace, danger-zone delete (OWNER), and account preferences linked to Profile.

## User Flow

1. Open Settings inside `/w/[slug]/settings`
2. OWNER renames workspace / updates slug (careful redirects)
3. OWNER deletes workspace (confirm)
4. Account section links to Profile

## Business Rules

- Delete workspace is OWNER-only and destructive (cascade TBD)
- MEMBER can view limited settings or is redirected
- Slug change must keep uniqueness

## UI Requirements

- [ ] General form (name, slug)
- [ ] Danger zone with confirm dialog
- [ ] Clear permission messaging for MEMBER

## API Requirements

- [ ] Update workspace
- [ ] Delete workspace
- [ ] Authz checks documented in API.md

## Database Models

- `Workspace`, cascade to projects/tasks TBD in Prisma

## Validation Rules

- Same as workspace name/slug rules
- Delete requires confirm string TBD (e.g. type slug)

## Permission Rules

| Action | OWNER | MEMBER |
|--------|-------|--------|
| View settings | ✓ | limited / ✗ |
| Update workspace | ✓ | ✗ |
| Delete workspace | ✓ | ✗ |

## State Management

- Form local; mutate + redirect on delete

## Pending Tasks

- [ ] Settings pages
- [ ] Cascade delete strategy (ADR)
- [ ] Wire Profile subsection

## Known Issues

- None yet

## Future Improvements

- Audit log, transfer ownership, workspace branding

## Checklist

- [ ] OWNER rename works
- [ ] MEMBER cannot delete
- [ ] Delete redirects to dashboard
