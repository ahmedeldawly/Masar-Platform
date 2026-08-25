import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.masar.platform",
  appName: "Masar",
  webDir: "public",
  server: process.env.MASAR_APP_URL
    ? {
        url: process.env.MASAR_APP_URL,
        cleartext: process.env.MASAR_APP_URL.startsWith("http://"),
      }
    : undefined,
  android: {
    allowMixedContent: false,
  },
};

export default config;
