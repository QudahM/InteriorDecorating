import React from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Eye, Download, Share2 } from "lucide-react";

interface PreviewPanelProps {
  roomData?: {
    dimensions?: { width: number; length: number; height: number };
    style?: string;
    colorPalette?: string[];
    materials?: string[];
  };
  imageData?: string | null;
  errorMessage?: string | null;
}

const PreviewPanel = ({
  roomData = {
    dimensions: { width: 12, length: 15, height: 8 },
    style: "Modern",
    colorPalette: ["#F5F5F5", "#E0E0E0", "#9E9E9E"],
    materials: ["Wood", "Metal", "Glass"],
  },
  imageData,
  errorMessage,
}: PreviewPanelProps) => {
  return (
    <Card className="w-full max-w-[400px] h-[700px] bg-gradient-to-b from-white to-gray-50 p-5 flex flex-col gap-4
    shadow-lg border border-gray-100 rounded-xl overflow-hidden">
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Room Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="hover:bg-gray-100 transition-colors">
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-gray-100 transition-colors">
            <Download className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-gray-100 transition-colors">
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="3d" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="3d" className="data-[state=active]:bg-white">3D View</TabsTrigger>
        </TabsList>
        <TabsContent value="3d" className="mt-4">
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center 
          shadow-inner border border-gray-200 overflow-hidden">
            {/* Placeholder for 3D room preview */}
            {(() => {
              let content;
              if (imageData) {
                content = <img src={imageData} alt="Generated Room" className="w-full h-full object-cover rounded-lg" />;
              } else if (errorMessage) {
                content = <p className="text-red-500 font-medium">{errorMessage}</p>;
              } else {
                content = <p className="text-gray-500 font-medium">3D Preview Loading...</p>;
              }
              return content;
            })()}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-2 space-y-3 overflow-y-auto pr-1 flex-1">
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700">Room Dimensions</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-white p-2 rounded-lg shadow-sm border 
            border-gray-100">
              <p className="text-gray-500 font-medium text-xs">Width</p>
              <p className="text-gray-800 font-semibold">
                {roomData.dimensions?.width}ft
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm border 
            border-gray-100">
              <p className="text-gray-500 font-medium text-xs">Length</p>
              <p className="text-gray-800 font-semibold">
                {roomData.dimensions?.length}ft</p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm border 
            border-gray-100">
              <p className="text-gray-500 font-medium text-xs">Height</p>
              <p className="text-gray-800 font-semibold">
                {roomData.dimensions?.height}ft</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700">Style</h3>
          <p className="text-sm bg-gray-50 p-2 rounded-lg shadow-sm border 
          border-gray-100 text-gray-800 font-semibold">
            {roomData.style}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700">
            Color Palette
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {roomData.colorPalette?.slice(0, 6).map((color, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center"
              >
                <div
                  className="w-6 h-6 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 mb-1"
                  style={{ backgroundColor: color }}
                />
                <p className="text-gray-800 text-xs truncate w-full text-center">
                  {color}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700">Materials</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {roomData.materials?.slice(0, 6).map((material, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded-lg shadow-sm border border-gray-100"
              >
                <p className="text-gray-500 font-medium text-xs">
                  Material {index + 1}
                </p>
                <p className="text-gray-800 font-semibold text-xs truncate">
                  {material}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PreviewPanel;

