"use client"

import { IconArrowRight, IconSparkles } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "sonner"
import { supabase } from "@/lib/supabase/browser-client"
import { TablesUpdate } from "@/supabase/types"
import { Button } from "@/components/ui/button"
import Input from "@/components/ui/input"
import { useContext } from "react"
import { ChatbotUIContext } from "@/context/context"

const STEPS = [
  {
    number: 1,
    title: "What drains you?",
    description: "I'll read between the lines so you don't have to repeat yourself.",
    placeholder: "e.g. Deadlines at work, feeling stuck in my career..."
  },
  {
    number: 2,
    title: "How should Mira help?",
    description: "When you're struggling, what's most useful?",
    options: [
      { value: "listen", label: "Just listen first", icon: "👂" },
      { value: "help", label: "Jump in with solutions", icon: "🛠️" },
      { value: "distract", label: "Cheer me up first", icon: "✨" }
    ]
  },
  {
    number: 3,
    title: "Who's important to you?",
    description: "Optional — so I can remember the people in your life.",
    placeholder: "e.g. My sister Maya, my cat Mochi..."
  }
]

interface OnboardingStepProps {
  displayName: string
  occupation: string
  whatDrains: string
  supportPreference: string
  relationships: string
  onOccupationChange: (v: string) => void
  onWhatDrainsChange: (v: string) => void
  onSupportPreferenceChange: (v: string) => void
  onRelationshipsChange: (v: string) => void
  onComplete: () => void
  onBack: () => void
}

export function OnboardingStep({
  displayName,
  occupation,
  whatDrains,
  supportPreference,
  relationships,
  onOccupationChange,
  onWhatDrainsChange,
  onSupportPreferenceChange,
  onRelationshipsChange,
  onComplete,
  onBack
}: OnboardingStepProps) {
  const router = useRouter()
  const { profile, setProfile } = useContext(ChatbotUIContext)
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const step = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1
  const canProceed =
    currentStep === 0
      ? whatDrains.trim().length > 0
      : currentStep === 1
      ? supportPreference.length > 0
      : true

  const handleNext = () => {
    if (!canProceed) return
    if (isLastStep) {
      saveProfile()
    } else {
      setCurrentStep(c => c + 1)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const session = (await supabase.auth.getSession()).data.session
      if (!session) {
        router.push("/login")
        return
      }

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

      const payload: TablesUpdate<"profiles"> = {
        ...profile!,
        has_onboarded: true,
        display_name: displayName || profile?.display_name || "Friend",
        structured_memory: structuredMemory as any
      }

      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("user_id", session.user.id)

      if (error) throw error

      toast("✨ Mira is ready to meet you.")
      onComplete()
    } catch (err: any) {
      toast.error("Couldn't save — " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === currentStep
                ? "w-6 bg-[#E94560]"
                : i < currentStep
                ? "bg-[#E94560]"
                : "bg-[#6B6B7B]"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="space-y-4">
        {currentStep === 0 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#A6A6B3]">
                What's your role or occupation? (optional)
              </label>
              <Input
                placeholder="e.g. Software engineer, mother of two..."
                value={occupation}
                onChange={e => onOccupationChange(e.target.value)}
                className="border-[#A6A6B3]/20 bg-[#0D0D1A] text-[#F1F1F6] placeholder:text-[#6B6B7B]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#A6A6B3]">
                {step.description}
              </label>
              <textarea
                placeholder={step.placeholder}
                value={whatDrains}
                onChange={e => onWhatDrainsChange(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#A6A6B3]/20 bg-[#0D0D1A] p-3 text-[#F1F1F6] placeholder:text-[#6B6B7B] focus:border-[#E94560]/50 focus:outline-none focus:ring-1 focus:ring-[#E94560]/20 resize-none"
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-[#A6A6B3]">{step.description}</p>
            <div className="grid gap-3">
              {step.options?.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onSupportPreferenceChange(opt.value)}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                    supportPreference === opt.value
                      ? "border-[#E94560] bg-[#E94560]/10 text-[#F1F1F6]"
                      : "border-[#A6A6B3]/20 text-[#A6A6B3] hover:border-[#E94560]/30"
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#A6A6B3]">
              {step.description}
            </label>
            <textarea
              placeholder={step.placeholder}
              value={relationships}
              onChange={e => onRelationshipsChange(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#A6A6B3]/20 bg-[#0D0D1A] p-3 text-[#F1F1F6] placeholder:text-[#6B6B7B] focus:border-[#E94560]/50 focus:outline-none focus:ring-1 focus:ring-[#E94560]/20 resize-none"
            />
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex gap-3">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-[#A6A6B3] hover:bg-[#1A1A2E] hover:text-[#F1F1F6]"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed || saving}
          className="flex-1 flex items-center justify-center gap-2 bg-[#E94560] text-white hover:bg-[#F05A73] disabled:opacity-50"
        >
          {saving ? "Saving..." : isLastStep ? "Meet Mira" : "Continue"}
          <IconArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
