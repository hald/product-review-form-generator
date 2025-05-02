import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 sm:max-w-lg">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold">How to Use This App</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-medium mb-1">Step 1: Enter Product Type</h3>
            <p>Simply type what product you're reviewing (e.g., "headphones", "hiking boots", "robot vacuum").</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Step 2: Complete the Form</h3>
            <p>Fill out the customized review form that's generated specifically for your product type.</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Step 3: Submit Your Review</h3>
            <p>Click submit when you're done to save your detailed product feedback.</p>
          </div>
          <div className="pt-2">
            <p className="text-sm text-gray-500 italic">This app uses OpenAI to intelligently create review forms tailored to each product's specific features and characteristics.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
