import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  DoorOpen,
  Square,
  Columns,
  Plus,
  Minus,
  Move,
  Trash2,
  Sofa,
  Bed,
  Table,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface RoomObject {
  id: string;
  type: "door" | "window" | "feature" | "furniture";
  subType?: "sofa" | "bed" | "table";
  position: { x: number; y: number };
  rotation: number;
  size: { width: number; height: number };
}

interface RoomLayoutBuilderProps {
  onLayoutChange?: (objects: RoomObject[]) => void;
  onDimensionsChange?: (dimensions: {
    width: number;
    length: number;
    height: number;
  }) => void;
  initialObjects?: RoomObject[];
  dimensions?: { width: number; length: number; height: number };
}

const defaultObjects: RoomObject[] = [
  {
    id: "1",
    type: "door",
    position: { x: 50, y: 50 },
    rotation: 0,
    size: { width: 40, height: 5 },
  },
  {
    id: "2",
    type: "window",
    position: { x: 200, y: 50 },
    rotation: 0,
    size: { width: 60, height: 5 },
  },
];

const getObjectSize = (
  type: string,
  subType?: string,
): { width: number; height: number } => {
  switch (type) {
    case "door":
      return { width: 40, height: 5 };
    case "window":
      return { width: 60, height: 5 };
    case "feature":
      return { width: 30, height: 30 };
    case "furniture":
      switch (subType) {
        case "sofa":
          return { width: 80, height: 40 };
        case "bed":
          return { width: 80, height: 60 };
        case "table":
          return { width: 50, height: 50 };
        default:
          return { width: 40, height: 40 };
      }
    default:
      return { width: 30, height: 30 };
  }
};

