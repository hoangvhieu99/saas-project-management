# Feature: Profile

> **Status:** Deferred — Phase 1 / 4 (not in codebase yet)

## Feature Goal

Users view and update their own profile (name, image URL) used across assignees and topbar.

## User Flow

1. Open Profile from user menu
2. Edit name / avatar URL
3. Save → session/UI reflects change

## Business Rules

- Users edit only their own profile
- Email change out of scope for MVP (or read-only)

## UI Requirements

- [ ] Profile form (RHF + Zod)
- [ ] Avatar preview
- [ ] Success / error toast

## API Requirements

- [ ] `PATCH` current user profile
- [ ] Auth required

## Database Models

- `User` name, image fields

## Validation Rules

- Name: required, max length TBD
- Image: URL optional / empty allowed

## Permission Rules

- Authenticated; self only

## State Management

- Form local; on success update session/query cache

## Pending Tasks

- [ ] Profile page + action
- [ ] Topbar avatar binding
- [ ] Extend in Phase 3 polish

## Known Issues

- None yet

## Future Improvements

- Avatar file upload, email change with verification

## Checklist

- [ ] Update name persists after refresh
- [ ] Cannot edit another user
