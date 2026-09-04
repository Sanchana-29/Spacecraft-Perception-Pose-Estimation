import cv2


def get_detection_status():
    return {
        "pipeline": "ready",
        "detector": "OpenCV",
        "target": "Target Satellite",
        "status": "waiting"
    }


def detect_target(image):
    """
    Basic target detection pipeline.

    Input:
        image -> OpenCV image

    Output:
        Detection result with bounding box and confidence.
    """

    if image is None:
        return {
            "detected": False,
            "message": "No image provided"
        }

    # Convert image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Simple threshold for initial detection
    _, threshold = cv2.threshold(
        gray,
        100,
        255,
        cv2.THRESH_BINARY
    )

    # Find contours
    contours, _ = cv2.findContours(
        threshold,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    if not contours:
        return {
            "detected": False,
            "message": "Target not detected"
        }

    # Select the largest contour
    target_contour = max(contours, key=cv2.contourArea)

    x, y, width, height = cv2.boundingRect(target_contour)

    area = width * height

    # Basic confidence calculation
    confidence = min(99.0, max(50.0, area / 100))

    return {
        "detected": True,
        "target_id": "SAT-001",
        "target_name": "Target Satellite",
        "bounding_box": {
            "x": x,
            "y": y,
            "width": width,
            "height": height
        },
        "confidence": round(confidence, 2)
    }