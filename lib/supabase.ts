// lib/supabase.ts
//
// Thin re-export that forwards everything to the main client in
// lib/supabase-client.ts.  This guarantees a single source of truth
// for Supabase configuration and avoids missing-env errors.

export * from "./supabase-client"
