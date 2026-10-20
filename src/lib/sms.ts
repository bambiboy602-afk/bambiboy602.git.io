export interface SMSLogEntry {
  id: string;
  timestamp: string;
  direction: "inbound" | "outbound";
  sender: string;
  recipient: string;
  message: string;
  status: "received" | "delivered" | "failed";
  gateway: "textbee";
  details?: any;
}

// In-memory ring buffer of recent SMS activity (last 100 events)
const smsLogs: SMSLogEntry[] = [];
const MAX_LOGS = 100;

export function recordSMSLog(entry: Omit<SMSLogEntry, "id" | "timestamp">) {
  const newLog: SMSLogEntry = {
    ...entry,
    id: `sms_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  smsLogs.unshift(newLog);
  if (smsLogs.length > MAX_LOGS) {
    smsLogs.pop();
  }
  return newLog;
}

export function getSMSLogs(): SMSLogEntry[] {
  return [...smsLogs];
}

export function getSMSStats() {
  const total = smsLogs.length;
  const inbound = smsLogs.filter((l) => l.direction === "inbound").length;
  const outbound = smsLogs.filter((l) => l.direction === "outbound").length;
  const delivered = smsLogs.filter((l) => l.status === "delivered").length;
  const failed = smsLogs.filter((l) => l.status === "failed").length;

  return { total, inbound, outbound, delivered, failed };
}

// TextBee.dev dispatch helper
export async function sendViaTextBee(recipient: string, message: string) {
  const apiKey = process.env.TEXTBEE_API_KEY;
  const deviceId = process.env.TEXTBEE_DEVICE_ID;

  if (!apiKey || !deviceId) {
    throw new Error("TextBee API Key or Device ID missing in environment variables.");
  }

  // Clean and format recipient to E.164 numbers
  const cleanedRecipient = recipient.replace(/[^\+0-9]/g, "");

  const response = await fetch("https://api.textbee.dev/api/v1/gateway/send-sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      recipients: [cleanedRecipient],
      message,
      deviceId,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`TextBee Send Error (${response.status}): ${JSON.stringify(result)}`);
  }
  return result;
}

// Direct SMS Gateway Dispatcher
export async function sendSMS(recipient: string, message: string) {
  if (process.env.TEXTBEE_API_KEY && process.env.TEXTBEE_DEVICE_ID) {
    return await sendViaTextBee(recipient, message);
  }

  // If credentials are not yet configured
  throw new Error("No SMS Gateway configured. Please provide TEXTBEE_API_KEY and TEXTBEE_DEVICE_ID in environment settings.");
}
