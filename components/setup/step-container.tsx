import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { FC, useRef } from "react"

interface StepContainerProps {
  stepDescription: string
  stepNum: number
  stepTitle: string
  totalSteps?: number
  onShouldProceed: (shouldProceed: boolean) => void
  children?: React.ReactNode
  showBackButton?: boolean
  showNextButton?: boolean
}

export const StepContainer: FC<StepContainerProps> = ({
  stepDescription,
  stepNum,
  stepTitle,
  totalSteps = 3,
  onShouldProceed,
  children,
  showBackButton = false,
  showNextButton = true
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (buttonRef.current) {
        buttonRef.current.click()
      }
    }
  }

  return (
    <Card
      className="max-h-[calc(100vh-60px)] w-[600px] overflow-auto border-[#E94560]/20 bg-[#1A1A2E]"
      onKeyDown={handleKeyDown}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-display text-xl text-[#F1F1F6]">{stepTitle}</span>
          <span className="text-sm text-[#6B6B7B]">
            {stepNum} / {totalSteps}
          </span>
        </CardTitle>
        <CardDescription className="text-[#A6A6B3]">
          {stepDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">{children}</CardContent>

      <CardFooter className="flex justify-end">
        <div>
          {showBackButton && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onShouldProceed(false)}
              className="border-[#A6A6B3]/20 text-[#A6A6B3] hover:bg-[#16213E] hover:text-[#F1F1F6]"
            >
              Back
            </Button>
          )}
        </div>
        <div>
          {showNextButton && (
            <Button
              ref={buttonRef}
              size="sm"
              onClick={() => onShouldProceed(true)}
              className="bg-[#E94560] text-white hover:bg-[#F05A73]"
            >
              Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
