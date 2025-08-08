
import type {NextConfig} from 'next';
import {withGenkit} from '@genkit-ai/next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '100mb',
  },
};

export default withGenkit(nextConfig);
