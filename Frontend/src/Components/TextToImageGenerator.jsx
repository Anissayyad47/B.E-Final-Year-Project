import React, { useState } from "react";
import axios from "axios";
import './CSS/TextToImageGenerator.css';

const TextToImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clothImage, setClothImage] = useState(null);
  const [clothImage1, setClothImage1] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setImage(null);

    try {
      const res = await axios.post("http://localhost:8000/generate-image/", {
        prompt: prompt,
      }, {
        responseType: "arraybuffer", // assuming you're returning image bytes
      });

      const base64 = btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const imgSrc = `data:image/png;base64,${base64}`;
      setImage(imgSrc);
      setClothImage1(imgSrc)
    } catch (err) {
      setError("Something went wrong while generating the image.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // VITON-HD
  const handleImageChange = (e) => {
    setClothImage(e.target.files[0]);
    setGeneratedImageUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!clothImage) return;
  
    const formData = new FormData();
    formData.append('cloth', clothImage);
  
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

  // const handleImageTryOn = async (e) => {
  //   e.preventDefault();
  
  //   if (!clothImage1) return;
  
  //   const formData = new FormData();
  //   formData.append('file', clothImage1);
  
  //   setIsLoading(true);
  
  //   try {
  //     const response = await fetch('http://localhost:8000/upload-cloth/', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (!response.ok) throw new Error('Failed to generate image');
  
  //     const data = await response.json();  // ✅ get the JSON object
  //     console.log("image :  "+data)
  //     console.log("image :  "+data.image_url)
  //     setGeneratedImageUrl(data.image_url); // ✅ use image_url from backend
  //   } catch (error) {
  //     console.error(error);
  //     alert('Something went wrong while generating the image.');
  //   }
  
  //   setIsLoading(false);
  // };

  return (
    <>
    <div className="Main-Container">
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <h2 className="text-2xl font-semibold">AI Fashion Image Generator</h2>
      <input
        type="text"
        placeholder="Enter prompt (e.g. girl in red saree)"
        className="border border-gray-400 px-4 py-2 rounded-md w-full max-w-md"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      <div className="imageGeneratedBox">
      {image && (
        <img
          src={image}
          alt="Generated AI"
          className="mt-4 rounded shadow-md max-w-md"
          id="imageGenerated"
        />
      )}
      </div>
      </div>
    <div id="ex" className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg">
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
    </div>
    </>
  );
};

export default TextToImageGenerator;
