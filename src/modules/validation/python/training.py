import json
import os
import sys
import uuid

import cv2
import numpy as np

eigenface = cv2.face.EigenFaceRecognizer_create()
fisherface = cv2.face.FisherFaceRecognizer_create()
lbph = cv2.face.LBPHFaceRecognizer_create()
width, height = 220, 220

ids = json.loads(sys.argv[1])
paths = json.loads(sys.argv[2])
number = sys.argv[3]

def get_image_with_id():
    faces = []
    for path in paths:
        face_image = cv2.resize(cv2.imread(path), (width, height))
        face_image = cv2.cvtColor(face_image, cv2.COLOR_RGB2GRAY)
        faces.append(face_image)
    return np.array(ids), faces

ids, faces = get_image_with_id()

eigenface.train(faces, ids)
eigenface.write("src/modules/validation/recognition-files/"+number+"/eigenClassifier.yml")

fisherface.train(faces, ids)
fisherface.write("src/modules/validation/recognition-files/"+number+"/fisherfaceClassifier.yml")

lbph.train(faces, ids)
lbph.write("src/modules/validation/recognition-files/"+number+"/lbphClassifier.yml")

print("success")
