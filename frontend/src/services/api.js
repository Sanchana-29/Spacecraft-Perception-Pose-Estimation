const API_BASE_URL = "http://127.0.0.1:8001";

export async function getSystemStatus() {
  const response = await fetch(`${API_BASE_URL}/api/status`);

  if (!response.ok) {
    throw new Error("Failed to fetch system status");
  }

  return response.json();
}

export async function getSensorData() {
  const response = await fetch(`${API_BASE_URL}/api/sensors`);

  if (!response.ok) {
    throw new Error("Failed to fetch sensor data");
  }

  return response.json();
}

export async function getDetectionData() {
  const response = await fetch(`${API_BASE_URL}/api/detection`);

  if (!response.ok) {
    throw new Error("Failed to fetch detection data");
  }

  return response.json();
}

export async function getPoseData() {
  const response = await fetch(`${API_BASE_URL}/api/pose`);

  if (!response.ok) {
    throw new Error("Failed to fetch pose data");
  }

  return response.json();
}

/**
 * Converts Base64 Data URL to binary Blob object for multipart/form-data upload
 */
export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Sends captured sensor image Blob to FastAPI detection endpoint
 */
export async function runDetectionApi(imageBlob, confidence = 0.25) {
  const formData = new FormData();
  formData.append("file", imageBlob, "captured_frame.png");
  formData.append("conf", String(confidence));

  const response = await fetch(
    `${API_BASE_URL}/api/detection/run?conf=${encodeURIComponent(confidence)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Detection API failed [${response.status}]: ${errorText}`);
  }

  return response.json();
}

export async function runPoseEstimationApi(bbox) {
  const response = await fetch(`${API_BASE_URL}/api/pose/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bbox }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Pose Estimation API failed [${response.status}]: ${errorText}`);
  }

  return response.json();
}