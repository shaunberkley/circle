'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Orb from '@/components/Orb'; // Import the Orb component
import ClipLoader from 'react-spinners/ClipLoader';

const ColorPalette = () => {
  const [colors, setColors] = useState<string[]>([]);
  const [imageData, setImageData] = useState<{ url: string, width: number, height: number, color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const isFetching = useRef(false);

  useEffect(() => {
    console.log("useEffect triggered");

    const fetchColors = async () => {
      if (isFetching.current) return; // Prevent multiple calls
      isFetching.current = true;

      console.log("Fetching colors from API");

      try {
        const response = await fetch('/api/getColors');
        const data = await response.json();
        console.log("Colors fetched: ", data.colors);
        console.log("Image data fetched: ", data.imageData);
        setColors(data.colors);
        setImageData(data.imageData);
      } catch (error) {
        console.error('Error fetching colors:', error);
      } finally {
        isFetching.current = false; // Reset the flag
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchColors();
  }, []);

  console.log("Rendering ColorPalette component");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Color Palette</h1>
      <div className="flex flex-wrap">
        {colors.map((color) => (
          <div
            key={color}
            className="w-24 h-24 m-2 rounded-lg relative saturate-200"
            style={{ backgroundColor: color }}
          >
            <span className="absolute bottom-2 left-2 bg-white bg-opacity-70 px-2 py-1 rounded text-xs">{color}</span>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-4">Images</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#4A90E2" loading={loading} size={50} />
        </div>
      ) : (
        <div className="gap-4 columns-3">
          {imageData.map(({ url, color }, index) => (
            <div key={index} className="relative break-inside-avoid mb-6 group">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                width={500} // Example width, adjust as needed
                height={300} // Example height, adjust as needed
                className="w-full"
                objectFit="cover"
              />
              <div className="absolute inset-0 flex items-end bg-black bg-opacity-0 p-2 hover:bg-opacity-50 transition-opacity duration-300">
                <div className="bg-white bg-opacity-70 px-2 py-1 rounded text-xs">
                  <span className="block" style={{ color: color }}>{color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="relative w-full h-full bg-black/0 p-20">
        {!loading && colors.length > 0 && <Orb colors={colors} />}
      </div>
    </div>
  );
};

export default ColorPalette;
