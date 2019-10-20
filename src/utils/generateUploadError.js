import * as Errors from 'constants/Errors';

export default function formatSize(error, { size, type }) {
  switch(error) {
    case Errors.MAX_SIZE_EXCEEDED:
      return `File is ${size}B, which exceeds the 10MB limit`;

    case Errors.INVALID_FILETYPE:
      return `File is of type ${type}, which is not a valid jpg or png`;

    default:
      return;
  }
}
