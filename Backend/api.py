# api.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input as eff_preprocess
import numpy as np
from PIL import Image
import io, json, threading, os, logging

logging.basicConfig(level=logging.INFO)
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

MODEL_DIR = "models"
MODEL_FILES = ["plant_disease_model.keras", "best_model.h5", "final_model.h5"]
model = None
for name in MODEL_FILES:
    path = os.path.join(MODEL_DIR, name)
    if os.path.exists(path):
        logging.info(f"Loading model: {path}")
        model = load_model(path)
        break
if model is None:
    raise FileNotFoundError("No model file found in models/. Expected plant_disease_model.keras or .h5")

# load class names (handle either list or mapping)
class_names_path = os.path.join(MODEL_DIR, "class_names.json")
if not os.path.exists(class_names_path):
    class_names_path = os.path.join(MODEL_DIR, "class_indices.json")  # fallback name
if not os.path.exists(class_names_path):
    raise FileNotFoundError("class_names.json or class_indices.json not found in models/")

with open(class_names_path, "r") as f:
    data = json.load(f)

# Normalize to CLASS_NAMES list: index -> class name
if isinstance(data, list):
    CLASS_NAMES = [str(x) for x in data]
elif isinstance(data, dict):
    # possible shapes: {"classA":0, "classB":1} or {"0":"classA", "1":"classB"}
    # detect which and convert accordingly
    if all(isinstance(k, str) and v is not None and str(v).isdigit() for k, v in data.items()) and any(str(v).isdigit() for v in data.values()):
        # mapping name -> idx
        maxidx = max(int(v) for v in data.values())
        CLASS_NAMES = [None] * (maxidx + 1)
        for name, idx in data.items():
            CLASS_NAMES[int(idx)] = str(name)
    else:
        # maybe idx -> name (keys are indices as strings)
        maxidx = max(int(k) for k in data.keys())
        CLASS_NAMES = [None] * (maxidx + 1)
        for k, v in data.items():
            CLASS_NAMES[int(k)] = str(v)
else:
    raise ValueError("Unsupported class_names.json format; expected list or dict")

# input size inference
def get_target_size():
    try:
        shape = model.input_shape  # often (None, H, W, C)
        if len(shape) == 4:
            _, h, w, _ = shape
            if h and w:
                return (int(h), int(w))
    except Exception:
        pass
    return (224, 224)

TARGET_SIZE = get_target_size()
predict_lock = threading.Lock()

def preprocess_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize(TARGET_SIZE)
    arr = image.img_to_array(img)
    arr = np.expand_dims(arr, 0)
    # If you trained using EfficientNet's preprocess_input, use it:
    try:
        arr = eff_preprocess(arr)
    except Exception:
        arr = arr / 255.0
    return arr

@app.get("/")
def root():
    return {"message": "Plant Disease Classifier API running", "target_size": TARGET_SIZE}

@app.post("/predict")
async def predict(file: UploadFile = File(...), top_k: int = 3):
    content = await file.read()
    if not content:
        raise HTTPException(400, "Empty upload")
    try:
        img = preprocess_image(content)
    except Exception:
        raise HTTPException(400, "Invalid image")
    with predict_lock:
        preds = model.predict(img, verbose=0)
    preds = preds.flatten()
    top_k = max(1, min(10, int(top_k)))
    top_idx = preds.argsort()[::-1][:top_k]
    results = [{"index": int(i), "class": CLASS_NAMES[int(i)] if int(i) < len(CLASS_NAMES) else None, "confidence": float(preds[int(i)])} for i in top_idx]
    best = results[0]
    return {"predicted_class": best["class"], "predicted_index": best["index"], "confidence": best["confidence"], "top_k": results}
