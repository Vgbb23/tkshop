/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FRUITFY_API_URL?: string;
  readonly VITE_FRUITFY_TOKEN?: string;
  readonly VITE_FRUITFY_STORE_ID?: string;
  readonly VITE_FRUITFY_PRODUCT_ID?: string;
  readonly VITE_FRUITFY_ACCEPT_LANGUAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
