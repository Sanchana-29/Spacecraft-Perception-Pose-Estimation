
from pathlib import Path

import cv2
from ultralytics import YOLO


# Project paths
BACKEND_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = (
    BACKEND_DIR
    / "runs"
    / "satellite_yolov8n_v1"
    / "weights"
    / "best.pt"
)

# Load the trained model once, not for every request.
_model = None
_model_error = None


def get_model():
    global _model, _model_error

    if _model is not None:
        return _model

    if _model_error is not None:
        raise RuntimeError(_model_error)

    if not MODEL_PATH.is_file():
        _model_error = f"Trained YOLO weights not found: {MODEL_PATH}"
        raise RuntimeError(_model_error)

    try:
        _model = YOLO(str(MODEL_PATH))
        return _model
    except Exception as exc:
        _model_error = f"Could not load YOLO model: {exc}"
        raise RuntimeError(_model_error) from exc


def get_detection_status():
    try:
        get_model()
        return {
            "pipeline": "ready",
            "detector": "YOLOv8n",
            "model": "satellite_yolov8n_v1",
            "target": "Satellite",
            "supported_sensors": ["RGB-D Camera", "Stereo Camera"],
            "status": "ready",
            "note": "Trained satellite detector loaded (calibrated for optical RGB-D sensor feeds).",
        }
    except Exception as exc:
        return {
            "pipeline": "unavailable",
            "detector": "YOLOv8n",
            "target": "Satellite",
            "status": "error",
            "note": str(exc),
        }


def detect_target(image, conf=0.25):
    if image is None:
        return {
            "detected": False,
            "detections": [],
            "message": "No image provided",
        }

    # Validate and normalize confidence threshold
    try:
        threshold = float(conf) if conf is not None else 0.25
        if threshold > 1.0:
            threshold = threshold / 100.0
        threshold = max(0.01, min(0.99, threshold))
    except (ValueError, TypeError):
        threshold = 0.25

    if len(image.shape) == 2:
        inference_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    elif len(image.shape) == 3 and image.shape[2] == 3:
        inference_image = image
    elif len(image.shape) == 3 and image.shape[2] == 4:
        inference_image = cv2.cvtColor(image, cv2.COLOR_BGRA2BGR)
    else:
        return {
            "detected": False,
            "detections": [],
            "message": "Unsupported image format",
        }

    try:
        model = get_model()
        result = model.predict(
            source=inference_image,
            imgsz=640,
            conf=threshold,
            iou=0.50,
            verbose=False,
        )[0]

        img_h, img_w = inference_image.shape[:2]
        detections = []

        if result.boxes is not None:
            for index, box in enumerate(result.boxes):
                x1, y1, x2, y2 = box.xyxy[0].cpu().tolist()
                class_id = int(box.cls[0].item())
                confidence = float(box.conf[0].item())

                # Clamp coordinates to original image pixel bounds
                clamped_x1 = max(0.0, min(float(img_w), float(x1)))
                clamped_y1 = max(0.0, min(float(img_h), float(y1)))
                clamped_x2 = max(0.0, min(float(img_w), float(x2)))
                clamped_y2 = max(0.0, min(float(img_h), float(y2)))

                bw = max(0.0, clamped_x2 - clamped_x1)
                bh = max(0.0, clamped_y2 - clamped_y1)

                detections.append({
                    "id": f"SAT-{index + 1:03d}",
                    "class_name": model.names.get(class_id, "satellite"),
                    "class_id": class_id,
                    "confidence": round(confidence, 4),
                    "bounding_box": {
                        "x": int(round(clamped_x1)),
                        "y": int(round(clamped_y1)),
                        "width": int(round(bw)),
                        "height": int(round(bh)),
                    },
                })

        return {
            "detected": len(detections) > 0,
            "detections": detections,
            "image_width": int(img_w),
            "image_height": int(img_h),
            "confidence_threshold": round(threshold, 4),
            "message": (
                f"YOLO detected {len(detections)} satellite(s)."
                if detections
                else "No satellite detected above the confidence threshold."
            ),
        }

    except Exception as exc:
        raise RuntimeError(f"YOLO detection failed: {exc}") from exc
