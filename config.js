module.exports = {
  config: {
    tailwindJS: './tailwind.config.js',
    port: 3000,
  },
  paths: {
    root: './',
    src: {
      base: './src',
      css: './src/css',
      js: './src/js',
      img: './src/img',
      data: './src/data',
    },
    dist: {
      base: './dist',
      css: './dist/css',
      js: './dist/js',
      img: './dist/img',
      data: './dist/data',
    },
    build: {
      base: './build',
      css: './build/css',
      js: './build/js',
      img: './build/img',
      data: './build/data',
    },
  },
}
