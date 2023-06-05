import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { ManifestV3Export, crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

// idk something ain't right with the types of library
// for some reason background.type of "module" is not correct
const typedManifest = manifest as ManifestV3Export;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest: typedManifest })],
});
