module.exports = {
  saltRounds: 10,
  jwtExpTime: '1h',
  limitImageSize: 5000000,
  allowedImageExts: ['image/png', 'image/jpg', 'image/jpeg'],
  resetPasswordTokenLiveTime: 30,
  mongodb: {
    poolSize: 20,
  },

  numberOfPostsPerPage: 5,
  numberOfHighestViewPostsPerCate: 10,
  numberOfHighestViewPosts: 10,
  numberOfLatestPosts: 10,
  numberOfTopCategories: 10,

  relatedPostTimeRange: 3 * 24 * 60,
  relatedPostsCount: 5,

  trendingPostsCount: 4,

  defaultSubscriberExpireMin: 7 * 24 * 60,
};
