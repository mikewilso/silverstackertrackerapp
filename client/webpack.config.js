module.exports = {
    // ... other configurations
    module: {
      rules: [
        // ... other rules
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [
            /node_modules\/@antv\/util\/esm\/path\/util\/src\/path\/util\/segment-cubic-factory\.ts/
          ],
        },
      ],
    },
    // ... other configurations
  };