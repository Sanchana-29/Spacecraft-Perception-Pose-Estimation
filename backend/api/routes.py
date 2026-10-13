from fastapi import APIRouter, UploadFile, File, HTTPException
import cv2
import numpy as np

from sensors.simulator import get_sensor_status
from cv.detection import get_detection_status, detect_target
from pydantic import BaseModel
from cv.pose_estimation import get_pose_status, estimate_pose

class PoseRequest(BaseModel):
    bbox: dict

router = APIRouter(prefix="/api")


@router.get("/status")
def system_status():
    return {
        "backend": "online",
        "cv_pipeline": "ready",
        "sensors": get_sensor_status(),
        "detection": get_detection_status(),
        "pose_estimation": get_pose_status()
    }


@router.get("/sensors")
def sensors():
    return get_sensor_status()


@router.get("/detection")
def detection():
    return get_detection_status()


@router.post("/detection/run")
async def run_detection(file: UploadFile = File(...)):
    """
    Accepts uploaded sensor frame image, decodes with OpenCV,
    and runs the target detection pipeline.
    """
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file payload")

        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400, detail="Could not decode image")

        result = detect_target(image)
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection error: {str(e)}")


@router.post("/pose/estimate")
def estimate_pose_api(req: PoseRequest):
    return estimate_pose(req.bbox)