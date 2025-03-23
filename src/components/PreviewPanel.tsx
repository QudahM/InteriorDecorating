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
  };
}

const PreviewPanel = ({
  roomData = {
    dimensions: { width: 12, length: 15, height: 8 },
    style: "Modern",
    colorPalette: ["#F5F5F5", "#E0E0E0", "#9E9E9E"],
  },
}: PreviewPanelProps) => {
  return (
    <Card className="w-full max-w-[400px] h-[700px] bg-white p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Room Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="3d" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="3d">3D View</TabsTrigger>
          <TabsTrigger value="2d">2D Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="3d" className="mt-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            {/* Placeholder for 3D visualization */}
            <p className="text-gray-500">3D Preview Loading...</p>
          </div>
        </TabsContent>
        <TabsContent value="2d" className="mt-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            {/* Placeholder for 2D floor plan */}
            <p className="text-gray-500">2D Floor Plan</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Room Dimensions</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Width</p>
              <p>{roomData.dimensions?.width}ft</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Length</p>
              <p>{roomData.dimensions?.length}ft</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Height</p>
              <p>{roomData.dimensions?.height}ft</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Style</h3>
          <p className="text-sm bg-gray-50 p-2 rounded">{roomData.style}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Color Palette</h3>
          <div className="flex gap-2">
            {roomData.colorPalette?.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PreviewPanel;
