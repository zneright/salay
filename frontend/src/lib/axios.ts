import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface ApiDebugLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: number | 'PENDING' | 'ERROR';
  durationMs?: number;
  requestData?: any;
  responseData?: any;
  errorDetail?: string;
}

export const apiDebugLogs: ApiDebugLog[] = [];
type LogListener = (logs: ApiDebugLog[]) => void;
const listeners: Set<LogListener> = new Set();

export const subscribeApiLogs = (listener: LogListener) => {
  listeners.add(listener);
  listener([...apiDebugLogs]);
  return () => {
    listeners.delete(listener);
  };
};

export const clearApiDebugLogs = () => {
  apiDebugLogs.length = 0;
  listeners.forEach((fn) => fn([]));
};

function notifyListeners() {
  const currentLogs = [...apiDebugLogs];
  listeners.forEach((fn) => fn(currentLogs));
}

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (F12 Console Logger & Debugger Tracker)
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const logId = Math.random().toString(36).substring(2, 9);
    const startTime = performance.now();
    const method = (config.method || 'GET').toUpperCase();
    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;

    // Attach debug metadata to config
    (config as any)._logMetadata = { logId, startTime, method, fullUrl };

    // F12 Console Output
    console.groupCollapsed(`%c[SNOWFLAKE API] 🚀 ${method} ${config.url}`, 'color: #38bdf8; font-weight: bold;');
    console.log('Target URL  :', fullUrl);
    console.log('Request Data:', config.data || '(None)');
    console.groupEnd();

    // Store in global Debug Logs Array
    const newLog: ApiDebugLog = {
      id: logId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      method,
      url: config.url || '',
      status: 'PENDING',
      requestData: config.data,
    };

    apiDebugLogs.unshift(newLog);
    if (apiDebugLogs.length > 50) apiDebugLogs.pop();
    notifyListeners();

    return config;
  },
  (error) => {
    console.error('%c[SNOWFLAKE API REQUEST ERROR]', 'color: #ef4444; font-weight: bold;', error);
    return Promise.reject(error);
  }
);

// Response Interceptor (F12 Console Logger & Response Debugger)
httpClient.interceptors.response.use(
  (response) => {
    const meta = (response.config as any)._logMetadata;
    const durationMs = meta ? Math.round(performance.now() - meta.startTime) : 0;
    const method = meta?.method || response.config.method?.toUpperCase() || 'GET';

    // F12 Console Output
    console.groupCollapsed(`%c[SNOWFLAKE API] ✅ ${method} ${response.status} ${response.config.url} (${durationMs}ms)`, 'color: #34d399; font-weight: bold;');
    console.log('Status Code :', response.status);
    console.log('Response Payload:', response.data);
    console.groupEnd();

    // Update debug log entry
    if (meta?.logId) {
      const entry = apiDebugLogs.find((l) => l.id === meta.logId);
      if (entry) {
        entry.status = response.status;
        entry.durationMs = durationMs;
        entry.responseData = response.data;
        notifyListeners();
      }
    }

    return response;
  },
  (error) => {
    const config = error.config || {};
    const meta = (config as any)._logMetadata;
    const durationMs = meta ? Math.round(performance.now() - meta.startTime) : 0;
    const method = meta?.method || config.method?.toUpperCase() || 'HTTP';
    const status = error.response?.status || 500;
    const data = error.response?.data;
    const errorMsg = data?.detail || data?.message || error.message || 'Network / Snowflake connection error';

    // F12 Console Output
    console.group(`%c[SNOWFLAKE API ERROR] ❌ ${method} ${status} ${config.url || ''} (${durationMs}ms)`, 'color: #f87171; font-weight: bold;');

    console.error('Error Details:', errorMsg);
    console.log('Server Payload:', data);
    console.groupEnd();

    // Update debug log entry
    if (meta?.logId) {
      const entry = apiDebugLogs.find((l) => l.id === meta.logId);
      if (entry) {
        entry.status = status;
        entry.durationMs = durationMs;
        entry.errorDetail = errorMsg;
        entry.responseData = data;
        notifyListeners();
      }
    }

    const formattedError = {
      status,
      message: errorMsg,
      details: data?.details || null,
      code: data?.error_code || 'SNOWFLAKE_API_ERROR',
      response: error.response,
    };

    return Promise.reject(formattedError);
  }
);
