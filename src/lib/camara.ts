// Mock implementation of CAMARA APIs for Demo purposes to ensure 100% reliability

export async function verifyDeviceLocation(phoneNumber: string, latitude: number, longitude: number, radiusMeters: number = 1000) {
  // +99999991000 is our dedicated FRAUD/MISMATCH testing number
  if (phoneNumber === "+99999991000") {
    return { success: true, status: "FALSE", matchRate: 0 };
  }
  return { success: true, status: "TRUE", matchRate: 100 };
}

export async function getDeviceLocation(phoneNumber: string) {
  return { success: true, latitude: 12.002, longitude: 8.591, radius: 50 };
}

export async function verifyKycMatch(phoneNumber: string, name: string) {
  if (phoneNumber === "+99999991000" || name.toLowerCase().includes("fraud")) {
    return { success: true, score: 30, status: 'MISMATCH', details: { nameMatch: false } };
  }
  return { success: true, score: 98, status: 'MATCHED', details: { nameMatch: true } };
}

export async function checkSimSwap(phoneNumber: string, maxAgeHours: number = 24) {
  if (phoneNumber === "+99999991000") return { swapped: true, riskLevel: 'HIGH' };
  return { swapped: false, riskLevel: 'LOW' };
}

export async function requestCustomerInfo(phoneNumber: string) {
  return { success: true, data: { status: "DELIVERED" } };
}

export async function verifyNumber(phoneNumber: string, code: string, state: string) {
  return { success: true, verified: true };
}

export async function subscribeToGeofence(phoneNumber: string, webhookUrl: string, lat: number, lng: number, radius: number) {
  return { success: true, subscriptionId: "sub_mock_999" };
}
