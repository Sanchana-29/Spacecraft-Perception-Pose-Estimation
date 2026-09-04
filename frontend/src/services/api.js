const API_BASE_URL = "http://127.0.0.1:8000";

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