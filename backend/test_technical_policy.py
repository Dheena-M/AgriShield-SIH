import os
import sys
import io
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from unittest.mock import patch

from PIL import Image


BACKEND = Path(__file__).resolve().parent
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))


class TechnicalPolicyTests(unittest.TestCase):
    def test_non_rice_crop_is_not_supported_by_disease_model(self):
        from ai import UnsupportedDiseaseCropError, analyze_leaf

        with self.assertRaises(UnsupportedDiseaseCropError):
            analyze_leaf(b"not-an-image", "tomato")

    def test_missing_rice_model_does_not_return_fallback_disease(self):
        from ai import DiseaseModelUnavailableError, analyze_leaf

        image = io.BytesIO()
        Image.new("RGB", (64, 64), (30, 140, 30)).save(image, format="PNG")
        with patch("ai._load_cnn", return_value=None):
            with self.assertRaises(DiseaseModelUnavailableError):
                analyze_leaf(image.getvalue(), "rice")

    def test_missing_crop_classifier_does_not_guess_crop(self):
        from crop_classifier import CropClassifierUnavailableError, identify_crop

        with patch("crop_classifier._load_model", return_value=None):
            with self.assertRaises(CropClassifierUnavailableError):
                identify_crop(b"not-an-image")

    def test_low_confidence_crop_is_rejected(self):
        from crop_classifier import CropIdentificationUncertainError, identify_crop

        class FakeModel:
            input_shape = (None, 224, 224, 3)

            def predict(self, batch, verbose=0):
                return [[0.61, 0.39]]

        image = io.BytesIO()
        Image.new("RGB", (64, 64), (30, 140, 30)).save(image, format="PNG")
        with patch("crop_classifier._load_model", return_value=FakeModel()):
            with patch("crop_classifier._labels", ["rice", "wheat"]):
                with self.assertRaises(CropIdentificationUncertainError):
                    identify_crop(image.getvalue())

    def test_crop_classifier_response_has_safe_confidence_shape(self):
        from crop_classifier import identify_crop

        class FakeModel:
            input_shape = (None, 224, 224, 3)

            def predict(self, batch, verbose=0):
                return [[0.91, 0.09]]

        image = io.BytesIO()
        Image.new("RGB", (64, 64), (30, 140, 30)).save(image, format="PNG")
        with patch("crop_classifier._load_model", return_value=FakeModel()):
            with patch("crop_classifier._labels", ["rice", "wheat"]):
                result = identify_crop(image.getvalue())
        self.assertEqual(result["crop"], "rice")
        self.assertEqual(result["accepted"], True)
        self.assertGreaterEqual(result["confidence"], result["threshold"])

    def test_cors_defaults_are_local_only(self):
        with patch.dict(os.environ, {"AGRISHIELD_CORS_ORIGINS": ""}, clear=False):
            import app

            self.assertNotIn("*", app.cors_origins)

    def test_production_requires_jwt_secret(self):
        module_name = "app"
        with patch.dict(os.environ, {"AGRISHIELD_ENV": "production", "AGRISHIELD_SECRET": ""}, clear=False):
            with self.assertRaises(RuntimeError):
                sys.modules.pop(module_name, None)
                __import__(module_name)
        sys.modules.pop(module_name, None)

    def test_missing_authorization_is_rejected(self):
        import app

        with self.assertRaises(app.HTTPException) as error:
            app.current_user(None, object())
        self.assertEqual(error.exception.status_code, 401)

    def test_non_farmer_cannot_book_an_appointment(self):
        import app

        doctor = type("User", (), {"role": "doctor"})()
        with self.assertRaises(app.HTTPException) as error:
            app.book(1, "2099-01-01", "09:00", "", None, doctor, object())
        self.assertEqual(error.exception.status_code, 403)

    def test_double_booking_returns_conflict(self):
        import app

        class Query:
            def filter(self, *args):
                return self

            def first(self):
                return type(
                    "Profile",
                    (),
                    {"verified": True, "days": "Mon,Tue,Wed,Thu,Fri,Sat,Sun", "slots": "09:00"},
                )()

        class Database:
            def get(self, model, identifier):
                if model is app.User:
                    return type("Doctor", (), {"role": "doctor"})()
                return None

            def query(self, model):
                return Query()

            def add(self, value):
                return None

            def commit(self):
                raise app.IntegrityError("duplicate", {}, Exception("slot conflict"))

            def rollback(self):
                return None

        date = (datetime.utcnow().date() + timedelta(days=1)).strftime("%Y-%m-%d")
        farmer = type("Farmer", (), {"role": "farmer", "id": 7, "name": "Test Farmer"})()
        with self.assertRaises(app.HTTPException) as error:
            app.book(2, date, "09:00", "", None, farmer, Database())
        self.assertEqual(error.exception.status_code, 409)


if __name__ == "__main__":
    unittest.main()
