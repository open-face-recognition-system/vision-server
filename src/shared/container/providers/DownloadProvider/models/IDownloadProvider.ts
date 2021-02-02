export default interface IDownloadProvider {
  download(uri: string, filename: string): Promise<void>;
}
