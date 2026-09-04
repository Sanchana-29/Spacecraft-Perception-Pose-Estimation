from fastapi import APIRouter

from sensors.simulator import get_sensor_status
from cv.detection import get_detection_status
from cv.pose_estimation import get_pose_status, estimate_pose


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


@router.get("/pose")
def pose():
    return estimate_pose()