from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from backend.utils import preprocess_image, decode_prediction
from pillow_heif import register_heif_opener
import numpy as np
import asyncio
from starlette.concurrency import run_in_threadpool
from PIL import Image
import io

register_heif_opener()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5173"],   # dev only
    allow_origins=["*"],  # For production, consider restricting this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model_inception.h5"
model = load_model(MODEL_PATH)

@app.get("/")
def root():
    return {"message": "Marine Animal Classifier API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()

    # Quick sanity limit (e.g., 20 MB) to avoid accidental giant uploads
    if len(image_bytes) > 20 * 1024 * 1024:
        return JSONResponse(status_code=413, content={"error": "File too large. Please use a smaller image."})

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid image file. {str(e)}"})

    input_tensor = preprocess_image(image)

    # Run the heavy call in a thread
    preds = await run_in_threadpool(model.predict, input_tensor)
    pred_class = decode_prediction(preds)

    return {"prediction": pred_class}


