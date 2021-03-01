import cv2
import json
import sys
import numpy as np


recognizer = cv2.face.LBPHFaceRecognizer_create()
width, height = 220, 220

ids = json.loads(sys.argv[1])
paths = json.loads(sys.argv[2])
fileName = sys.argv[3]

recognizer.read("./classifiers/subject-" + fileName + ".yml")

def get_image_with_id():
    faces = []
    for path in paths:
        face_image = cv2.resize(cv2.imread(path), (width, height))
        face_image = cv2.cvtColor(face_image, cv2.COLOR_RGB2GRAY)
        faces.append(face_image)
    return np.array(ids), faces


ids, faces = get_image_with_id()

recognizer.update(faces, ids)
recognizer.write("./classifiers/subject-" + fileName + ".yml")
print("subject-" + fileName + ".yml")
