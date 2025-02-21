"use client"

import { Dashboard } from "../../components/ui/dashboard"
import { ChatbotUIContext } from "../../context/context"
import { getAssistantWorkspacesByWorkspaceId } from "../../db/assistants"
import { getChatsByWorkspaceId } from "../../db/chats"
import { getCollectionWorkspacesByWorkspaceId } from "../../db/collections"
import { getFileWorkspacesByWorkspaceId } from "../../db/files"
import { getFoldersByWorkspaceId } from "../../db/folders"
import { getModelWorkspacesByWorkspaceId } from "../../db/models"
import { getPresetWorkspacesByWorkspaceId } from "../../db/presets"
import { getPromptWorkspacesByWorkspaceId } from "../../db/prompts"
import { getAssistantImageFromStorage } from "../../db/storage/assistant-images"
import { getToolWorkspacesByWorkspaceId } from "../../db/tools"
import { getWorkspaceById } from "../../db/workspaces"
import { convertBlobToBase64 } from "../../lib/blob-to-b64"
import { supabase } from "../../lib/supabase/browser-client"
import { LLMID } from "../../types"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import Loading from "../loading"

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const router = useRouter()

  const params = useParams()
  const searchParams = useSearchParams()
  const workspaceId = params.workspaceid as string | undefined;

  const {
    setChatSettings,
    setAssistants,
    setAssistantImages,
    setChats,
    setCollections,
    setFolders,
    setFiles,
    setPresets,
    setPrompts,
    setTools,
    setModels,
    selectedWorkspace,
    setSelectedWorkspace,
    setSelectedChat,
    setChatMessages,
    setUserInput,
    setIsGenerating,
    setFirstTokenReceived,
    setChatFiles,
    setChatImages,
    setNewMessageFiles,
    setNewMessageImages,
    setShowFilesDisplay
  } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(true)

  // Utility to validate UUID
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
          return router.push("/login");
        }
  
        const session = data.session;
        if (!session) {
          return router.push("/login");
        }
  
        if (!workspaceId || !isValidUUID(workspaceId)) {
          console.error("Invalid workspaceId:", workspaceId);
          router.push("/workspaces");
        } else {
          await fetchWorkspaceData(workspaceId);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login"); // Redirect to login on any auth failure
      }
    })();
  }, [workspaceId, router])

  useEffect(() => {
    if (!workspaceId || !isValidUUID(workspaceId)) {
      console.error("Invalid workspaceId:", workspaceId);
      router.push("/workspaces");
      return;
    }

    (async () => {
      try {
        await fetchWorkspaceData(workspaceId);
      } catch (error) {
        console.error("Error fetching workspace data:", error);
        router.push("/workspaces");
      }
    })();

    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)
    setIsGenerating(false)
    setFirstTokenReceived(false)
    setChatFiles([])
    setChatImages([])
    setNewMessageFiles([])
    setNewMessageImages([])
    setShowFilesDisplay(false)
  }, [workspaceId])

  const fetchWorkspaceData = async (workspaceId: string) => {
    if (!isValidUUID(workspaceId)) {
      console.error("fetchWorkspaceData called with invalid workspaceId:", workspaceId);
      router.push("/workspaces");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const workspace = await getWorkspaceById(workspaceId);
      if (!workspace) {
        console.error("Workspace not found for ID:", workspaceId);
        router.push("/workspaces");
        return;
      }
      setSelectedWorkspace(workspace);
      const assistantData = await getAssistantWorkspacesByWorkspaceId(workspaceId);
      setAssistants(assistantData.assistants);
      for (const assistant of assistantData.assistants) {
        let url = "";
        if (assistant.image_path) {
          url = (await getAssistantImageFromStorage(assistant.image_path)) || "";
        }
        if (url) {
          const response = await fetch(url);
          const blob = await response.blob();
          const base64 = await convertBlobToBase64(blob);
          setAssistantImages((prev) => [
            ...prev,
            { assistantId: assistant.id, path: assistant.image_path, base64, url },
          ]);
        } else {
          setAssistantImages((prev) => [
            ...prev,
            { assistantId: assistant.id, path: assistant.image_path, base64: "", url },
          ]);
        }
      }
      const chats = await getChatsByWorkspaceId(workspaceId);
      setChats(chats);
      const collectionData = await getCollectionWorkspacesByWorkspaceId(workspaceId);
      setCollections(collectionData.collections);
      const folders = await getFoldersByWorkspaceId(workspaceId);
      setFolders(folders);
      const fileData = await getFileWorkspacesByWorkspaceId(workspaceId);
      setFiles(fileData.files);
      const presetData = await getPresetWorkspacesByWorkspaceId(workspaceId);
      setPresets(presetData.presets);
      const promptData = await getPromptWorkspacesByWorkspaceId(workspaceId);
      setPrompts(promptData.prompts);
      const toolData = await getToolWorkspacesByWorkspaceId(workspaceId);
      setTools(toolData.tools);
      const modelData = await getModelWorkspacesByWorkspaceId(workspaceId);
      setModels(modelData.models);
      setChatSettings({
        model: (workspace?.default_model || "gpt-4-1106-preview") as LLMID,
        prompt: workspace?.default_prompt || "You are a friendly, helpful AI assistant.",
        temperature: workspace?.default_temperature || 0.5,
        contextLength: workspace?.default_context_length || 4096,
        includeProfileContext: workspace?.include_profile_context || true,
        includeWorkspaceInstructions: workspace?.include_workspace_instructions || true,
        embeddingsProvider: (workspace?.embeddings_provider as "openai" | "local") || "openai",
      });
    } catch (error) {
      console.error("Error in fetchWorkspaceData:", error);
      router.push("/workspaces");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !workspaceId || workspaceId === "undefined") {
    return <Loading />
  }

  return <Dashboard>{children}</Dashboard>
}
