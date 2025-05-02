import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Stepper from "@/components/stepper";
import ProductTypeForm from "@/components/product-type-form";
import DynamicReviewForm from "@/components/dynamic-review-form";
import SuccessMessage from "@/components/success-message";
import HelpModal from "@/components/help-modal";
import { FormStructure } from "@shared/schema";

type Step = "input" | "form" | "success";

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [productType, setProductType] = useState("");
  const [formStructure, setFormStructure] = useState<FormStructure | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  const toggleHelpModal = () => {
    setIsHelpModalOpen(!isHelpModalOpen);
  };
  
  const handleStartNewReview = () => {
    setStep("input");
    setProductType("");
    setFormStructure(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleHelp={toggleHelpModal} />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6">
        <Stepper currentStep={step} />
        
        {step === "input" && (
          <ProductTypeForm
            productType={productType}
            setProductType={setProductType}
            onFormGenerated={(type, structure) => {
              setProductType(type);
              setFormStructure(structure);
              setStep("form");
            }}
          />
        )}
        
        {step === "form" && (
          <DynamicReviewForm
            productType={productType}
            formStructure={formStructure}
            onBack={() => setStep("input")}
            onSuccess={() => setStep("success")}
          />
        )}
        
        {step === "success" && (
          <SuccessMessage 
            productType={productType} 
            onStartNewReview={handleStartNewReview} 
          />
        )}
      </main>
      
      <Footer />
      
      <HelpModal isOpen={isHelpModalOpen} onClose={toggleHelpModal} />
    </div>
  );
}
