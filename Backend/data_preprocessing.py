# data_preprocessing.py
import os
import math
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def load_data(data_path, img_size=(224,224), batch_size=32, validation_split=0.2):
    """
    If `train/` and `valid/` folders exist, use them.
    Otherwise split the single dataset folder using validation_split.
    Returns: train_gen, valid_gen, steps_per_epoch, validation_steps
    """
    train_dir = os.path.join(data_path, "train")
    valid_dir = os.path.join(data_path, "valid")

    if os.path.isdir(train_dir) and os.path.isdir(valid_dir):
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=25, width_shift_range=0.2, height_shift_range=0.2,
            shear_range=0.2, zoom_range=0.2, horizontal_flip=True, fill_mode="nearest"
        )
        valid_datagen = ImageDataGenerator(rescale=1./255)
        train_gen = train_datagen.flow_from_directory(
            train_dir, target_size=img_size, batch_size=batch_size, class_mode="categorical", shuffle=True
        )
        valid_gen = valid_datagen.flow_from_directory(
            valid_dir, target_size=img_size, batch_size=batch_size, class_mode="categorical", shuffle=False
        )
    else:
        datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=25, width_shift_range=0.2, height_shift_range=0.2,
            shear_range=0.2, zoom_range=0.2, horizontal_flip=True, fill_mode="nearest",
            validation_split=validation_split
        )
        train_gen = datagen.flow_from_directory(
            data_path, target_size=img_size, batch_size=batch_size, class_mode="categorical",
            subset="training", shuffle=True
        )
        valid_gen = datagen.flow_from_directory(
            data_path, target_size=img_size, batch_size=batch_size, class_mode="categorical",
            subset="validation", shuffle=False
        )

    steps_per_epoch = math.ceil(train_gen.samples / batch_size)
    validation_steps = math.ceil(valid_gen.samples / batch_size)
    return train_gen, valid_gen, steps_per_epoch, validation_steps