const RoomLayoutBuilder = ({
  onLayoutChange = () => {},
  onDimensionsChange = () => {},
  initialObjects = defaultObjects,
  dimensions: initialDimensions = { width: 12, length: 15, height: 8 },
}: RoomLayoutBuilderProps) => {
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [roomObjects, setRoomObjects] = useState<RoomObject[]>(() => {
    // Ensure all objects have rotation and size properties
    return initialObjects.map((obj) => ({
      ...obj,
      rotation: obj.rotation || 0,
      size: obj.size || getObjectSize(obj.type, obj.subType),
    }));
  });
  const [selectedTool, setSelectedTool] = useState<
    "door" | "window" | "feature" | "furniture" | null
  >(null);
  const [selectedFurniture, setSelectedFurniture] = useState<
    "sofa" | "bed" | "table" | null
  >(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [gridSize, setGridSize] = useState(20); // Grid size in pixels

  // Calculate room dimensions in pixels based on actual dimensions
  const roomWidthPx = dimensions.width * 20;
  const roomLengthPx = dimensions.length * 20;

  // Function to snap position to grid
  const snapToGrid = (position: { x: number; y: number }) => {
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    };
  };

  const handleAddObject = (
    type: "door" | "window" | "feature" | "furniture",
  ) => {
    let subType = null;
    if (type === "furniture" && selectedFurniture) {
      subType = selectedFurniture;
    }

    const size = getObjectSize(type, subType || undefined);

    const newObject: RoomObject = {
      id: Math.random().toString(),
      type,
      ...(subType && { subType }),
      position: {
        x: roomWidthPx / 2 - size.width / 2,
        y: roomLengthPx / 2 - size.height / 2,
      },
      rotation: 0,
      size,
    };

    const updatedObjects = [...roomObjects, newObject];
    setRoomObjects(updatedObjects);
    onLayoutChange(updatedObjects);
    setSelectedObjectId(newObject.id);
  };

  const handleDeleteObject = (id: string) => {
    const updatedObjects = roomObjects.filter((obj) => obj.id !== id);
    setRoomObjects(updatedObjects);
    onLayoutChange(updatedObjects);
    setSelectedObjectId(null);
  };

  const handleRotateObject = (id: string) => {
    const updatedObjects = roomObjects.map((obj) =>
      obj.id === id ? { ...obj, rotation: (obj.rotation + 90) % 360 } : obj,
    );
    setRoomObjects(updatedObjects);
    onLayoutChange(updatedObjects);
  };

  // Handle zoom in/out
  const handleZoom = (direction: "in" | "out") => {
    setScale((prev) => {
      const newScale = direction === "in" ? prev + 0.1 : prev - 0.1;
      return Math.max(0.5, Math.min(2, newScale)); // Limit scale between 0.5 and 2
    });
  };

  // Reset selection when tool changes
  useEffect(() => {
    if (selectedTool !== "furniture") {
      setSelectedFurniture(null);
    }
  }, [selectedTool]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Room Layout Builder</h2>

      <Tabs defaultValue="elements" className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="elements">Room Elements</TabsTrigger>
          <TabsTrigger value="furniture">Furniture</TabsTrigger>
        </TabsList>

        <TabsContent value="elements" className="mt-2">
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedTool === "door" ? "default" : "outline"}
                    onClick={() => {
                      setSelectedTool("door");
                      setSelectedObjectId(null);
                    }}
                    className="flex-1"
                  >
                    <DoorOpen className="w-4 h-4 mr-2" />
                    Door
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add a door to the layout</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedTool === "window" ? "default" : "outline"}
                    onClick={() => {
                      setSelectedTool("window");
                      setSelectedObjectId(null);
                    }}
                    className="flex-1"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Window
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add a window to the layout</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedTool === "feature" ? "default" : "outline"}
                    onClick={() => {
                      setSelectedTool("feature");
                      setSelectedObjectId(null);
                    }}
                    className="flex-1"
                  >
                    <Columns className="w-4 h-4 mr-2" />
                    Feature
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add an architectural feature</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TabsContent>

        <TabsContent value="furniture" className="mt-2">
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      selectedTool === "furniture" &&
                      selectedFurniture === "sofa"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      setSelectedTool("furniture");
                      setSelectedFurniture("sofa");
                      setSelectedObjectId(null);
                    }}
                    className="flex-1"
                  >
                    <Sofa className="w-4 h-4 mr-2" />
                    Sofa
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add a sofa to the layout</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      selectedTool === "furniture" &&
                      selectedFurniture === "bed"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      setSelectedTool("furniture");
                      setSelectedFurniture("bed");
                      setSelectedObjectId(null);
                    }}
                    className="flex-1"
                  >
                    <Bed className="w-4 h-4 mr-2" />
                    Bed
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add a bed to the layout</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      selectedTool === "furniture" &&
                      selectedFurniture === "table"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      setSelectedTool("furniture");
                      setSelectedFurniture("table");
                      setSelectedObjectId(null);
                    }}
                    className="flex-1"
                  >
                    <Table className="w-4 h-4 mr-2" />
                    Table
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add a table to the layout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (ft)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={dimensions.width}
            onChange={(e) => {
              const newDimensions = {
                ...dimensions,
                width: Number(e.target.value),
              };
              setDimensions(newDimensions);
              onDimensionsChange(newDimensions);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Length (ft)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={dimensions.length}
            onChange={(e) => {
              const newDimensions = {
                ...dimensions,
                length: Number(e.target.value),
              };
              setDimensions(newDimensions);
              onDimensionsChange(newDimensions);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (ft)
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={dimensions.height}
            onChange={(e) => {
              const newDimensions = {
                ...dimensions,
                height: Number(e.target.value),
              };
              setDimensions(newDimensions);
              onDimensionsChange(newDimensions);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex justify-end mb-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom("out")}
          disabled={scale <= 0.5}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="px-2 py-1 bg-gray-100 rounded text-sm">
          {Math.round(scale * 100)}%
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom("in")}
          disabled={scale >= 2}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <Card
        className="relative bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden"
        style={{ width: "100%", height: 400 }}
      >
        {/* Room outline with grid */}
        <div
          className="absolute bg-white border-2 border-gray-400"
          style={{
            width: roomWidthPx * scale,
            height: roomLengthPx * scale,
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%)`,
            backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`,
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
          }}
        >
          {/* Room dimensions labels */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-gray-100 px-2 py-0.5 text-xs rounded">
            {dimensions.width} ft
          </div>
          <div
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-gray-100 px-2 py-0.5 text-xs rounded"
            style={{ transform: "rotate(-90deg) translateX(-50%)" }}
          >
            {dimensions.length} ft
          </div>
        </div>

        {/* Room objects */}
        {roomObjects.map((object) => {
          const isSelected = selectedObjectId === object.id;
          return (
            <motion.div
              key={object.id}
              drag
              dragMomentum={false}
              className={`absolute cursor-move ${isSelected ? "ring-2 ring-blue-500" : ""}`}
              style={{
                x: object.position.x * scale,
                y: object.position.y * scale,
                width: object.size.width * scale,
                height: object.size.height * scale,
                transform: `rotate(${object.rotation}deg)`,
                zIndex: isSelected ? 10 : 1,
              }}
              onClick={() => setSelectedObjectId(object.id)}
              onDragEnd={(_, info) => {
                const snappedPosition = snapToGrid({
                  x: info.point.x / scale,
                  y: info.point.y / scale,
                });

                const updatedObjects = roomObjects.map((obj) =>
                  obj.id === object.id
                    ? { ...obj, position: snappedPosition }
                    : obj,
                );
                setRoomObjects(updatedObjects);
                onLayoutChange(updatedObjects);
              }}
            >
              <div
                className={`w-full h-full bg-white rounded shadow-md flex items-center justify-center
                  ${isSelected ? "bg-blue-50" : "bg-white"}`}
              >
                {object.type === "door" && <DoorOpen className="w-5 h-5" />}
                {object.type === "window" && <Square className="w-5 h-5" />}
                {object.type === "feature" && <Columns className="w-5 h-5" />}
                {object.type === "furniture" && object.subType === "sofa" && (
                  <Sofa className="w-5 h-5" />
                )}
                {object.type === "furniture" && object.subType === "bed" && (
                  <Bed className="w-5 h-5" />
                )}
                {object.type === "furniture" && object.subType === "table" && (
                  <Table className="w-5 h-5" />
                )}
              </div>

              {/* Controls for selected object */}
              {isSelected && (
                <div className="absolute -top-8 left-0 flex gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRotateObject(object.id);
                    }}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 bg-white text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteObject(object.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </motion.div>
          );
        })}

        {selectedTool && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={() => handleAddObject(selectedTool)}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add{" "}
              {selectedTool === "furniture" && selectedFurniture
                ? selectedFurniture
                : selectedTool}
            </Button>
          </div>
        )}
      </Card>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setRoomObjects([]);
              onLayoutChange([]);
              setSelectedObjectId(null);
            }}
            className="text-red-500"
          >
            <Minus className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {roomObjects.length} objects placed
        </div>
      </div>
    </div>
  );
};

export default RoomLayoutBuilder;
