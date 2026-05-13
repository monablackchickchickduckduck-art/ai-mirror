"use client"

import { ChatbotUIContext } from "@/context/context"
import { getProfileByUserId, updateProfile } from "@/db/profile"
import {
  getHomeWorkspaceByUserId,
  getWorkspacesByUserId
} from "@/db/workspaces"
import { supabase } from "@/lib/supabase/browser-client"
import { TablesUpdate } from "@/supabase/types"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { OnboardingStep } from "../../../components/setup/onboarding-step"
import { ProfileStep } from "../../../components/setup/profile-step"
import { StepContainer } from "../../../components/setup/step-container"

const TOTAL_STEPS = 2

export default function SetupPage() {
  const {
    profile,
    setProfile,
    setWorkspaces,
    setSelectedWorkspace
  } = useContext(ChatbotUIContext)

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  // Profile state
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState(true)

  // Onboarding state
  const [occupation, setOccupation] = useState("")
  const [whatDrains, setWhatDrains] = useState("")
  const [supportPreference, setSupportPreference] = useState("listen")
  const [relationships, setRelationships] = useState("")

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        return router.push("/login")
      }

      const user = session.user
      const profile = await getProfileByUserId(user.id)
      setProfile(profile)
      setUsername(profile.username || "")
      setDisplayName(profile.display_name || "")

      if (!profile.has_onboarded) {
        setLoading(false)
      } else {
        const homeWorkspaceId = await getHomeWorkspaceByUserId(session.user.id)
        return router.push(`/${homeWorkspaceId}/chat`)
      }
    })()
  }, [])

  const handleShouldProceed = (proceed: boolean) => {
    if (proceed) {
      if (currentStep === TOTAL_STEPS) {
        saveOnboarding()
      } else {
        setCurrentStep(c => c + 1)
      }
    } else {
      setCurrentStep(c => c - 1)
    }
  }

  const saveOnboarding = async () => {
    const session = (await supabase.auth.getSession()).data.session
    if (!session) {
      return router.push("/login")
    }

    const profileData = await getProfileByUserId(session.user.id)

    const structuredMemory = {
      name: displayName || profile?.display_name || "Friend",
      occupation,
      what_drains: whatDrains,
      support_preference: supportPreference,
      relationships,
      communication_style: "warm",
      last_check_in: "",
      created_at: new Date().toISOString()
    }

    const updatePayload: TablesUpdate<"profiles"> = {
      ...profileData,
      has_onboarded: true,
      display_name: displayName || profile?.display_name || "Friend",
      username,
      structured_memory: structuredMemory as any
    }

    const updatedProfile = await updateProfile(profileData.id, updatePayload)
    setProfile(updatedProfile)

    const workspaces = await getWorkspacesByUserId(profileData.user_id)
    const homeWorkspace = workspaces.find(w => w.is_home)
    setSelectedWorkspace(homeWorkspace!)
    setWorkspaces(workspaces)

    return router.push(`/${homeWorkspace?.id}/chat`)
  }

  const renderStep = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return (
          <StepContainer
            stepDescription="What should Mira call you?"
            stepNum={currentStep}
            stepTitle="Meet AI Mirror"
            totalSteps={TOTAL_STEPS}
            onShouldProceed={handleShouldProceed}
            showNextButton={!!displayName}
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
        )
      case 2:
        return (
          <StepContainer
            stepDescription="Help Mira understand you so she can truly know you."
            stepNum={currentStep}
            stepTitle="Tell Mira About You"
            totalSteps={TOTAL_STEPS}
            onShouldProceed={handleShouldProceed}
            showNextButton={false}
            showBackButton={true}
          >
            <OnboardingStep
              displayName={displayName}
              occupation={occupation}
              whatDrains={whatDrains}
              supportPreference={supportPreference}
              relationships={relationships}
              onOccupationChange={setOccupation}
              onWhatDrainsChange={setWhatDrains}
              onSupportPreferenceChange={setSupportPreference}
              onRelationshipsChange={setRelationships}
              onComplete={() => {}}
              onBack={() => handleShouldProceed(false)}
            />
          </StepContainer>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[#A6A6B3]">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-full items-center justify-center">
      {renderStep(currentStep)}
    </div>
  )
}
