"""Train, update and query OpenCV face recognizers.

Usage:
    recognizer.py ALGORITHM train MODEL    < {"ids": [...], "paths": [...]}
    recognizer.py ALGORITHM update MODEL   < {"ids": [...], "paths": [...]}
    recognizer.py ALGORITHM predict MODEL IMAGE

predict prints "<label>,<distance>"; lower distance means a closer match.
"""

import json
import sys

import cv2
import numpy as np

FACE_SIZE = (220, 220)

RECOGNIZERS = {
    "eigenfaces": cv2.face.EigenFaceRecognizer_create,
    "fisherfaces": cv2.face.FisherFaceRecognizer_create,
    "lbph": cv2.face.LBPHFaceRecognizer_create,
}


def load_face(path):
    image = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        raise ValueError(f"cannot read image {path}")
    return cv2.equalizeHist(cv2.resize(image, FACE_SIZE))


def read_samples():
    samples = json.load(sys.stdin)
    faces = [load_face(path) for path in samples["paths"]]
    return faces, np.array(samples["ids"], dtype=np.int32)


def train(recognizer, model):
    recognizer.train(*read_samples())
    recognizer.write(model)


def update(recognizer, model):
    recognizer.read(model)
    recognizer.update(*read_samples())
    recognizer.write(model)


def predict(recognizer, model, image):
    recognizer.read(model)
    label, distance = recognizer.predict(load_face(image))
    print(f"{label},{distance}")


def main(algorithm, command, model, *args):
    recognizer = RECOGNIZERS[algorithm]()
    {"train": train, "update": update, "predict": predict}[command](recognizer, model, *args)


if __name__ == "__main__":
    main(*sys.argv[1:])
