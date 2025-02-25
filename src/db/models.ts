import { supabase } from "../lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "../supabase/types"

export const getModelById = async (modelId: string) => {
  const { data: model, error } = await supabase
    .from("models")
    .select("*")
    .eq("id", modelId)
    .single()

  if (!model) {
    throw new Error(error?.message)
  }

  return model
}

interface Model {
  api_key: string;
  base_url: string;
  context_length: number;
  created_at: string;
  description: string;
  folder_id: string | null;
  id: string;
  model_id: string;
  name: string;
  sharing: string;
  updated_at: string | null;
  user_id: string;
}

interface ModelWorkspace {
  model_id: string;
  models: Model;
}

export async function getModelWorkspacesByWorkspaceId(workspaceId: string): Promise<{ models: Model[] }> {
  const { data, error } = await supabase
    .from("model_workspaces")
    .select(`
      model_id,
      models (
        id,
        name,
        created_at,
        user_id
      )
    `)
    .eq("workspace_id", workspaceId);

  if (error) {
    console.error("Error fetching models:", error.message);
    throw error;
  }

  return { models: (data as ModelWorkspace[]).map(item => item.models) };
}

export const getModelWorkspacesByModelId = async (modelId: string) => {
  const { data: model, error } = await supabase
    .from("models")
    .select(
      `
      id, 
      name, 
      workspaces (*)
    `
    )
    .eq("id", modelId)
    .single()

  if (!model) {
    throw new Error(error?.message)
  }

  return model
}

export const createModel = async (
  model: TablesInsert<"models">,
  workspace_id: string
) => {
  const { data: createdModel, error } = await supabase
    .from("models")
    .insert([model])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  await createModelWorkspace({
    user_id: model.user_id,
    model_id: createdModel.id,
    workspace_id: workspace_id
  })

  return createdModel
}

export const createModels = async (
  models: TablesInsert<"models">[],
  workspace_id: string
) => {
  const { data: createdModels, error } = await supabase
    .from("models")
    .insert(models)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  await createModelWorkspaces(
    createdModels.map(model => ({
      user_id: model.user_id,
      model_id: model.id,
      workspace_id
    }))
  )

  return createdModels
}

export const createModelWorkspace = async (item: {
  user_id: string
  model_id: string
  workspace_id: string
}) => {
  const { data: createdModelWorkspace, error } = await supabase
    .from("model_workspaces")
    .insert([item])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdModelWorkspace
}

export const createModelWorkspaces = async (
  items: { user_id: string; model_id: string; workspace_id: string }[]
) => {
  const { data: createdModelWorkspaces, error } = await supabase
    .from("model_workspaces")
    .insert(items)
    .select("*")

  if (error) throw new Error(error.message)

  return createdModelWorkspaces
}

export const updateModel = async (
  modelId: string,
  model: TablesUpdate<"models">
) => {
  const { data: updatedModel, error } = await supabase
    .from("models")
    .update(model)
    .eq("id", modelId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedModel
}

export const deleteModel = async (modelId: string) => {
  const { error } = await supabase.from("models").delete().eq("id", modelId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const deleteModelWorkspace = async (
  modelId: string,
  workspaceId: string
) => {
  const { error } = await supabase
    .from("model_workspaces")
    .delete()
    .eq("model_id", modelId)
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(error.message)

  return true
}
