from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from PIL import Image
import io
1
from fastapi import FastAPI, File, UploadFile, HTTPException
import os
import subprocess
from fastapi.responses import FileResponse
import shutil
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from fastapi import UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from rembg import remove
from PIL import Image
import os
import subprocess
import io
from fastapi import UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
from rembg import remove
import os, subprocess, cv2, numpy as np
import glob

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Define input schema
class PromptInput(BaseModel):
    prompt: str

# Hugging Face Inference API



@app.post("/generate-image/")
def generate_image(data: PromptInput):
    response = requests.post(API_URL, headers=HEADERS, json={"inputs": data.prompt})

    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers.get("content-type"))
    print("Response Content (first 200 bytes):", response.content[:200])

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Model generation failed.")

    # Send raw image bytes back to frontend
    return StreamingResponse(io.BytesIO(response.content), media_type="image/png")

# VITON-HD
# Define dataset paths

from fastapi import FastAPI, UploadFile, File, HTTPException


# Define paths (relative to main.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VITON_DIR = os.path.join(BASE_DIR, "VITON-HD")
DATASET_DIR = os.path.join(VITON_DIR, "datasets", "test")
CLOTH_DIR = os.path.join(DATASET_DIR, "cloth")
MASK_DIR = os.path.join(DATASET_DIR, "cloth-mask")
PAIRS_FILE = os.path.join(VITON_DIR, "datasets", "test_pairs.txt")
# OUTPUT_DIR = os.path.join(VITON_DIR, "results", "TOM", "try-on")
OUTPUT_DIR = os.path.join("VITON-HD", "results", "viton_hd") 


# Fixed model image for testing (must exist in image/ folder)
MODEL_IMG = "10549_00.jpg"

# @app.post("/upload-cloth/")
# async def upload_cloth(file: UploadFile = File(...)):
#     try:
#         # Step 1: Save uploaded cloth image
#         cloth_path = os.path.join(CLOTH_DIR, file.filename)
#         with open(cloth_path, "wb") as f:
#             f.write(await file.read())

#         # Step 2: Generate mask using simple thresholding
#         image = Image.open(cloth_path).convert("L")
#         mask = image.point(lambda p: 255 if p > 20 else 0).convert("1")
#         mask_path = os.path.join(MASK_DIR, file.filename)
#         mask.save(mask_path)

#         # Step 3: Update test_pairs.txt with model image and uploaded cloth
#         with open(PAIRS_FILE, "w") as f:
#             f.write(f"{MODEL_IMG} {file.filename}\n")

#         # Step 4: Run GMM stage
#         # subprocess.run([
#         #     "python", "test.py",
#         #     "--name", "GMM",
#         #     "--stage", "GMM",
#         #     "--datamode", "test",
#         #     "--data_list", "test_pairs.txt",
#         #     "--dataset_dir", "datasets",
#         #     "--checkpoint_dir", "checkpoints"
#         # ], check=True)

#         subprocess.run([
#             "python", "test.py",
#             "--name", "viton_hd",
#             "--dataset_mode", "test",
#             "--dataset_dir", "./datasets/",
#             "--checkpoint_dir", "./checkpoints/"
#         ], check=True, cwd="VITON-HD")

#         # Step 5: Run TOM stage
#         # subprocess.run([
#         #     "python", "test.py",
#         #     "--name", "TOM",
#         #     "--stage", "TOM",
#         #     "--datamode", "test",
#         #     "--data_list", "test_pairs.txt",
#         #     "--dataset_dir", "datasets",
#         #     "--checkpoint_dir", "checkpoints"
#         # ], check=True)

#         # Step 6: Return generated try-on image
#         result_path = os.path.join(OUTPUT_DIR, MODEL_IMG)
#         if not os.path.exists(result_path):
#             raise HTTPException(status_code=500, detail="Try-on image not generated.")

#         return StreamingResponse(open(result_path, "rb"), media_type="image/jpeg")

#     except subprocess.CalledProcessError as e:
#         print("Subprocess failed:", e)
#         raise HTTPException(status_code=500, detail="Model execution failed.")
#     except Exception as e:
#         print("Error:", str(e))
#         raise HTTPException(status_code=500, detail="Failed to process image.")
app.mount("/results", StaticFiles(directory="VITON-HD/results"), name="results")

