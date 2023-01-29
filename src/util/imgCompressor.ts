import Compressor from 'compressorjs';
import { logger } from '@/util/logger';

function imgCompressor(file: File): Promise<File> {
  return new Promise((res) => {
    new Compressor(file, {
      quality: 0.6,

      success(file: File) {
        return res(file);
      },
      error(error: Error) {
        logger.log('Error while compressing file', error);
        return res(file);
      },
    });
  });
}

export { imgCompressor };
