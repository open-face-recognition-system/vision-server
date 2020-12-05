export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    expiresIn: '1d',
    expiresRefreshTokenIn: '7d',
  },
};
