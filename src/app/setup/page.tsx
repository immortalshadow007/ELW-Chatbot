"use client";

import { ChatbotUIContext } from "../../context/context";
import { getProfileByUserId, createProfile, updateProfile } from "../../db/profile";
import {
  getHomeWorkspaceByUserId,
  getWorkspacesByUserId,
  createWorkspace
} from "../../db/workspaces";
import {
  fetchHostedModels,
  fetchOpenRouterModels
} from "../../lib/models/fetch-models";
import { supabase } from "../../lib/supabase/browser-client";
import { TablesInsert, TablesUpdate } from "../../supabase/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { APIStep } from "../../components/setup/api-step";
import { FinishStep } from "../../components/setup/finish-step";
import { ProfileStep } from "../../components/setup/profile-step";
import {
  SETUP_STEP_COUNT,
  StepContainer
} from "../../components/setup/step-container";

export default function SetupPage() {
  const {
    profile,
    setProfile,
    setWorkspaces,
    setSelectedWorkspace,
    setEnvKeyMap,
    setAvailableHostedModels,
    setAvailableOpenRouterModels
  } = useContext(ChatbotUIContext);

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Profile Step
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState(profile?.username || "");
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  // API Step
  const [useAzureOpenai, setUseAzureOpenai] = useState(false);
  const [openaiAPIKey, setOpenaiAPIKey] = useState("");
  const [openaiOrgID, setOpenaiOrgID] = useState("");
  const [azureOpenaiAPIKey, setAzureOpenaiAPIKey] = useState("");
  const [azureOpenaiEndpoint, setAzureOpenaiEndpoint] = useState("");
  const [azureOpenai35TurboID, setAzureOpenai35TurboID] = useState("");
  const [azureOpenai45TurboID, setAzureOpenai45TurboID] = useState("");
  const [azureOpenai45VisionID, setAzureOpenai45VisionID] = useState("");
  const [azureOpenaiEmbeddingsID, setAzureOpenaiEmbeddingsID] = useState("");
  const [anthropicAPIKey, setAnthropicAPIKey] = useState("");
  const [googleGeminiAPIKey, setGoogleGeminiAPIKey] = useState("");
  const [mistralAPIKey, setMistralAPIKey] = useState("");
  const [groqAPIKey, setGroqAPIKey] = useState("");
  const [perplexityAPIKey, setPerplexityAPIKey] = useState("");
  const [openrouterAPIKey, setOpenrouterAPIKey] = useState("");

  useEffect(() => {
    (async () => {
      const session = (await supabase.auth.getSession()).data.session;
      console.log("Session:", session);

      if (!session) {
        return router.push("/login");
      }

      const user = session.user;
      let profile = await getProfileByUserId(user.id);
      console.log("Profile:", profile);

      if (profile) {
        setProfile(profile);
        setUsername(profile.username);
        if (profile.has_onboarded) {
          const data = await fetchHostedModels(profile);
          if (!data) return;

          setEnvKeyMap(data.envKeyMap);
          setAvailableHostedModels(data.hostedModels);

          if (profile.openrouter_api_key || data.envKeyMap["openrouter"]) {
            const openRouterModels = await fetchOpenRouterModels();
            if (!openRouterModels) return;
            setAvailableOpenRouterModels(openRouterModels);
          }

          const homeWorkspaceId = await getHomeWorkspaceByUserId(user.id);
          return router.push(`/${homeWorkspaceId}/chat`);
        }
      }

      setLoading(false);
    })();
  }, [router, setProfile, setUsername, setEnvKeyMap, setAvailableHostedModels, setAvailableOpenRouterModels]);

  const handleShouldProceed = async (proceed: boolean) => {
    if (proceed) {
      if (currentStep === 1) {
        const session = (await supabase.auth.getSession()).data.session;
        console.log("Session:", session);
        if (!session) {
          return router.push("/login");
        }

        const user = session.user;
        let profile = await getProfileByUserId(user.id);
        console.log("Profile:", profile);

        if (!profile) {
          try {
            const newProfile: TablesInsert<"profiles"> = {
              user_id: user.id,
              username,
              display_name: displayName || username,
              has_onboarded: false,
              use_azure_openai: false,
              bio: "",
              image_path: "",
              image_url: "",
              profile_context: ""
            };
            profile = await createProfile(newProfile);
            setProfile(profile);
          } catch (error) {
            console.error("Failed to create profile:", error);
            alert("Error creating profile. Please try again.");
            return;
          }
        }
      }

      if (currentStep === SETUP_STEP_COUNT) {
        await handleSaveSetupSetting();
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveSetupSetting = async () => {
    const session = (await supabase.auth.getSession()).data.session;
    console.log("Session:", session);
    if (!session) {
      return router.push("/login");
    }

    const user = session.user;
    let profile = await getProfileByUserId(user.id);
    console.log("Profile:", profile);

    if (!profile) {
      const newProfile: TablesInsert<"profiles"> = {
        user_id: user.id,
        username,
        display_name: displayName || username,
        has_onboarded: true,
        use_azure_openai: false,
        bio: "",
        image_path: "",
        image_url: "",
        profile_context: ""
      };
      try {
        profile = await createProfile(newProfile);
        setProfile(profile);
      } catch (error) {
        console.error("Profile creation failed:", error);
        alert("Failed to create profile. Please try again.");
        return router.push("/login");
      }
    }

    const updateProfilePayload: TablesUpdate<"profiles"> = {
      ...profile,
      has_onboarded: true,
      display_name: displayName,
      username,
      openai_api_key: openaiAPIKey,
      openai_organization_id: openaiOrgID,
      anthropic_api_key: anthropicAPIKey,
      google_gemini_api_key: googleGeminiAPIKey,
      mistral_api_key: mistralAPIKey,
      llama_api_key: groqAPIKey,
      perplexity_api_key: perplexityAPIKey,
      openrouter_api_key: openrouterAPIKey,
      use_azure_openai: useAzureOpenai,
      azure_openai_api_key: azureOpenaiAPIKey,
      azure_openai_endpoint: azureOpenaiEndpoint,
      azure_openai_35_turbo_id: azureOpenai35TurboID,
      azure_openai_45_turbo_id: azureOpenai45TurboID,
      azure_openai_45_vision_id: azureOpenai45VisionID,
      azure_openai_embeddings_id: azureOpenaiEmbeddingsID
    };

    try {
      const updatedProfile = await updateProfile(profile.id, updateProfilePayload);
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile. Please try again.");
      return router.push("/login");
    }

    let workspaces = await getWorkspacesByUserId(profile.user_id);
    let homeWorkspace = workspaces.find(w => w.is_home);

    // Create a default home workspace if none exists
    if (!homeWorkspace) {
      const newWorkspace: TablesInsert<"workspaces"> = {
        user_id: profile.user_id,
        name: "Default Workspace",
        is_home: true,
        created_at: new Date().toISOString(),
        default_context_length: 0,
        default_model: "",
        default_prompt: "",
        default_temperature: 0,
        description: "",
        embeddings_provider: "",
        include_profile_context: false,
        include_workspace_instructions: false,
        instructions: ""
      };
      try {
        homeWorkspace = await createWorkspace(newWorkspace);
        workspaces = [...workspaces, homeWorkspace];
      } catch (error) {
        console.error("Workspace creation failed:", error);
        alert("Failed to create a workspace. Please try again.");
        return router.push("/login");
      }
    }

    setSelectedWorkspace(homeWorkspace);
    setWorkspaces(workspaces);

    if (!homeWorkspace?.id) {
      console.error("Home workspace ID is undefined after creation");
      return router.push("/login");
    }

    return router.push(`/${homeWorkspace.id}/chat`);
  };

  const renderStep = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return (
          <StepContainer
            stepDescription="Let's create your profile."
            stepNum={currentStep}
            stepTitle="Welcome to Chatbot UI"
            onShouldProceed={handleShouldProceed}
            showNextButton={!!(username && usernameAvailable)}
            showBackButton={false}
          >
            <ProfileStep
              username={username}
              usernameAvailable={usernameAvailable}
              displayName={displayName}
              onUsernameAvailableChange={setUsernameAvailable}
              onUsernameChange={setUsername}
              onDisplayNameChange={setDisplayName}
            />
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer
            stepDescription="Enter API keys for each service you'd like to use."
            stepNum={currentStep}
            stepTitle="Set API Keys (optional)"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <APIStep
              openaiAPIKey={openaiAPIKey}
              openaiOrgID={openaiOrgID}
              azureOpenaiAPIKey={azureOpenaiAPIKey}
              azureOpenaiEndpoint={azureOpenaiEndpoint}
              azureOpenai35TurboID={azureOpenai35TurboID}
              azureOpenai45TurboID={azureOpenai45TurboID}
              azureOpenai45VisionID={azureOpenai45VisionID}
              azureOpenaiEmbeddingsID={azureOpenaiEmbeddingsID}
              anthropicAPIKey={anthropicAPIKey}
              googleGeminiAPIKey={googleGeminiAPIKey}
              mistralAPIKey={mistralAPIKey}
              groqAPIKey={groqAPIKey}
              perplexityAPIKey={perplexityAPIKey}
              useAzureOpenai={useAzureOpenai}
              onOpenaiAPIKeyChange={setOpenaiAPIKey}
              onOpenaiOrgIDChange={setOpenaiOrgID}
              onAzureOpenaiAPIKeyChange={setAzureOpenaiAPIKey}
              onAzureOpenaiEndpointChange={setAzureOpenaiEndpoint}
              onAzureOpenai35TurboIDChange={setAzureOpenai35TurboID}
              onAzureOpenai45TurboIDChange={setAzureOpenai45TurboID}
              onAzureOpenai45VisionIDChange={setAzureOpenai45VisionID}
              onAzureOpenaiEmbeddingsIDChange={setAzureOpenaiEmbeddingsID}
              onAnthropicAPIKeyChange={setAnthropicAPIKey}
              onGoogleGeminiAPIKeyChange={setGoogleGeminiAPIKey}
              onMistralAPIKeyChange={setMistralAPIKey}
              onGroqAPIKeyChange={setGroqAPIKey}
              onPerplexityAPIKeyChange={setPerplexityAPIKey}
              onUseAzureOpenaiChange={setUseAzureOpenai}
              openrouterAPIKey={openrouterAPIKey}
              onOpenrouterAPIKeyChange={setOpenrouterAPIKey}
            />
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer
            stepDescription="You are all set up!"
            stepNum={currentStep}
            stepTitle="Setup Complete"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <FinishStep displayName={displayName} />
          </StepContainer>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex h-full items-center justify-center">
      {renderStep(currentStep)}
    </div>
  );
}