# @app.post("/upload-cloth/")
# async def upload_cloth(file: UploadFile = File(...)):
#     try:
#         # Step 1: Save uploaded cloth image
#         cloth_path = os.path.join(CLOTH_DIR, file.filename)
#         with open(cloth_path, "wb") as f:
#             f.write(await file.read())

#         # Step 2: Generate mask using rembg
#         input_image = Image.open(cloth_path).convert("RGBA")
#         output = remove(input_image)

#         # Convert RGBA to grayscale binary mask
#         alpha = output.split()[-1]  # get alpha channel
#         mask = alpha.point(lambda p: 255 if p > 0 else 0).convert("1")

#         # Save mask
#         mask_path = os.path.join(MASK_DIR, file.filename)
#         mask.save(mask_path)

#         # Step 3: Update test_pairs.txt
#         with open(PAIRS_FILE, "w") as f:
#             f.write(f"{MODEL_IMG} {file.filename}\n")

#         # Step 4: Run the VITON-HD model
#         subprocess.run([
#             "python", "test.py",
#             "--name", "viton_hd",
#             "--dataset_mode", "test",
#             "--dataset_dir", "./datasets/",
#             "--checkpoint_dir", "./checkpoints/"
#         ], check=True, cwd="VITON-HD")

#         # Step 5: Get latest generated image from result dir
#         files = [f for f in os.listdir(OUTPUT_DIR) if f.endswith(".jpg")]
#         if not files:
#             raise HTTPException(status_code=500, detail="No image generated.")

#         latest_file = max(files, key=lambda x: os.path.getmtime(os.path.join(OUTPUT_DIR, x)))
#         image_url = f"http://localhost:8000/results/viton_hd/{latest_file}"

#         # Step 6: Return image URL to frontend
#         return JSONResponse(content={"image_url": image_url})

#     except subprocess.CalledProcessError as e:
#         print("Subprocess failed:", e)
#         raise HTTPException(status_code=500, detail="Model execution failed.")
#     except Exception as e:
#         print("Error:", str(e))
#         raise HTTPException(status_code=500, detail="Failed to process image.")

# improved Rembg

@app.post("/upload-cloth/")
async def upload_cloth(cloth: UploadFile = File(...),model: str = Form(...)):
    try:
        # Step 1: Save uploaded cloth image
        cloth_path = os.path.join(CLOTH_DIR, cloth.filename)
        with open(cloth_path, "wb") as f:
            f.write(await cloth.read())

        # Step 2: Generate refined mask using rembg + OpenCV
        input_image = Image.open(cloth_path).convert("RGBA")
        output = remove(input_image)

        # Extract alpha channel and convert to NumPy
        alpha = np.array(output.split()[-1])
        _, binary_mask = cv2.threshold(alpha, 30, 255, cv2.THRESH_BINARY)

        # Morphological cleanup
        kernel = np.ones((3, 3), np.uint8)
        binary_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_CLOSE, kernel)
        binary_mask = cv2.medianBlur(binary_mask, 3)

        # Save mask
        mask_path = os.path.join(MASK_DIR, cloth.filename)
        cv2.imwrite(mask_path, binary_mask)

        # Step 3: Update test_pairs.txt
        with open(PAIRS_FILE, "w") as f:
            f.write(f"{model} {cloth.filename}\n")

        # Step 4: Run the VITON-HD model
        subprocess.run([
            "python", "test.py",
            "--name", "viton_hd",
            "--dataset_mode", "test",
            "--dataset_dir", "./datasets/",
            "--checkpoint_dir", "./checkpoints/"
        ], check=True, cwd="VITON-HD")

        # Step 5: Get latest generated image (supporting .jpg and .png)
        result_dir = OUTPUT_DIR  # <- no "test" folder now
        files = [f for f in os.listdir(result_dir) if f.endswith((".jpg", ".png"))]
        if not files:
            raise HTTPException(status_code=500, detail="No image generated.")

        latest_file = max(files, key=lambda x: os.path.getmtime(os.path.join(result_dir, x)))
        image_url = f"http://localhost:8000/results/viton_hd/{latest_file}"

        # Step 6: Return image URL
        return JSONResponse(content={"image_url": image_url})

    except subprocess.CalledProcessError as e:
        print("Subprocess failed:", e)
        raise HTTPException(status_code=500, detail="Model execution failed.")
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail="Failed to process image.")
    
