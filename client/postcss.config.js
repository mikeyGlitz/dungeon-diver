module.exports = {
  ident: 'postcss',
  plugins: {
    'postcss-import': {
      root: __dirname,
    },
    'postcss-flexbugs-fixes': {},
    'postcss-mixins': {},
    'postcss-animation': {},
    'postcss-cssnext': {
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9',
      ],
      flexbox: 'no-2009',
    },
  },
  stylelint: {},
};
