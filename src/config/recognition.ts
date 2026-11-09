type Algorithm = 'eigenfaces' | 'fisherfaces' | 'lbph';

const defaultThresholds: Record<Algorithm, number> = {
  eigenfaces: 5000,
  fisherfaces: 1000,
  lbph: 70,
};

const algorithm = (process.env.RECOGNITION_ALGORITHM || 'lbph') as Algorithm;

export default {
  algorithm,
  threshold: Number(
    process.env.RECOGNITION_THRESHOLD || defaultThresholds[algorithm],
  ),
  python: process.env.PYTHON_BIN || 'python3',
};
