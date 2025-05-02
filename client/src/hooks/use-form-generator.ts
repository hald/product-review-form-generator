import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FormStructure } from "@shared/schema";

export function useFormGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFormMutation = useMutation({
    mutationFn: async (productType: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiRequest("POST", "/api/form-structure", { productType });
        const data = await response.json() as FormStructure;
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to generate form structure";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    generateForm: generateFormMutation.mutate,
    isLoading: isLoading || generateFormMutation.isPending,
    error,
    formStructure: generateFormMutation.data
  };
}
