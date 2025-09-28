# resave_model.py
import os
import logging
from tensorflow.keras.models import load_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_DIR = "models"
CANDIDATES = ["plant_disease_model.keras", "best_model.h5", "final_model.h5"]

def find_model():
    for name in CANDIDATES:
        path = os.path.join(MODEL_DIR, name)
        if os.path.exists(path):
            return path
    # also try any .keras or .h5 in models/
    for f in os.listdir(MODEL_DIR):
        if f.endswith(".keras") or f.endswith(".h5"):
            return os.path.join(MODEL_DIR, f)
    return None

def main():
    path = find_model()
    if path is None:
        logger.error("No model file found in models/. Put your .keras or .h5 file there.")
        return
    logger.info(f"Found model: {path}")
    try:
        model = load_model(path, compile=False)
        logger.info("Model loaded successfully (compile=False). Now re-saving without optimizer...")
        base, ext = os.path.splitext(os.path.basename(path))
        outname = f"{base}_inference.keras" if ext != ".h5" else f"{base}_inference.h5"
        outpath = os.path.join(MODEL_DIR, outname)
        model.save(outpath, include_optimizer=False)
        logger.info(f"Saved inference-only model to: {outpath}")
    except Exception as e:
        logger.exception("Failed to load or re-save the model. If there are custom layers/objects, "
                         "you may need to pass custom_objects to load_model or rebuild the model and call load_weights.")
        raise

if __name__ == "__main__":
    main()
