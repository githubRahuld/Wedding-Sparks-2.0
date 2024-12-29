import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

const vendorCategories = [
  {
    name: "Catering",
    image: "/img/carousel/catering.jpg",
  },
  {
    name: "Photography",
    image: "/img/carousel/photography.jpg",
  },
  {
    name: "Music & DJ",
    image: "/img/carousel/music.jpg",
  },
  {
    name: "Decorations",
    image: "/img/carousel/decorations.jpg",
  },
  {
    name: "Venues",
    image: "/img/carousel/venues.jpg",
  },
  {
    name: "Planner",
    image: "/img/carousel/planner.jpg",
  },
  {
    name: "Baker",
    image: "/img/carousel/Baker.jpg",
  },
  {
    name: "Dhool",
    image: "/img/carousel/dhool.jpg",
  },
];

function Carousels() {
  return (
    <div className="overflow-hidden relative w-full max-w-5xl mx-auto">
      {/* Scrolling container */}
      <div className="flex animate-scroll gap-4">
        {/* Duplicate items for continuous scrolling */}
        {[...vendorCategories, ...vendorCategories].map((vendor, index) => (
          <div key={index} className="flex-shrink-0 w-56 p-2">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <h3 className="mt-4 text-lg font-semibold">{vendor.name}</h3>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousels;
