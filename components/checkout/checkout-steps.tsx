"use client"

import { CheckCircle2 } from "lucide-react"

interface CheckoutStepsProps {
  currentStep: number
  steps: { id: number; title: string }[]
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step.id ? "bg-pink-500 border-pink-500 text-white" : "border-gray-300 text-gray-300"
              }`}
            >
              {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <span>{step.id}</span>}
            </div>
            <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? "text-pink-500" : "text-gray-500"}`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-10 w-[calc(100vw/4-2.5rem)] h-0.5 ${
                  currentStep > step.id ? "bg-pink-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
