# Feature: Workspace

> **Status:** Deferred — Phase 1 (not in codebase yet)

## Feature Goal

Authenticated users create and switch workspaces; all project data is scoped by workspace slug with membership checks.

## User Flow

1. From dashboard → Create workspace (name → slug)
2. Open `/w/[slug]/...`
3. Switch workspace from sidebar/list
4. OWNER can rename/delete (settings); MEMBER can view/contribute per rules

## Business Rules

- Creator becomes `OWNER`
- Roles: `OWNER` | `MEMBER` only
- Slug unique; membership required for every slug-scoped query
- Guessing a slug without membership → 403/404 (no leak)

## UI Requirements

- [ ] Create workspace dialog/form
- [ ] Workspace list / switcher
- [ ] Empty state when user has zero workspaces

## API Requirements

- [ ] Create / list / get-by-slug / update / delete
- [ ] Always verify membership server-side

## Database Models

- `Workspace` (id, name, slug, createdAt)
- `Membership` (userId, workspaceId, role)

## Validation Rules

- Name: required
- Slug: lowercase kebab, unique, URL-safe

## Permission Rules

| Action | OWNER | MEMBER |
|--------|-------|--------|
| Read workspace | ✓ | ✓ |
| Update / delete workspace | ✓ | ✗ |
| Invite members | ✓ | TBD |

## State Management

- List: RSC or TanStack Query
- Active slug: URL param (source of truth)

## Pending Tasks

- [ ] Prisma models + migrate
- [ ] CRUD + authz helpers
- [ ] UI create + switcher

## Known Issues

- None yet

## Future Improvements

- Custom roles, workspace avatars, transfer ownership

## Checklist

- [ ] Create + open by slug
- [ ] Non-member cannot read
- [ ] OWNER-only delete
