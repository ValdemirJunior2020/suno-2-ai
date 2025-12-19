import { supabase } from "./supabase.js";

export async function isAdminEmail(email) {
  if (!email) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error) return false;
  return !!data?.email;
}
