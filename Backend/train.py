# train.py
import os
import json
import tensorflow as tf
from data_preprocessing import load_data
from model import create_model

def train_model(data_path="PlantVillage", model_save_path="models", epochs=10, batch_size=32):
    os.makedirs(model_save_path, exist_ok=True)
    os.makedirs("results", exist_ok=True)

    # Load data
    train_gen, valid_gen, steps_per_epoch, validation_steps = load_data(data_path, batch_size=batch_size)
    class_indices = train_gen.class_indices
    num_classes = len(class_indices)
    print("Found classes:", class_indices)

    # Save class indices
    with open(os.path.join(model_save_path, "class_indices.json"), "w") as f:
        json.dump(class_indices, f)

    # Build model
    model = create_model(num_classes=num_classes)
    model.summary()

    # Callbacks
    checkpoint_path = os.path.join(model_save_path, "best_model.h5")

    log_dir = os.path.join("results", "logs")
    os.makedirs(log_dir, exist_ok=True)

    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(filepath=checkpoint_path, monitor="val_accuracy", save_best_only=True, verbose=1),
        tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=3, verbose=1),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.2, patience=2, min_lr=1e-6, verbose=1),
        tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1)  # ✅ TensorBoard
    ]

    # Train
    history = model.fit(
        train_gen,
        steps_per_epoch=steps_per_epoch,
        validation_data=valid_gen,
        validation_steps=validation_steps,
        epochs=epochs,
        callbacks=callbacks
    )

    # Save final model
    final_model_path = os.path.join(model_save_path, "final_model.h5")
    model.save(final_model_path)
    print("Saved final model to", final_model_path)

    return history, model

if __name__ == "__main__":
    # Change epochs if you want longer training
    train_model(data_path="PlantVillage", model_save_path="models", epochs=10, batch_size=32)
