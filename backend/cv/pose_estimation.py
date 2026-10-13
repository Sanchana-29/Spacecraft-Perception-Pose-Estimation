import cv2
import numpy as np


def get_pose_status():
    return {
        "pipeline": "ready",
        "method": "OpenCV solvePnP",
        "status": "waiting"
    }


def estimate_pose(bbox=None):
    """
    Lightweight placeholder for pose estimation.
    Currently accepts a bounding box but returns null/unavailable
    because a full estimator is not yet implemented.
    """
    if not bbox:
        return {
            "success": False,
            "message": "No bounding box provided for pose estimation"
        }
        
    return {
        "success": False,
        "message": "Pose estimator not yet implemented",
        "position": {
            "x": None,
            "y": None,
            "z": None
        },
        "attitude": {
            "roll": None,
            "pitch": None,
            "yaw": None
        },
        "confidence": None,
        "method": "OpenCV solvePnP (Pending)"
    }