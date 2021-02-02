import fs from 'fs';
import request from 'request';
import IDownloadProvider from '../models/IDownloadProvider';

class DownloadProvider implements IDownloadProvider {
  public async download(uri: string, filename: string): Promise<void> {
    const file = fs.createWriteStream(`./tmp/${filename}`);

    await new Promise((resolve, reject) => {
      request({
        uri,
        gzip: true,
      })
        .pipe(file)
        .on('finish', async () => {
          resolve('ok');
        })
        .on('error', error => {
          reject(error);
        });
    }).catch(error => {
      console.log(`Something happened: ${error}`);
    });
  }
}

export default DownloadProvider;
