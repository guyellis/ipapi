#!/usr/bin/env zx

/*

This script is designed to be all encompassing in that nothing else should need
to be run except this script.

*/

// eslint-disable-next-line import/no-unresolved
import 'zx/globals';

/*

We do the TypeScript build locally and then because we don't
exclude the dist/ folder in .gcloudignore it gets uploaded
as part of the build process described here:

https://cloud.google.com/build/docs/running-builds/start-build-command-line-api

*/

const { MAXMIND_LICENSE_KEY } = process.env;
if (!MAXMIND_LICENSE_KEY) {
  console.log('*** MAXMIND_LICENSE_KEY environment variable is missing');
  process.exit(1);
}

console.log('*** Pull latest from GitHub');
await $`git pull`;

console.log('*** `npm ci` - install dependencies');
await $`npm ci`;

console.log('*** Bump version with `npm version patch ...`');
await $`npm version patch -m 'Update dependencies'`;

console.log('*** Push tag to GitHub with `git push`');
await $`git push`;

try {
  console.log('*** Remove dist/ folder if it exists');
  await $`rm -rf dist/`;
} catch (e) {
  console.log(`No dist/ folder to remove ${e.message}`);
}

console.log('*** Build');
await $`npm run build`;

// This needs an environment variable set for the token for the download
console.log('*** Download database');
await $`npm run download-db`;

// Remove the .gz files because they've been unzipped and are no longer needed
console.log('*** Remove .gz files');
await $`rm dist/lib/db-dl/GeoLite2-ASN.tar.gz`;
await $`rm dist/lib/db-dl/GeoLite2-City.tar.gz`;

// Set the project to headvert in case it has been set to something else in the past
console.log('*** Set GCP project to Headvert');
await $`gcloud config set project headvert`;

// Upload
console.log('*** Upload to GCP');
await $`gcloud builds submit --tag gcr.io/headvert/ipapi`;

// Deploy the Cloud Run instance
console.log('*** Deploy the Cloud Run instance');
await $`gcloud run deploy ipapi --image gcr.io/headvert/ipapi --max-instances=1 --region=us-central1`;
