/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_API_URL: string;
  readonly VITE_STRIPE_API_KEY: string;
  readonly VITE_S3_BASE_URL: string;
  readonly VITE_FHIR_CLIENT_ID: string;
  readonly VITE_FHIR_ISS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
