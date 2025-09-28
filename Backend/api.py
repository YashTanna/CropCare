# api.py
"""
FastAPI-based inference server for a Keras model (EfficientNet-style).
This version:
 - prefers an *_inference.keras / *_inference.h5 model if present
 - loads models with compile=False (safe for inference)
 - infers target size and number of channels from the loaded model
 - preprocesses incoming images to match inferred channels/size
 - when a non-inference model is loaded, it will save a copy without optimizer
   (include_optimizer=False) named <original>_inference.keras/.h5 for future use.
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input as eff_preprocess
import numpy as np
from PIL import Image
import io
import json
import threading
import os
import logging
import sys

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = "models"
MODEL_FILES = [
    "plant_disease_model_inference.keras",
    "plant_disease_model.keras",
    "best_model_inference.h5",
    "best_model.h5",
    "final_model_inference.h5",
    "final_model.h5",
]

# If you used custom layers, register them here:
CUSTOM_OBJECTS = {
    # 'MyCustomLayer': MyCustomLayer,
}

def try_load_model(path):
    """
    Load a Keras model with compile=False. Return (model, path).
    Raises the underlying exception if load fails.
    """
    logger.info(f"Attempting to load model: {path}")
    # load_model supports both .keras and SavedModel directory and .h5
    m = load_model(path, compile=False, custom_objects=CUSTOM_OBJECTS or None)
    logger.info(f"Successfully loaded model: {path}")
    return m

def find_model_file():
    # prefer explicit candidates; otherwise pick first .keras/.h5 in models/
    for name in MODEL_FILES:
        p = os.path.join(MODEL_DIR, name)
        if os.path.exists(p):
            return p
    if os.path.isdir(MODEL_DIR):
        for f in os.listdir(MODEL_DIR):
            if f.endswith(".keras") or f.endswith(".h5") or os.path.isdir(os.path.join(MODEL_DIR,f)):
                return os.path.join(MODEL_DIR, f)
    return None

# ensure models dir exists
if not os.path.exists(MODEL_DIR):
    raise FileNotFoundError(f"Model directory '{MODEL_DIR}' not found. Create it and add your model file.")

model = None
model_path = None
last_exception = None
candidate = find_model_file()
if candidate is None:
    raise RuntimeError(f"No model file found in '{MODEL_DIR}'. Place a .keras or .h5 model there.")

try:
    model = try_load_model(candidate)
    model_path = candidate
except Exception as e:
    logger.exception(f"Primary model load failed for {candidate}: {e}")
    # Try other files listed explicitly (in case find_model_file returned a generic file)
    for name in MODEL_FILES:
        p = os.path.join(MODEL_DIR, name)
        if p == candidate:
            continue
        if os.path.exists(p):
            try:
                model = try_load_model(p)
                model_path = p
                break
            except Exception as e2:
                last_exception = e2
                logger.exception(f"Failed to load {p}: {e2}")
    if model is None:
        raise RuntimeError("Failed to load any model from models/; check logs above.") from (last_exception or e)

# If we loaded a non-inference-named model, save an inference-only copy for future runs
def ensure_inference_copy(orig_path, model_obj):
    base = os.path.basename(orig_path)
    name, ext = os.path.splitext(base)
    # ext might be empty if orig_path is a SavedModel directory -> create .keras
    if name.endswith("_inference"):
        return orig_path  # already inference copy
    outname = f"{name}_inference{ext if ext else '.keras'}"
    outpath = os.path.join(MODEL_DIR, outname)
    if os.path.exists(outpath):
        logger.info(f"Inference copy already exists: {outpath}")
        return outpath
    try:
        logger.info(f"Saving inference-only copy to: {outpath} (include_optimizer=False)")
        model_obj.save(outpath, include_optimizer=False)
        logger.info("Saved inference-only model successfully.")
        return outpath
    except Exception as e:
        logger.exception(f"Failed to save inference copy: {e}. That's OK — continuing with loaded model.")
        return orig_path

inference_model_path = ensure_inference_copy(model_path, model)

# ---- load class names ----
class_names_path = os.path.join(MODEL_DIR, "class_names.json")
if not os.path.exists(class_names_path):
    class_names_path = os.path.join(MODEL_DIR, "class_indices.json")

if not os.path.exists(class_names_path):
    raise FileNotFoundError("class_names.json or class_indices.json not found in models/ directory. "
                            "If you used flow_from_directory during training, save train_gen.class_indices to this file.")

with open(class_names_path, "r") as f:
    data = json.load(f)

# Normalize to CLASS_NAMES list: index -> class name
if isinstance(data, list):
    CLASS_NAMES = [str(x) for x in data]
elif isinstance(data, dict):
    try:
        # values numeric -> name->idx mapping
        if all((isinstance(v, int) or (isinstance(v, str) and str(v).isdigit())) for v in data.values()):
            maxidx = max(int(v) for v in data.values())
            CLASS_NAMES = [None] * (maxidx + 1)
            for name, idx in data.items():
                CLASS_NAMES[int(idx)] = str(name)
        else:
            # keys are indices
            maxidx = max(int(k) for k in data.keys())
            CLASS_NAMES = [None] * (maxidx + 1)
            for k, v in data.items():
                CLASS_NAMES[int(k)] = str(v)
    except Exception as e:
        raise ValueError("Unsupported class_names.json format; expected list or dict") from e
else:
    raise ValueError("Unsupported class_names.json format; expected list or dict")

# ---- infer model input size and channels ----
def infer_model_input():
    try:
        shape = model.input_shape  # often (None, H, W, C) or (H, W, C)
        if isinstance(shape, tuple):
            if len(shape) == 4:
                _, h, w, c = shape
                return int(h) if h else 224, int(w) if w else 224, int(c) if c else 3
            elif len(shape) == 3:
                h, w, c = shape
                return int(h) if h else 224, int(w) if w else 224, int(c) if c else 3
    except Exception as e:
        logger.exception(f"Could not infer model input shape: {e}")
    return 224, 224, 3

H, W, CHANNELS = infer_model_input()
TARGET_SIZE = (H, W)
logger.info(f"Inferred target size: {TARGET_SIZE}, channels: {CHANNELS}")

predict_lock = threading.Lock()

def preprocess_image(img_bytes):
    """
    Convert incoming image bytes into a numpy batch matching model input:
    - resize to TARGET_SIZE
    - convert to RGB if model expects 3 channels, to 'L' if 1 channel
    - apply EfficientNet preprocess_input if available, otherwise divide by 255
    """
    img = Image.open(io.BytesIO(img_bytes))
    if CHANNELS == 3:
        img = img.convert("RGB")
    elif CHANNELS == 1:
        img = img.convert("L")
    elif CHANNELS == 4:
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")

    img = img.resize(TARGET_SIZE)
    arr = image.img_to_array(img)  # shape (H, W, C)

    # If model expects 1 channel but arr has 3, convert to luminance
    if CHANNELS == 1 and arr.shape[-1] != 1:
        arr = np.dot(arr[..., :3], [0.2989, 0.5870, 0.1140])
        arr = np.expand_dims(arr, axis=-1)

    # If model expects 3 channels but arr has 1, tile it
    if CHANNELS == 3 and arr.shape[-1] == 1:
        arr = np.concatenate([arr, arr, arr], axis=-1)

    arr = np.expand_dims(arr, 0)  # batch dim

    # Try EfficientNet preprocess_input, fall back to scaling
    try:
        arr = eff_preprocess(arr)
    except Exception:
        arr = arr.astype("float32") / 255.0

    return arr

@app.get("/")
def root():
    return {
        "message": "Plant Disease Classifier API running",
        "target_size": TARGET_SIZE,
        "channels": CHANNELS,
        "model_path": os.path.basename(inference_model_path or model_path),
        "num_classes": len(CLASS_NAMES),
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...), top_k: int = 3):
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty upload")

    try:
        img = preprocess_image(content)
    except Exception as e:
        logger.exception(f"Preprocessing failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid image")

    with predict_lock:
        try:
            preds = model.predict(img, verbose=0)
        except Exception as e:
            logger.exception(f"Model prediction failed: {e}")
            raise HTTPException(status_code=500, detail="Model prediction failed")

    preds = np.asarray(preds).flatten()
    top_k = max(1, min(10, int(top_k)))
    top_idx = preds.argsort()[::-1][:top_k]

    results = []
    for i in top_idx:
        idx = int(i)
        cls = CLASS_NAMES[idx] if idx < len(CLASS_NAMES) else None
        conf = float(preds[idx])
        results.append({"index": idx, "class": cls, "confidence": conf})

    best = results[0] if results else {"index": None, "class": None, "confidence": None}
    return {
        "predicted_class": best["class"],
        "predicted_index": best["index"],
        "confidence": best["confidence"],
        "top_k": results,
    }

if __name__ == "__main__":
    # Helpful message for running the server
    print("api.py loaded. Run with:\n  uvicorn api:app --reload --host 0.0.0.0 --port 8000")
