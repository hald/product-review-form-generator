import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { FormStructure } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ProductTypeFormProps {
  productType: string;
  setProductType: (value: string) => void;
  onFormGenerated: (productType: string, formStructure: FormStructure) => void;
}

export default function ProductTypeForm({ 
  productType, 
  setProductType, 
  onFormGenerated 
}: ProductTypeFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const generateFormMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await apiRequest("POST", "/api/form-structure", { productType: type });
      return response.json() as Promise<FormStructure>;
    },
    onSuccess: (data) => {
      onFormGenerated(productType, data);
    },
    onError: (error) => {
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate form. Please try again.");
      toast({
        variant: "destructive",
        title: "Form Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate form. Please try again."
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productType.trim()) {
      setErrorMessage("Please enter a product type");
      return;
    }
    
    setErrorMessage("");
    generateFormMutation.mutate(productType);
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm transition-all duration-300">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">What product are you reviewing?</h2>
          <p className="text-gray-600">
            Enter the product type (e.g., smartphone, coffee maker, headphones) to generate a custom review form.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <div className="relative">
              <Input
                id="product-type"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="peer block w-full px-4 py-6 text-gray-900 border border-gray-300 rounded-lg bg-transparent focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none"
                placeholder=" "
                required
              />
              <Label
                htmlFor="product-type"
                className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Product Type
              </Label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg shadow hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 focus:outline-none transition duration-150 flex items-center"
              disabled={generateFormMutation.isPending}
            >
              {generateFormMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate Review Form</span>
              )}
            </Button>
          </div>
        </form>

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
