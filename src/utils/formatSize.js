const BYTE = 'B';
const KILOBYTE = 'kB';
const MEGABYTE = 'MB';

const ONE_KILOBYTE = 1000;
export const ONE_MEGABYTE = 1000000;

export default function formatSize(bytes = 0) {
  const kilobytes = bytes/ONE_KILOBYTE;

  if (kilobytes < 1) {
    return `${bytes}${BYTE}`;
  }

  if (bytes >= ONE_MEGABYTE) {
    const megabytes = bytes/ONE_MEGABYTE;

    return `${megabytes.toFixed(1)}${MEGABYTE}`;
  }

  return `${Math.round(kilobytes)}${KILOBYTE}`;
}
