import { getUTMsForTracking } from './utmify';

const FRUITFY_BASE_URL = (import.meta.env.VITE_FRUITFY_API_URL || 'https://api.fruitfy.io').replace(/\/+$/, '');
const FRUITFY_TOKEN = import.meta.env.VITE_FRUITFY_TOKEN;
const FRUITFY_STORE_ID = import.meta.env.VITE_FRUITFY_STORE_ID;
const FRUITFY_PRODUCT_ID = import.meta.env.VITE_FRUITFY_PRODUCT_ID;
const FRUITFY_ACCEPT_LANGUAGE = import.meta.env.VITE_FRUITFY_ACCEPT_LANGUAGE || 'pt_BR';

export interface FruitfyChargeInput {
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  valueInCents: number;
  quantity: number;
  utm?: Record<string, string>;
}

export interface FruitfyChargeResult {
  pixCode: string;
  response: unknown;
}

function getStringValue(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return null;
}

function extractPixCode(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;

  const node = payload as Record<string, unknown>;
  const candidateKeys = [
    'pix_code',
    'pixCode',
    'copia_e_cola',
    'copy_paste',
    'copyPaste',
    'brcode',
    'emv',
    'code',
  ];

  for (const key of candidateKeys) {
    const value = getStringValue(node[key]);
    if (value) return value;
  }

  const nestedKeys = ['data', 'charge', 'payment', 'pix', 'qr_code', 'qrCode'];
  for (const key of nestedKeys) {
    const nested = node[key];
    const nestedValue = extractPixCode(nested);
    if (nestedValue) return nestedValue;
  }

  return null;
}

function sanitizeNumbers(raw: string): string {
  return raw.replace(/\D/g, '');
}

async function callFruitfyEndpoint(body: Record<string, unknown>, endpoint: string): Promise<unknown> {
  const response = await fetch(`${FRUITFY_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${FRUITFY_TOKEN}`,
      'Store-Id': FRUITFY_STORE_ID,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': FRUITFY_ACCEPT_LANGUAGE,
    },
    body: JSON.stringify(body),
  });

  const parsedBody = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      (parsedBody && typeof parsedBody === 'object' && 'message' in parsedBody && typeof parsedBody.message === 'string'
        ? parsedBody.message
        : null) || `Erro ao criar cobrança PIX (HTTP ${response.status}).`;
    throw new Error(message);
  }

  return parsedBody;
}

export async function createFruitfyPixCharge(input: FruitfyChargeInput): Promise<FruitfyChargeResult> {
  if (!FRUITFY_TOKEN || !FRUITFY_STORE_ID || !FRUITFY_PRODUCT_ID) {
    throw new Error('Credenciais Fruitfy ausentes. Configure VITE_FRUITFY_TOKEN, VITE_FRUITFY_STORE_ID e VITE_FRUITFY_PRODUCT_ID.');
  }

  const mergedUTM = {
    ...getUTMsForTracking(),
    ...(input.utm || {}),
  };
  const hasUTM = Object.keys(mergedUTM).length > 0;

  const body = {
    name: input.customer.name.trim(),
    email: input.customer.email.trim(),
    phone: sanitizeNumbers(input.customer.phone),
    cpf: sanitizeNumbers(input.customer.cpf),
    amount: input.valueInCents * input.quantity,
    items: [
      {
        id: FRUITFY_PRODUCT_ID,
        value: input.valueInCents,
        quantity: input.quantity || 1,
      },
    ],
    ...(hasUTM ? mergedUTM : {}),
    ...(hasUTM ? { utm: mergedUTM } : {}),
  };

  let responseBody: unknown;
  try {
    responseBody = await callFruitfyEndpoint(body, '/api/pix/charge');
  } catch (firstError) {
    responseBody = await callFruitfyEndpoint(body, '/pix/charge').catch(() => {
      throw firstError;
    });
  }

  const pixCode = extractPixCode(responseBody);
  if (!pixCode) {
    throw new Error('Cobrança criada, mas a API não retornou um código PIX copiável.');
  }

  return {
    pixCode,
    response: responseBody,
  };
}
