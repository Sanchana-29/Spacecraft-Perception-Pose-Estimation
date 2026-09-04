import random
import time


def get_sensor_status():
    return {
        "rgbd": {
            "name": "RGB-D Camera",
            "status": "active",
            "fps": 30,
            "range_m": 10.0,
            "latency_ms": 12
        },

        "stereo": {
            "name": "Stereo Camera",
            "status": "active",
            "fps": 30,
            "range_m": 15.0,
            "latency_ms": 14
        },

        "thermal": {
            "name": "Thermal Camera",
            "status": "active",
            "fps": 25,
            "range_m": 12.0,
            "latency_ms": 18
        },

        "lidar": {
            "name": "LiDAR",
            "status": "active",
            "fps": 20,
            "range_m": 20.0,
            "latency_ms": 10
        }
    }


def get_simulated_target():
    return {
        "target_id": "SAT-001",
        "target_name": "Target Satellite",
        "distance_m": round(random.uniform(6.5, 8.0), 2),
        "timestamp": time.time()
    }