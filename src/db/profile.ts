import { supabase } from "../lib/supabase/browser-client"
import { Tables, TablesInsert, TablesUpdate } from "../supabase/types"

export const getProfileByUserId = async (userId: string) => {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId) as { data: Tables<"profiles">[] | null, error: any };

    if (error) {
      throw new Error(error.message);
    }
  
    if (!profiles || profiles.length === 0) {
      return null;
    } else if (profiles.length > 1) {
      // Multiple profiles found; log a warning and use the first one
      console.warn(`Multiple profiles found for user ${userId}. Using the first one.`);
      return profiles[0];
    } else {
      // Exactly one profile found
      return profiles[0];
    }
  };

export const getProfilesByUserId = async (userId: string) => {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)

  if (!profiles) {
    throw new Error(error.message)
  }

  return profiles
}

export const createProfile = async (profile: TablesInsert<"profiles">) => {
  const { data: createdProfile, error } = await supabase
    .from("profiles")
    .insert([profile])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdProfile
}

export const updateProfile = async (
  profileId: string,
  profile: TablesUpdate<"profiles">
) => {
  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", profileId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedProfile
}

export const deleteProfile = async (profileId: string) => {
  const { error } = await supabase.from("profiles").delete().eq("id", profileId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
