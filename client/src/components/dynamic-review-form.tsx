import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { FormStructure } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface DynamicReviewFormProps {
  productType: string;
  formStructure: FormStructure | null;
  onBack: () => void;
  onSuccess: () => void;
}

export default function DynamicReviewForm({
  productType,
  formStructure,
  onBack,
  onSuccess
}: DynamicReviewFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  
  // State for ratings
  const [ratings, setRatings] = useState<Record<string, number>>({});
  
  const submitReviewMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await apiRequest("POST", "/api/reviews", {
        productType: productType,
        reviewData: formData
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit review. Please try again."
      });
    }
  });
  
  // Handle rating change
  const handleRatingChange = (name: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [name]: value
    }));
    setValue(name, value);
  };

  // Render the star rating component
  const renderRating = (name: string, label: string, required = false) => {
    const currentRating = ratings[name] || 0;
    
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="block text-sm font-medium text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={`${name}-star-${star}`}
              type="button"
              aria-label={`Rate ${star} out of 5`}
              onClick={() => handleRatingChange(name, star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${star <= currentRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {currentRating > 0 ? `${currentRating}/5` : 'Not rated'}
          </span>
        </div>
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">This field is required</p>
        )}
      </div>
    );
  };

  // Render different form field types
  const renderField = (field: any) => {
    const { name, label, type, required = false, options, placeholder, min, max, section } = field;
    
    // This ensures each field has a unique key at this level
    const key = name;
    
    switch (type) {
      case "text":
      case "email":
      case "number":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="block text-sm font-medium text-gray-900">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={name}
              type={type}
              placeholder={placeholder || ""}
              {...register(name, { required })}
              min={min}
              max={max}
              className="w-full"
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );
        
      case "textarea":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="block text-sm font-medium text-gray-900">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={name}
              placeholder={placeholder || ""}
              {...register(name, { required })}
              className="w-full"
              rows={3}
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );
        
      case "select":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="block text-sm font-medium text-gray-900">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              onValueChange={(value) => setValue(name, value)}
              defaultValue=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option: { value: string; label: string }) => (
                  <SelectItem key={`${name}-option-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );
        
      case "radio":
        return (
          <div className="space-y-2" key={name}>
            <Label className="block text-sm font-medium text-gray-900">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              onValueChange={(value) => setValue(name, value)}
              className="flex flex-wrap gap-4"
            >
              {options?.map((option: { value: string; label: string }) => (
                <div key={`${name}-option-${option.value}`} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                  <Label htmlFor={`${name}-${option.value}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );
        
      case "checkbox":
        return (
          <div className="flex items-center space-x-2" key={name}>
            <Checkbox
              id={name}
              {...register(name)}
            />
            <Label htmlFor={name} className="text-sm font-medium text-gray-900">
              {label}
            </Label>
          </div>
        );
        
      case "date":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="block text-sm font-medium text-gray-900">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={name}
              type="date"
              {...register(name, { required })}
              className="w-full"
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );
        
      case "range":
        const [rangeValue, setRangeValue] = useState([min || 1]);
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="block text-sm font-medium text-gray-900">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex items-center">
              <Slider
                id={name}
                min={min || 1}
                max={max || 5}
                step={1}
                value={rangeValue}
                onValueChange={(value) => {
                  setRangeValue(value);
                  setValue(name, value[0]);
                }}
                className="w-full"
              />
              <span className="ml-2 text-sm text-gray-500">{rangeValue[0]}/{max || 5}</span>
            </div>
          </div>
        );
        
      case "rating":
        return renderRating(name, label, required);
        
      default:
        return null;
    }
  };

  // Group fields by section if available
  const getGroupedFields = () => {
    if (!formStructure) return { undefined: [] };
    
    return formStructure.fields.reduce((acc: Record<string, any[]>, field) => {
      const section = field.section || 'undefined';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(field);
      return acc;
    }, {});
  };

  const groupedFields = getGroupedFields();
  const sections = formStructure?.sections || [];
  
  const onSubmit = (data: any) => {
    submitReviewMutation.mutate(data);
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              Review Form for <span className="text-primary">{productType}</span>
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Change Product
            </Button>
          </div>
          <p className="text-gray-600">Please fill out the form below to submit your product review.</p>
        </div>

        {/* Loading state */}
        {!formStructure && (
          <div className="py-4">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Generated Form */}
        {formStructure && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Handle case with no sections */}
              {sections.length === 0 && (
                <div className="space-y-4">
                  {formStructure.fields.map(renderField)}
                </div>
              )}
              
              {/* Render fields by section */}
              {sections.map((section) => (
                <div key={section}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{section}</h3>
                  <div className="space-y-4">
                    {groupedFields[section]?.map((field) => 
                      renderField(field)
                    )}
                  </div>
                </div>
              ))}
              
              {/* Fields without section but when sections exist */}
              {sections.length > 0 && groupedFields['undefined']?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Information</h3>
                  <div className="space-y-4">
                    {groupedFields['undefined'].map((field) => 
                      renderField(field)
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 focus:outline-none transition duration-150"
                disabled={submitReviewMutation.isPending}
              >
                {submitReviewMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
