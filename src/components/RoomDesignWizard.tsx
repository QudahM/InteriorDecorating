import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RoomLayoutBuilder from "./RoomLayoutBuilder";
import StyleSelector from "./StyleSelector";
import PreviewPanel from "./PreviewPanel";
import { generateRoomImage } from "@/lib/generateRoomImage";
import { set } from "date-fns";

interface RoomDesignWizardProps {
  onComplete?: (data: any) => void;
  initialStep?: number;
}

const steps = [
  { id: 1, title: "Room Layout" },
  { id: 2, title: "Style Preferences" },
  { id: 3, title: "Review & Generate" },
];

const RoomDesignWizard = ({
  onComplete = () => {},
  initialStep = 1,
}: RoomDesignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roomData, setRoomData] = useState({
    layout: [],
    dimensions: { width: 12, length: 15, height: 8 },
    style: "",
    colorPalette: [],
    materials: [],
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(roomData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <Card className="max-w-[1400px] mx-auto bg-white p-6 shadow-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Design Your Room</h1>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`${currentStep >= step.id ? "text-primary" : ""}`}
                >
                  {step.title}
                </span>
              ))}
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            {currentStep === 1 && (
              <RoomLayoutBuilder
                onLayoutChange={(layout) =>
                  setRoomData({ ...roomData, layout })
                }
                onDimensionsChange={(dimensions) =>
                  setRoomData({ ...roomData, dimensions })
                }
                dimensions={roomData.dimensions}
              />
            )}
            {currentStep === 2 && (
              <StyleSelector
                onStyleSelect={(style) => setRoomData({ ...roomData, style })}
                onColorSelect={(color) =>
                  setRoomData({
                    ...roomData,
                    colorPalette: [...(roomData.colorPalette || []), color],
                  })
                }
                onMaterialSelect={(material) =>
                  setRoomData({
                    ...roomData,
                    materials: [...(roomData.materials || []), material],
                  })
                }
              />
            )}
            {currentStep === 3 && (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">
                  Ready to Generate Your Design
                </h2>
                <p className="text-gray-600 mb-6">
                  Review your selections in the preview panel and click Generate
                  when you're ready.
                </p>
                <Button
                  size="lg"
                  onClick={async () => {
                    setErrorMessage(null);
                    setGeneratedImage(null);
                    const image = await generateRoomImage(roomData);
                    if (!image){
                      setErrorMessage("There are no more daily tokens. Please try again tomorrow.");
                      return;
                    }
                    setGeneratedImage(image);
                    onComplete(roomData);
                  }}
                  className="w-full max-w-md"
                >
                  Generate Design
                </Button>
              </div>
            )}
          </div>

          <div className="w-[400px]">
            <PreviewPanel roomData={roomData} imageData={generatedImage} errorMessage={errorMessage} />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length}>
            {currentStep === steps.length ? "Complete" : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RoomDesignWizard;
