declare module '*.module.css' {
  const c: Record<string, string>;
  export default c;
}
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_URL: string;
}
