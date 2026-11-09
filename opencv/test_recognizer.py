import io
import json
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from unittest import mock

import cv2
import numpy as np

import recognizer


def write_face(folder, name, seed):
    pattern = np.random.default_rng(seed).integers(0, 255, (22, 22), dtype=np.uint8)
    noise = np.random.default_rng(seed * 100 + len(name)).integers(0, 20, (220, 220), dtype=np.uint8)
    image = cv2.add(cv2.resize(pattern, (220, 220), interpolation=cv2.INTER_NEAREST), noise)
    path = os.path.join(folder, name)
    cv2.imwrite(path, image)
    return path


class RecognizerTest(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.mkdtemp()
        self.model = os.path.join(self.folder, "model.yml")
        self.samples = {
            "ids": [1, 1, 1, 2, 2, 2],
            "paths": [write_face(self.folder, f"{label}-{n}.png", label) for label in (1, 2) for n in range(3)],
        }

    def run_command(self, *args, stdin=None):
        output = io.StringIO()
        with mock.patch.object(sys, "stdin", io.StringIO(json.dumps(stdin or {}))), redirect_stdout(output):
            recognizer.main(*args)
        return output.getvalue().strip()

    def predict(self, algorithm, image):
        label, distance = self.run_command(algorithm, "predict", self.model, image).split(",")
        return int(label), float(distance)

    def test_each_algorithm_recognizes_a_trained_face(self):
        probe = write_face(self.folder, "probe.png", 2)
        for algorithm in recognizer.RECOGNIZERS:
            with self.subTest(algorithm=algorithm):
                self.run_command(algorithm, "train", self.model, stdin=self.samples)
                self.assertEqual(2, self.predict(algorithm, probe)[0])

    def test_lbph_update_learns_a_new_label(self):
        self.run_command("lbph", "train", self.model, stdin=self.samples)
        newcomer = [write_face(self.folder, f"3-{n}.png", 3) for n in range(3)]
        self.run_command("lbph", "update", self.model, stdin={"ids": [3, 3, 3], "paths": newcomer})
        self.assertEqual(3, self.predict("lbph", write_face(self.folder, "probe3.png", 3))[0])

    def test_unreadable_image_raises(self):
        with self.assertRaises(ValueError):
            recognizer.load_face(os.path.join(self.folder, "missing.png"))


if __name__ == "__main__":
    unittest.main()
