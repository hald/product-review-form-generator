import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  productType: string;
  onStartNewReview: () => void;
}

export default function SuccessMessage({ productType, onStartNewReview }: SuccessMessageProps) {
  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm text-center">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Thank You For Your Review!</h2>
        <p className="text-gray-600 mb-6">
          Your feedback for the <span className="font-medium text-primary">{productType}</span> has been submitted successfully.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={onStartNewReview}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg shadow hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 focus:outline-none transition duration-150"
          >
            Create Another Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
