import path from 'path';
import glob from 'fast-glob';

const downloadFolder = 'db-dl';

export const getDownloadFileLocation = (): string => path.join(__dirname, downloadFolder);
export const getZipFilePath = (editionId: string, suffix: string): string => path.join(__dirname, downloadFolder, `${editionId}.${suffix}`);

export const getFileLocation = async (folderPattern: string): Promise<string> => {
  const base = getDownloadFileLocation();
  const dir = await glob(base + `/**/${folderPattern}*`, {
    onlyDirectories: true,
  });
  if(dir.length === 0) {
    throw new Error(`No directory found from base: ${base}`);
  }
  dir.sort().reverse();
  return dir[0];
};

export const getAsnDbFilePath = async (): Promise<string> => {
  const filePath = await getFileLocation('GeoLite2-ASN_');
  return path.join(filePath, 'GeoLite2-ASN.mmdb');
};

export const getCityDbFilePath = async (): Promise<string> => {
  const filePath = await getFileLocation('GeoLite2-City_');
  return path.join(filePath, 'GeoLite2-City.mmdb');
};
