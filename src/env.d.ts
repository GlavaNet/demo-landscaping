/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_DRIVE_FOLDER_ID: string;
  readonly VITE_BUSINESS_NAME: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_CONTACT_PHONE: string;
  readonly VITE_BIO: string;
  readonly VITE_INSTAGRAM_HANDLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
