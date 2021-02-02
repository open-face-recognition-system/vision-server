import IDownloadProvider from '../models/IDownloadProvider';

class FakeDownloadProvider implements IDownloadProvider {
  public async download(uri: string, filename: string): Promise<void> {
    if (!uri || !filename) {
      throw new Error();
    }
  }
}

export default FakeDownloadProvider;
