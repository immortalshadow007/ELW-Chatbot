import { supabase } from "../lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "../supabase/types"

export const getChatById = async (chatId: string) => {
  const { data: chat, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .maybeSingle()
  
  if (error) {
    console.error("Error fetching chat by ID:", error);
    throw new Error(error.message);
  }

  return chat
}

export const getChatsByWorkspaceId = async (workspaceId: string) => {
  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching chats by workspace ID:", error);
    throw new Error(error.message);
  }

  return chats || [];
}

export const createChat = async (chat: TablesInsert<"chats">) => {
  const { data: createdChat, error } = await supabase
    .from("chats")
    .insert([chat])
    .select("*")
    .single()

  if (error) {
    console.error("Error creating chat:", error);
    throw new Error(error.message);
  }

  return createdChat;
}

export const createChats = async (chats: TablesInsert<"chats">[]) => {
  const { data: createdChats, error } = await supabase
    .from("chats")
    .insert(chats)
    .select("*")

  if (error) {
    console.error("Error creating multiple chats:", error);
    throw new Error(error.message);
  }

  return createdChats
}

export const updateChat = async (
  chatId: string,
  chat: TablesUpdate<"chats">
) => {
  const { data: updatedChat, error } = await supabase
    .from("chats")
    .update(chat)
    .eq("id", chatId)
    .select("*")
    .single()

  if (error) {
    console.error("Error creating multiple chats:", error);
    throw new Error(error.message);
  }

  return updatedChat;
}

export const deleteChat = async (chatId: string) => {
  const { error } = await supabase.from("chats").delete().eq("id", chatId);

  if (error) {
    console.error("Error deleting chat:", error);
    throw new Error(error.message)
  }

  return true;
}
