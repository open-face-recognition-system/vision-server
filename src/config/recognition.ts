interface IRecognitionConfig {
  driver: 'eigenfaces' | 'fisherfaces' | 'lbph';
}

export default {
  driver: process.env.RECOGNITION_DRIVER,
} as IRecognitionConfig;
