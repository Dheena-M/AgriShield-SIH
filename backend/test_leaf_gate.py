import io
import unittest

from PIL import Image, ImageDraw, ImageFilter

from leaf_gate import evaluate_leaf_image


def png(image: Image.Image) -> bytes:
    stream = io.BytesIO()
    image.save(stream, format="PNG")
    return stream.getvalue()


class LeafGateTests(unittest.TestCase):
    def test_empty_corrupt_dark_and_blurry_images_are_rejected(self):
        self.assertFalse(evaluate_leaf_image(b"")["accepted"])
        self.assertFalse(evaluate_leaf_image(b"not-an-image")["accepted"])
        self.assertFalse(evaluate_leaf_image(png(Image.new("RGB", (160, 160), (2, 2, 2))))["accepted"])

        blurry = Image.new("RGB", (160, 160), (220, 220, 205))
        ImageDraw.Draw(blurry).ellipse((25, 10, 135, 150), fill=(40, 145, 45))
        self.assertFalse(evaluate_leaf_image(png(blurry.filter(ImageFilter.GaussianBlur(20))))["accepted"])

    def test_face_and_random_object_are_rejected(self):
        face = Image.new("RGB", (160, 160), (40, 150, 45))
        draw = ImageDraw.Draw(face)
        draw.ellipse((35, 20, 125, 135), fill=(190, 135, 105))
        draw.ellipse((55, 60, 65, 70), fill="black")
        draw.ellipse((95, 60, 105, 70), fill="black")
        self.assertFalse(evaluate_leaf_image(png(face))["accepted"])

        object_image = Image.new("RGB", (160, 160), (30, 30, 140))
        ImageDraw.Draw(object_image).rectangle((30, 40, 130, 120), fill=(180, 180, 180))
        self.assertFalse(evaluate_leaf_image(png(object_image))["accepted"])

    def test_leaf_is_accepted(self):
        leaf = Image.new("RGB", (160, 160), (220, 220, 205))
        draw = ImageDraw.Draw(leaf)
        draw.ellipse((25, 10, 135, 150), fill=(40, 145, 45), outline=(20, 90, 25), width=4)
        draw.line((80, 20, 80, 145), fill=(210, 220, 120), width=4)
        result = evaluate_leaf_image(png(leaf))
        self.assertTrue(result["accepted"])
        self.assertEqual(result["reason"], "leaf")


if __name__ == "__main__":
    unittest.main()
