import cv2
import sys

recognizer = cv2.face.FisherFaceRecognizer_create()
width, height = 220, 220

path = sys.argv[1]
fileName = sys.argv[2]

recognizer.read("src/shared/files/subject-" + fileName + ".yml")

gray_image = cv2.cvtColor(cv2.imread(path), cv2.COLOR_BGR2GRAY)
face_image = cv2.resize(gray_image, (width, height))
id, confidence = recognizer.predict(face_image)
print(str(id)+","+str(confidence))
