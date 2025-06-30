import React, { useState } from "react";
import axios from "axios";
import './CSS/Home.css'
// import 00891_00 from "../"
import model1 from "../assets/00891_00.jpg"
import model2 from "../assets/03615_00.jpg"
import model3 from "../assets/07445_00.jpg"
import model4 from "../assets/07573_00.jpg"
import model5 from "../assets/08909_00.jpg"
import model6 from "../assets/10549_00.jpg"
import clothImg from "../assets/07429_00.jpg"

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clothImage, setClothImage] = useState(null);
  const [modleImage, setModelImage]=useState(null);
  const [clothImage1, setClothImage1] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleGenerate = async () => {

    if (!prompt.trim()) return;
    console.log("Is this working");
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
    

    if (!clothImage && !modleImage) return;

    const path = modleImage;
    const fileName = path.split("/").pop();
    console.log(clothImage); // Should be a File object
    console.log(fileName); // Should be a File object

    const formData = new FormData();
    formData.append('cloth', clothImage);
    formData.append('model',fileName)
  
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
    <>
    <div className="Home-container">
      <div className="Home-container-in">
        <div className="image-generation">
            <h1>Fashion Image Generator</h1>
            <input placeholder="Enter prompt (e.g. girl in red saree)" className="input-text" value={prompt} onChange={(e) => setPrompt(e.target.value)} ></input>
            <button
            className="btn-generate-image"
            onClick={handleGenerate}>
            {loading ? "Generating..." : "Generate Image"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="image-container">
                {/* {image && (
                <img
                src={image}
                alt="Generated AI"
                id="imageGenerated" />
                )} */}
                {clothImg && (
                <img
                src={clothImg}
                alt="Generated AI"
                id="imageGenerated" />
                )}
            </div>
        </div>
        <div className="Border"></div>
        <div className="image-generation">
            <h1>Virtual Try-on</h1>
            <form onSubmit={handleSubmit} >
            <div className="upload-image">
                <input type="file" accept="image/*" onChange={handleImageChange}></input>
                <h1>Select any models you want</h1>
              <div className="model-images">
              <img src={model1} width={100} onClick={()=> setModelImage(model1)}></img>
              <img src={model2} width={100} onClick={()=> setModelImage(model2)}></img>
              <img src={model3} width={100} onClick={()=> setModelImage(model3)}></img>
              <img src={model4} width={100} onClick={()=> setModelImage(model4)}></img>
              <img src={model5} width={100} onClick={()=> setModelImage(model5)}></img>
              <img src={model6} width={100} onClick={()=> setModelImage(model6)}></img>
            </div>
                <button className="btn-generate-image" type="submit" > {isLoading ? 'Generating...' : 'Generate Try-On'} </button>
            </div>
            </form>
            <div className="try-on">
                <div className="selected-modle">
                  {modleImage ? (
                    <img src={modleImage}  className="try-on-image"></img>
                  ): <p>Select Model</p>}
                </div>
                <h2 className="">=</h2>
                <div className="try-on-result">
                  {/* {generatedImageUrl && (
                    <>
                    <h2 className="">Result:</h2>
                    <img
                    // src={generatedImageUrl}
                    src={modleImage}
                    alt="Generated Try-On"
                    className="w-full rounded-xl border"
                  />
                  </>
                  )} */}
                  {generatedImageUrl ? (
                    <>
                    <img
                    // src={generatedImageUrl}
                    src={generatedImageUrl}
                    alt="Generated Try-On"
                    className="try-on-image"
                  />
                  </>
                  ): isLoading==="Generating..." ? (<p>Generating...</p>):<p>Result</p>}
                </div>
            </div>
        </div>
        </div>
    </div>
    </>
  );
};

export default Home;
