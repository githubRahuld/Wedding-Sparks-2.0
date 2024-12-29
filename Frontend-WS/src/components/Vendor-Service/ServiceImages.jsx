import React from "react";

const ServiceImages = ({ images }) => {
  return (
    <div className="mt-8">
      {/* Title Section */}
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6 font-cinzelDecorative shadow-slate-300">
        Event Gallery
      </h2>

      {/* Image Gallery Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images?.map((image, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={image}
              alt={`vendor-image-${index}`}
              className="w-full h-64 object-cover rounded-t-lg transition-all duration-300 ease-in-out "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceImages;
