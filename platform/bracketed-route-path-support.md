# Bracketed Next.js route path support note

Confirmed frontend file path:

- `workspace/frontend/app/review/[roomId]/page.tsx`

Confirmed parent directories:

- `workspace/frontend/app/review/`
- `workspace/frontend/app/review/[roomId]/`

## Safe access pattern

Treat `[roomId]` as a literal directory name, not a glob or placeholder, when reading or patching the file.

Reliable full path:

- `workspace/frontend/app/review/[roomId]/page.tsx`

Reliable stepwise access pattern:

1. Read/list `workspace/frontend/app/review/`
2. Read/list `workspace/frontend/app/review/[roomId]/`
3. Read or patch `workspace/frontend/app/review/[roomId]/page.tsx`

## Workaround for bracketed-route read/patch failures

If a direct single-shot read of the full file path fails or gets truncated around the bracketed segment:

- first target the parent directory `workspace/frontend/app/review/`
- then target the literal child directory `workspace/frontend/app/review/[roomId]/`
- then target `workspace/frontend/app/review/[roomId]/page.tsx`

Do not rewrite the path to remove brackets or substitute a concrete ID. The checked-in Next.js app-route folder is literally named `[roomId]`.

## Verified workspace state

The workspace tree currently includes:

- `workspace/frontend/app/review/[roomId]/page.tsx`
- size reported in the tree: `7998 B`

This note is intended as the reusable platform workaround for future reads/patches on bracketed Next.js route segments.