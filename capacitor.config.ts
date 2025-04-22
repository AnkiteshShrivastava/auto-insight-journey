
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fb01c3cd22094830a4213f06e89dd49d',
  appName: 'auto-insight-journey',
  webDir: 'dist',
  server: {
    url: 'https://fb01c3cd-2209-4830-a421-3f06e89dd49d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'release.keystore',
      keystoreAlias: 'release',
    },
  },
};

export default config;
