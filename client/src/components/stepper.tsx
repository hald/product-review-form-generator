import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: "input" | "form" | "success";
}

export default function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { id: "input", label: "Product Type", number: 1 },
    { id: "form", label: "Review Form", number: 2 },
    { id: "success", label: "Submission", number: 3 }
  ];

  // Function to determine if a step is active or completed
  const isActiveOrCompleted = (stepId: string) => {
    if (currentStep === "success") return true;
    if (currentStep === "form" && (stepId === "input" || stepId === "form")) return true;
    if (currentStep === "input" && stepId === "input") return true;
    return false;
  };

  return (
    <div className="mb-8">
      <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
        {steps.map((step, index) => (
          <li 
            key={step.id}
            className={cn(
              "flex md:w-full items-center",
              index < steps.length - 1 && 
                "sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10"
            )}
          >
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
              <span className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                isActiveOrCompleted(step.id) 
                  ? "bg-primary text-white" 
                  : "bg-gray-200 text-gray-500"
              )}>
                {step.number}
              </span>
              <span className="hidden sm:inline-flex sm:ml-2">{step.label}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
