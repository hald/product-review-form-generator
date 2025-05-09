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
      <div className="space-y-3">
        <Label htmlFor={name} className="block text-base font-medium text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="flex items-center space-x-2 star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={`${name}-star-${star}`}
              type="button"
              aria-label={`Rate ${star} out of 5`}
              onClick={() => handleRatingChange(name, star)}
              className="focus:outline-none star"
            >
              <Star
                className={`h-7 w-7 ${
                  star <= currentRating 
                    ? 'fill-amber-500 text-amber-500 drop-shadow-sm' 
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              />
            </button>
          ))}
          <span className="ml-3 text-sm font-medium px-2 py-1 rounded-md bg-gray-100">
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
    <Card className="max-w-3xl mx-auto form-card rounded-xl">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Review <span className="text-primary font-extrabold">
                {productType}
              </span>
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 flex items-center text-sm rounded-full px-3 py-2 transition-all duration-200 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Change Product
            </Button>
          </div>
          <p className="text-gray-600 text-sm">Please share your honest feedback about this product. Your insights help others make better decisions.</p>
        </div>

        {/* Loading state */}
        {!formStructure && (
          <div className="py-6">
            <div className="space-y-6">
              <div className="h-5 bg-gray-100 rounded-lg w-1/3 animate-pulse"></div>
              <div className="form-field animate-pulse bg-gray-50 h-16"></div>
              
              <div className="h-5 bg-gray-100 rounded-lg w-2/5 animate-pulse"></div>
              <div className="form-field animate-pulse bg-gray-50 h-16"></div>
              
              <div className="h-5 bg-gray-100 rounded-lg w-1/4 animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-field animate-pulse bg-gray-50 h-12"></div>
                <div className="form-field animate-pulse bg-gray-50 h-12"></div>
              </div>
              
              <div className="h-5 bg-gray-100 rounded-lg w-1/3 animate-pulse"></div>
              <div className="form-field animate-pulse bg-gray-50 h-32"></div>
              
              <div className="flex justify-end mt-8">
                <div className="w-40 h-12 rounded-full bg-primary/40 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Form */}
        {formStructure && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Handle case with no sections */}
              {sections.length === 0 && (
                <div className="space-y-5">
                  {formStructure.fields.map((field) => (
                    <div key={field.name} className="form-field">
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Render fields by section */}
              {sections.map((section) => (
                <div key={section} className="mb-8">
                  <h3 className="section-title">{section}</h3>
                  <div className="space-y-5">
                    {groupedFields[section]?.map((field) => (
                      <div key={`${section}-${field.name}`} className="form-field">
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Fields without section but when sections exist */}
              {sections.length > 0 && groupedFields['undefined']?.length > 0 && (
                <div className="mb-8">
                  <h3 className="section-title">Additional Information</h3>
                  <div className="space-y-5">
                    {groupedFields['undefined'].map((field) => (
                      <div key={`undefined-${field.name}`} className="form-field">
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-10 flex justify-end">
              <Button
                type="submit"
                className="submit-button px-8 py-4 text-white font-medium rounded-full shadow-md hover:shadow-xl focus:ring-4 focus:ring-primary/30 focus:outline-none"
                disabled={submitReviewMutation.isPending}
              >
                {submitReviewMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span className="font-semibold">Submitting...</span>
                  </>
                ) : (
                  <span className="font-semibold">Submit Review</span>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
