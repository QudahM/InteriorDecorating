import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "../lib/utils";

interface StyleOption {
  id: string;
  name: string;
  image: string;
  colors: string[];
  materials: Array<{
    name: string;
    image: string;
  }>;
}

interface StyleSelectorProps {
  selectedStyle?: string;
  onStyleSelect?: (style: string) => void;
  onColorSelect?: (color: string) => void;
  onMaterialSelect?: (material: string) => void;
  styles?: StyleOption[];
}

// Common color palette and materials for all styles
const commonColors = [
  "#F8F9FA", // White
  "#212529", // Black
  "#4361EE", // Royal Blue
  "#F72585", // Magenta
  "#4CC9F0", // Cyan
  "#4895EF", // Blue
  "#560BAD", // Purple
  "#F94144", // Red
  "#90BE6D", // Green
  "#F9C74F", // Yellow
  "#43AA8B", // Teal
  "#577590", // Steel Blue
  "#F3722C", // Orange
  "#F8961E", // Light Orange
  "#277DA1", // Dark Teal
  "#9D4EDD", // Lavender
];

const commonMaterials = [
  {
    name: "Glass",
    image:
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800&q=80",
  },
  {
    name: "Steel",
    image:
      "https://images.unsplash.com/photo-1602664876866-d3b33b77756b?w=800&q=80",
  },
  {
    name: "Wood",
    image:
      "https://images.unsplash.com/photo-1572297794908-f2ee5a2930d05?w=800&q=80",
  },
  {
    name: "Marble",
    image:
      "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=800&q=80",
  },
  {
    name: "Concrete",
    image:
      "https://images.unsplash.com/photo-1617391258031-f8d80b22fb37?w=800&q=80",
  },
  {
    name: "Leather",
    image:
      "https://images.unsplash.com/photo-1629971500821-3b5cc276b58a?w=800&q=80",
  },
  {
    name: "Velvet",
    image:
      "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=800&q=80",
  },
  {
    name: "Rattan",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
  },
  {
    name: "Brass",
    image:
      "https://images.unsplash.com/photo-1629971500821-3b5cc276b58a?w=800&q=80",
  },
];

const defaultStyles: StyleOption[] = [
  {
    id: "modern",
    name: "Modern",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    colors: commonColors,
    materials: commonMaterials,
  },
  {
    id: "traditional",
    name: "Traditional",
    image:
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80",
    colors: commonColors,
    materials: commonMaterials,
  },
  {
    id: "bohemian",
    name: "Bohemian",
    image:
      "https://images.unsplash.com/photo-1617104678098-de229db51175?w=800&q=80",
    colors: commonColors,
    materials: commonMaterials,
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
    colors: commonColors,
    materials: commonMaterials,
  },
  {
    id: "industrial",
    name: "Industrial",
    image:
      "https://images.unsplash.com/photo-1505409628601-edc9af17fda6?w=800&q=80",
    colors: commonColors,
    materials: commonMaterials,
  },
  {
    id: "minimalist",
    name: "Minimalist",
    image:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80",
    colors: commonColors,
    materials: commonMaterials,
  },
  {
    id: "coastal",
    name: "Coastal",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
    colors: commonColors,
    materials: commonMaterials,
  },
  {
    id: "rustic",
    name: "Rustic",
    image:
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&q=80",
    colors: commonColors,
    materials: commonMaterials,
  },
  {
    id: "midcentury",
    name: "Mid-Century",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
    colors: commonColors,
    materials: commonMaterials,
  },
];

const StyleSelector = ({
  selectedStyle: propSelectedStyle = "modern",
  onStyleSelect = () => {},
  onColorSelect = () => {},
  onMaterialSelect = () => {},
  styles = defaultStyles,
}: StyleSelectorProps) => {
  const [selectedStyle, setSelectedStyle] = React.useState(propSelectedStyle);

  React.useEffect(() => {
    setSelectedStyle(propSelectedStyle);
  }, [propSelectedStyle]);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    onStyleSelect(styleId);
  };
  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-lg">
      <Tabs defaultValue="styles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="styles">Design Styles</TabsTrigger>
          <TabsTrigger value="colors">Color Palette</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="styles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {styles.map((style) => (
              <Card
                key={style.id}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105",
                  selectedStyle === style.id ? "ring-2 ring-primary" : "",
                )}
                onClick={() => handleStyleSelect(style.id)}
              >
                <div className="relative h-48 w-full">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{style.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          {styles.map((style) => (
            <div
              key={style.id}
              className={cn(
                "space-y-2",
                selectedStyle === style.id ? "block" : "hidden",
              )}
            >
              <h3 className="text-lg font-semibold mb-4">
                {style.name} Color Palette
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-h-[300px] overflow-y-auto pr-2">
                {style.colors.map((color, index) => (
                  <Button
                    key={index}
                    className="w-full h-20 rounded-lg"
                    style={{ backgroundColor: color }}
                    onClick={() => onColorSelect(color)}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          {styles.map((style) => (
            <div
              key={style.id}
              className={cn(
                "space-y-2",
                selectedStyle === style.id ? "block" : "hidden",
              )}
            >
              <h3 className="text-lg font-semibold mb-4">
                {style.name} Materials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {style.materials.map((material, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:scale-105 transition-all"
                    onClick={() => onMaterialSelect(material.name)}
                  >
                    <div className="relative h-32 w-full">
                      <img
                        src={material.image}
                        alt={material.name}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-2 text-center">
                      <p className="font-medium">{material.name}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleSelector;
