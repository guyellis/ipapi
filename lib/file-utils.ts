import path from 'path';
import glob from 'fast-glob';

export const getZipFilePath = (
  downloadFolder: string, editionId: string, suffix: string
): string => path.join(downloadFolder, `${editionId}.${suffix}`);

export const getFileLocation = async (dbLocation: string, folderPattern: string): Promise<string> => {
  const dir = await glob(dbLocation + `/**/${folderPattern}*`, {
    onlyDirectories: true,
  });
  if(dir.length === 0) {
    throw new Error(`No directory found from base: ${dbLocation}`);
  }
  dir.sort().reverse();
  return dir[0];
};

export const getAsnDbFilePath = async (dbLocation: string): Promise<string> => {
  const filePath = await getFileLocation(dbLocation, 'GeoLite2-ASN_');
  return path.join(filePath, 'GeoLite2-ASN.mmdb');
};

export const getCityDbFilePath = async (dbLocation: string): Promise<string> => {
  const filePath = await getFileLocation(dbLocation, 'GeoLite2-City_');
  return path.join(filePath, 'GeoLite2-City.mmdb');
};
