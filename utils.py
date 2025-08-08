import numpy as np
from tensorflow.keras.applications.inception_v3 import preprocess_input
from tensorflow.keras.preprocessing import image

CLASS_NAMES = [
    'Clams', 'Corals', 'Crabs', 'Dolphin', 'Eel', 'Fish', 'Jelly Fish', 'Lobster',
    'Nudibranchs', 'Octopus', 'Otter', 'Penguin', 'Puffers', 'Sea Rays',
    'Sea Urchins', 'Seahorse', 'Seal', 'Sharks', 'Shrimp', 'Squid',
    'Starfish', 'Turtle_Tortoise', 'Whale'
]

def preprocess_image(pil_img, target_size=(224, 224)):
    img = pil_img.resize(target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    return img_array

def decode_prediction(preds):
    pred_index = np.argmax(preds, axis=1)[0]
    return CLASS_NAMES[pred_index]