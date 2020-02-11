module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        // 'content': 'components/content',
        'views': '@/views',
      }
    }
  }
}