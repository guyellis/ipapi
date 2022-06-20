#!/usr/bin/env zx

// eslint-disable-next-line import/no-unresolved
import 'zx/globals';

/*

We do the TypeScript build locally and then because we don't
exclude the dist/ folder in .gcloudignore it gets uploaded
as part of the build process described here:

https://cloud.google.com/build/docs/running-builds/start-build-command-line-api

*/

await $`rm -rf dist/`;

await $`npm run build`;

// This needs an environment variable set for the token for the download
await $`npm run download-db`;

// Remove the .gz files because they've been unzipped and are no longer needed
await $`rm dist/lib/db-dl/GeoLite2-ASN.tar.gz`;
await $`rm dist/lib/db-dl/GeoLite2-City.tar.gz`;

// Upload
await $`gcloud builds submit --tag gcr.io/headvert/ipapi`;

// Deploy the Cloud Run instance
await $`gcloud run deploy ipapi --image gcr.io/headvert/ipapi --max-instances=1`;
