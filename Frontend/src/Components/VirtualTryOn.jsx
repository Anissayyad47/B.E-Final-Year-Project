import React, { useState } from 'react';

const VirtualTryOn = () => {
  const [clothImage, setClothImage] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    setClothImage(e.target.files[0]);
    setGeneratedImageUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!clothImage) return;
  
    const formData = new FormData();
    formData.append('file', clothImage);
  
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost:8000/upload-cloth/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) throw new Error('Failed to generate image');
  
      const data = await response.json();  // ✅ get the JSON object
      console.log("image :  "+data)
      console.log("image :  "+data.image_url)
      setGeneratedImageUrl(data.image_url); // ✅ use image_url from backend
    } catch (error) {
      console.error(error);
      alert('Something went wrong while generating the image.');
    }
  
    setIsLoading(false);
  };
  

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg">

      <h1 className="text-2xl font-bold">Virtual Try-On</h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {isLoading ? 'Generating...' : 'Generate Try-On'}
        </button>
      </form>

      {generatedImageUrl && (
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-2 text-center">Result:</h2>
          <img
            src={generatedImageUrl}
            alt="Generated Try-On"
            className="w-full rounded-xl border"
          />
        </div>
      )}

    </div>
  );
};

export default VirtualTryOn;
