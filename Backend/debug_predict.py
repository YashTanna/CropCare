# debug_predict.py
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import json, os, sys

MODEL_PATH = os.path.join("models", "best_model.h5")
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = os.path.join("models", "final_model.h5")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("Model not found. Train model first.")

model = load_model(MODEL_PATH)

with open(os.path.join("models", "class_indices.json"), "r") as f:
    class_indices = json.load(f)
CLASS_NAMES = [None] * len(class_indices)
for name, idx in class_indices.items():
    CLASS_NAMES[idx] = name

def preprocess_image_file(path):
    img = Image.open(path).convert("RGB").resize((224,224))
    arr = image.img_to_array(img)
    arr = np.expand_dims(arr, axis=0)
    arr = arr / 255.0
    return arr

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python debug_predict.py path/to/image.jpg [runs=5]")
        sys.exit(1)
    img_path = sys.argv[1]
    runs = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    arr = preprocess_image_file(img_path)
    for i in range(runs):
        preds = model.predict(arr, verbose=0)[0]
        idx = int(preds.argmax())
        print(f"Run {i+1}: {CLASS_NAMES[idx]} ({preds[idx]:.4f})")
        # print full vector if you want to inspect:
        # print(preds)
