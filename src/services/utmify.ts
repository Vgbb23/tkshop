const UTM_STORAGE_KEY = 'tkshop_utm_params';

const EXTRA_TRACKING_KEYS = new Set([
  'src',
  'sck',
  'ttclid',
  'fbclid',
  'gclid',
  'msclkid',
]);

export type UTMParams = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: (action: string, eventName: string, payload?: Record<string, unknown>) => void;
    pixel?: { track?: (eventName: string, payload?: Record<string, unknown>) => void };
    utmify?: { track?: (eventName: string, payload?: Record<string, unknown>) => void };
  }
}

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function sanitizeUTMRecord(value: unknown): UTMParams {
  if (!isRecord(value)) return {};

  const output: UTMParams = {};
  for (const [key, rawValue] of Object.entries(value)) {
    if (typeof rawValue === 'string' && rawValue.trim()) {
      output[key] = rawValue.trim();
    }
  }
  return output;
}

export function captureUTMsFromLocation(search = hasWindow() ? window.location.search : ''): UTMParams {
  if (!search) return {};

  const params = new URLSearchParams(search);
  const utm: UTMParams = {};

  for (const [rawKey, rawValue] of params.entries()) {
    const key = rawKey.trim().toLowerCase();
    if (!key) continue;

    const isUTMKey = key.startsWith('utm_');
    const isExtraTrackingKey = EXTRA_TRACKING_KEYS.has(key);
    if (!isUTMKey && !isExtraTrackingKey) continue;

    const value = rawValue.trim();
    if (!value) continue;
    utm[key] = value;
  }

  return utm;
}

export function saveUTMs(utm: UTMParams): void {
  if (!hasWindow() || Object.keys(utm).length === 0) return;

  const existing = getStoredUTMs();
  const merged = { ...existing, ...utm };
  window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
}

export function getStoredUTMs(): UTMParams {
  if (!hasWindow()) return {};

  const raw = window.localStorage.getItem(UTM_STORAGE_KEY);
  if (!raw) return {};

  try {
    return sanitizeUTMRecord(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function syncUTMsFromCurrentLocation(): UTMParams {
  const current = captureUTMsFromLocation();
  if (Object.keys(current).length > 0) {
    saveUTMs(current);
  }
  return { ...getStoredUTMs(), ...current };
}

export function getUTMsForTracking(): UTMParams {
  const current = captureUTMsFromLocation();
  return Object.keys(current).length > 0 ? { ...getStoredUTMs(), ...current } : getStoredUTMs();
}

export function trackUtmifyEvent(eventName: string, payload: Record<string, unknown> = {}): void {
  if (!hasWindow()) return;

  const eventPayload = {
    ...getUTMsForTracking(),
    ...payload,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventPayload,
  });

  window.utmify?.track?.(eventName, eventPayload);
  window.pixel?.track?.(eventName, eventPayload);

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, eventPayload);
  }
}

export function trackVirtualPage(pageName: string, payload: Record<string, unknown> = {}): void {
  trackUtmifyEvent('page_view', {
    page_name: pageName,
    page_path: hasWindow() ? window.location.pathname : '',
    ...payload,
  });
}

const APPROVED_STATUS_VALUES = new Set(['approved', 'paid', 'succeeded', 'success']);

export function isPaymentApproved(payload: unknown): boolean {
  if (!payload) return false;

  if (typeof payload === 'string') {
    return APPROVED_STATUS_VALUES.has(payload.toLowerCase());
  }

  if (!isRecord(payload)) return false;

  for (const [key, value] of Object.entries(payload)) {
    if ((key.toLowerCase() === 'status' || key.toLowerCase() === 'payment_status') && typeof value === 'string') {
      if (APPROVED_STATUS_VALUES.has(value.toLowerCase())) return true;
    }

    if (isRecord(value) || Array.isArray(value)) {
      if (isPaymentApproved(value)) return true;
    }
  }

  if (Array.isArray(payload)) {
    return payload.some((item) => isPaymentApproved(item));
  }

  return false;
}
