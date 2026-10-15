import { createContext, useContext, useState } from "react";
import { dataURLtoBlob, runDetectionApi, runPoseEstimationApi } from "../services/api";

const SensorContext = createContext();

const STORAGE_KEY = "spacecraft_captured_frame";
const RESULT_STORAGE_KEY = "spacecraft_detection_result";
const POSE_STORAGE_KEY = "spacecraft_pose_result";

export function SensorProvider({ children }) {
  const [selectedSensor, setSelectedSensor] = useState("RGB-D Camera");

  const [capturedFrame, setCapturedFrameState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [detectionResult, setDetectionResultState] = useState(() => {
    try {
      const savedFrameStr = sessionStorage.getItem(STORAGE_KEY);
      const savedResultStr = sessionStorage.getItem(RESULT_STORAGE_KEY);
      if (!savedFrameStr || !savedResultStr) return null;
      const savedFrame = JSON.parse(savedFrameStr);
      const savedRes = JSON.parse(savedResultStr);
      // Validate that the stored detection result actually belongs to the current captured frame
      if (savedRes && savedFrame && savedRes.frameId === savedFrame.id) {
        return savedRes;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);

  const [poseResult, setPoseResultState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(POSE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState(null);

  const [isEstimatingPose, setIsEstimatingPose] = useState(false);
  const [poseError, setPoseError] = useState(null);

  const [sensorThumbnails, setSensorThumbnails] = useState({});

  const updateSensorThumbnail = (sensorName, imageData) => {
    if (!sensorName || !imageData) return;
    setSensorThumbnails((prev) => {
      if (prev[sensorName] === imageData) return prev;
      return { ...prev, [sensorName]: imageData };
    });
  };

  const setCapturedFrame = (frame) => {
    setCapturedFrameState(frame);
    setDetectionResultState(null);
    setDetectionError(null);
    setPoseResultState(null);
    setPoseError(null);
    try {
      if (frame) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(frame));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      sessionStorage.removeItem(RESULT_STORAGE_KEY);
      sessionStorage.removeItem(POSE_STORAGE_KEY);
    } catch (err) {
      console.warn("Could not save captured frame to sessionStorage:", err);
    }
  };

  const setDetectionResult = (result) => {
    setDetectionResultState(result);
    try {
      if (result) {
        sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
      } else {
        sessionStorage.removeItem(RESULT_STORAGE_KEY);
      }
    } catch (err) {
      console.warn("Could not save detection result to sessionStorage:", err);
    }
  };

  const setPoseResult = (result) => {
    setPoseResultState(result);
    try {
      if (result) {
        sessionStorage.setItem(POSE_STORAGE_KEY, JSON.stringify(result));
      } else {
        sessionStorage.removeItem(POSE_STORAGE_KEY);
      }
    } catch (err) {
      console.warn("Could not save pose result to sessionStorage:", err);
    }
  };

  const runDetection = async (overrideThreshold) => {
    if (!capturedFrame?.imageData) return;

    setIsDetecting(true);
    setDetectionError(null);

    // Clear previous detection result immediately
    setDetectionResult(null);

    const thresholdToUse =
      typeof overrideThreshold === "number"
        ? overrideThreshold
        : confidenceThreshold;

    try {
      const blob = dataURLtoBlob(capturedFrame.imageData);
      const result = await runDetectionApi(blob, thresholdToUse);
      // Tag the result with current frame ID so we know which frame it belongs to
      const taggedResult = {
        ...result,
        frameId: capturedFrame.id,
      };
      setDetectionResult(taggedResult);
    } catch (err) {
      console.error("Detection error:", err);
      setDetectionError(
        err.message || "Failed to connect to backend Detection API"
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const runPoseEstimation = async (bbox) => {
    if (!bbox) return;

    setIsEstimatingPose(true);
    setPoseError(null);

    try {
      const result = await runPoseEstimationApi(bbox);
      setPoseResult(result);
    } catch (err) {
      console.error("Pose Estimation error:", err);
      setPoseError(err.message || "Failed to connect to backend Pose API");
    } finally {
      setIsEstimatingPose(false);
    }
  };

  return (
    <SensorContext.Provider
      value={{
        selectedSensor,
        setSelectedSensor,
        sensorThumbnails,
        updateSensorThumbnail,
        capturedFrame,
        setCapturedFrame,
        detectionResult,
        setDetectionResult,
        confidenceThreshold,
        setConfidenceThreshold,
        isDetecting,
        detectionError,
        runDetection,
        poseResult,
        setPoseResult,
        isEstimatingPose,
        poseError,
        runPoseEstimation,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}

export function useSensor() {
  return useContext(SensorContext);
}