@echo off
set NEXT_PUBLIC_GHOST_URL=https://top-contractors-denver-2.ghost.io
set NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY=6229b20c390c831641ea577093
set NEXT_PUBLIC_OLD_GHOST_URL=https://top-contractors-denver-1.ghost.io
set NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY=130d98b20875066982b1a8314f
ts-node scripts/migrate-ghost-to-supabase.ts