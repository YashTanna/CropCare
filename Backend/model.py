# model.py
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.applications import MobileNetV2

def create_model(input_shape=(224,224,3), num_classes=15, base_trainable=False, lr=1e-3):
    """
    Transfer-learning MobileNetV2 model.
    NOTE: using Rescaling layer here to match training preprocessing (rescale=1./255).
    """
    base_model = MobileNetV2(input_shape=input_shape, include_top=False, weights="imagenet")
    base_model.trainable = base_trainable

    inputs = tf.keras.Input(shape=input_shape)
    x = layers.Rescaling(1./255)(inputs)   # preprocessing consistent with ImageDataGenerator(rescale=1./255)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs)
    model.compile(optimizer=optimizers.Adam(learning_rate=lr),
                  loss="categorical_crossentropy", metrics=["accuracy"])
    return model
