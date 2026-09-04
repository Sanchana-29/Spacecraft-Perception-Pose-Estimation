import cv2
import numpy as np


def get_pose_status():
    return {
        "pipeline": "ready",
        "method": "OpenCV solvePnP",
        "status": "waiting"
    }


def estimate_pose():
    """
    Spacecraft pose estimation using OpenCV solvePnP.
    """

    # Known 3D points on the target spacecraft
    object_points = np.array([
        [-1.0, -1.0, 0.0],
        [ 1.0, -1.0, 0.0],
        [ 1.0,  1.0, 0.0],
        [-1.0,  1.0, 0.0],
        [ 0.0,  0.0, 1.0],
        [ 0.0,  0.0, -1.0]
    ], dtype=np.float32)

    # Corresponding 2D points from camera image
    image_points = np.array([
        [320.0, 240.0],
        [420.0, 240.0],
        [420.0, 340.0],
        [320.0, 340.0],
        [370.0, 290.0],
        [370.0, 300.0]
    ], dtype=np.float32)

    # Camera intrinsic parameters
    fx = 800.0
    fy = 800.0
    cx = 370.0
    cy = 290.0

    camera_matrix = np.array([
        [fx, 0, cx],
        [0, fy, cy],
        [0, 0, 1]
    ], dtype=np.float32)

    # No lens distortion for initial testing
    distortion_coeffs = np.zeros((4, 1), dtype=np.float32)

    # OpenCV PnP
    success, rotation_vector, translation_vector = cv2.solvePnP(
        object_points,
        image_points,
        camera_matrix,
        distortion_coeffs,
        flags=cv2.SOLVEPNP_ITERATIVE
    )

    if not success:
        return {
            "success": False,
            "message": "Pose estimation failed"
        }

    # Convert rotation vector to rotation matrix
    rotation_matrix, _ = cv2.Rodrigues(rotation_vector)

    # Calculate Euler angles
    sy = np.sqrt(
        rotation_matrix[0, 0] ** 2 +
        rotation_matrix[1, 0] ** 2
    )

    singular = sy < 1e-6

    if not singular:
        roll = np.arctan2(
            rotation_matrix[2, 1],
            rotation_matrix[2, 2]
        )

        pitch = np.arctan2(
            -rotation_matrix[2, 0],
            sy
        )

        yaw = np.arctan2(
            rotation_matrix[1, 0],
            rotation_matrix[0, 0]
        )
    else:
        roll = np.arctan2(
            -rotation_matrix[1, 2],
            rotation_matrix[1, 1]
        )

        pitch = np.arctan2(
            -rotation_matrix[2, 0],
            sy
        )

        yaw = 0.0

    # Convert radians to degrees
    roll = float(np.degrees(roll))
    pitch = float(np.degrees(pitch))
    yaw = float(np.degrees(yaw))

    return {
        "success": True,

        "position": {
            "x": round(float(translation_vector[0][0]), 3),
            "y": round(float(translation_vector[1][0]), 3),
            "z": round(float(translation_vector[2][0]), 3)
        },

        "attitude": {
            "roll": round(roll, 2),
            "pitch": round(pitch, 2),
            "yaw": round(yaw, 2)
        },

        "method": "OpenCV solvePnP"
    }