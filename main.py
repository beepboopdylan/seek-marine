from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from utils import preprocess_image, decode_prediction
import numpy as np
from PIL import Image
import io

app = FastAPI()

MODEL_PATH = "model_inception.h5"
model = load_model(MODEL_PATH)

@app.get("/")
def root():
    return {"message": "Marine Animal Classifier API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid image file. {str(e)}"})
    
    # Preprocess for model
    input_tensor = preprocess_image(image)

    preds = model.predict(input_tensor)
    pred_class = decode_prediction(preds)
    
    return {"prediction": pred_class}


