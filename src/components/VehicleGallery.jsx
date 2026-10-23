import { useState } from "react";

function VehicleGallery({ vehicle }) {
  const images =
    Array.isArray(vehicle.images) && vehicle.images.length > 0
      ? vehicle.images
      : [vehicle.image].filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-[#FAFAFA] text-[#3D3D3D]/60">
        No vehicle image available
      </div>
    );
  }

  return (
    <div>
      {/* MAIN IMAGE */}
      <div
        className="
          flex
          min-h-[300px]
          items-center
          justify-center
          overflow-hidden
          rounded-[20px]
          bg-[#FAFAFA]
          p-8
          sm:min-h-[420px]
        "
      >
        <img
          src={activeImage}
          alt={`${vehicle.name} - view ${activeIndex + 1}`}
          className="max-h-[400px] w-full object-contain"
        />
      </div>

      {/* IMAGE THUMBNAILS */}
      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${vehicle.name}`}
              aria-pressed={activeIndex === index}
              className={`
                flex
                h-20
                w-24
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border-2
                bg-[#FAFAFA]
                p-2
                transition-colors
                ${
                  activeIndex === index
                    ? "border-[#F87927]"
                    : "border-[#EAECF0] hover:border-[#233D4D]"
                }
              `}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default VehicleGallery;