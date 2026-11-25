#!/usr/bin/env node
/* global process, console */
// frame-supabase sync [project dir, default .]
// Copies Frame's migration and Edge Functions into <dir>/supabase/{migrations,functions}. Safe to run again: files
// are overwritten with Frame's version, nothing else is touched. Commit the result in the app.
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [cmd, dir = '.'] = process.argv.slice(2);
if (cmd !== 'sync') {
  console.log('Usage: frame-supabase sync [project dir]');
  process.exit(cmd ? 1 : 0);
}
const src = join(dirname(fileURLToPath(import.meta.url)), '..', 'backend');
const dest = join(resolve(dir), 'supabase');
if (!existsSync(dest)) {
  console.error(`No supabase/ folder in ${resolve(dir)}. Run "supabase init" there first.`);
  process.exit(1);
}
for (const part of ['migrations', 'functions']) {
  mkdirSync(join(dest, part), { recursive: true });
  for (const name of readdirSync(join(src, part))) {
    cpSync(join(src, part, name), join(dest, part, name), { recursive: true });
    console.log(`supabase/${part}/${name}`);
  }
}
console.log(
  '\nNext: supabase db push; supabase functions deploy frame-checkout frame-portal; supabase functions deploy frame-stripe-webhook --no-verify-jwt',
);
