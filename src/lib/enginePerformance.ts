import fs from "fs";
import csv from "csv-parser";

type VibrationData = {
  time: number;
  x: number;
  y: number;
  z: number;
};

type PotholeDetection = {
  startTime: number;
  endTime: number;
};

export async function parseVibrationData(filePath: string): Promise<VibrationData[]> {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    
    // Parse CSV manually
    const rows = text.split('\n');
    const data: VibrationData[] = [];

    // Skip header row (Time,X,Y,Z)
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].trim().split(',');
      if (values.length === 4) {  // Ensure we have all 4 values
        data.push({
          time: parseInt(values[0], 10),  // Time is first column
          x: parseFloat(values[1]),       // X is second column
          y: parseFloat(values[2]),       // Y is third column
          z: parseFloat(values[3])        // Z is fourth column
        });
      }
    }

    return data;
  } catch (error) {
    console.error('Error parsing vibration data:', error);
    return [];
  }
}

export function calculateEnginePerformanceScore(
  vibrationData: VibrationData[],
  potholeDetections: PotholeDetection[]
): number {
  if (!vibrationData || vibrationData.length === 0) {
    return 100;
  }

  const spikeThreshold = 10;
  let totalSpikes = 0;
  let explainedSpikes = 0;

  for (let i = 1; i < vibrationData.length; i++) {
    const prev = vibrationData[i - 1];
    const curr = vibrationData[i];

    const delta = Math.sqrt(
      Math.pow(curr.x - prev.x, 2) +
      Math.pow(curr.y - prev.y, 2) +
      Math.pow(curr.z - prev.z, 2)
    );

    if (delta > spikeThreshold) {
      totalSpikes++;
      const spikeTime = curr.time;
      const isExplained = potholeDetections.some(
        (pothole) => spikeTime >= pothole.startTime && spikeTime <= pothole.endTime
      );
      if (isExplained) {
        explainedSpikes++;
      }
    }
  }

  if (totalSpikes === 0) {
    return 100;
  }

  const unexplainedSpikes = totalSpikes - explainedSpikes;
  return Math.max(0, 100 - unexplainedSpikes * 10);
}