from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model
MODEL_PATH = "models/best_model.h5"
model = load_model(MODEL_PATH)

# List of class names
CLASS_NAMES = ["Apple___Scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy"]

# Preprocessing function
def preprocess_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

@app.get("/")
def root():
    return {"message": "Plant Disease Classifier API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img_array = preprocess_image(img_bytes)
    preds = model.predict(img_array)
    pred_class = CLASS_NAMES[np.argmax(preds)]
    confidence = float(np.max(preds))
    return {"predicted_class": pred_class, "confidence": confidence}
