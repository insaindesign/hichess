const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = function ({ env }) {
  const plugins = [];

  if (env === "production") {
    const analyzerMode = process.env.REACT_APP_INTERACTIVE_ANALYZE
      ? "server"
      : "json";
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode }));
  }

  return {
    webpack: {
      plugins,
      configure: {
        module: {
          rules: [
            {
              test: /\.m?js$/,
              resolve: {
                fullySpecified: false, // disable the behaviour for chessground
              },
            },
          ],
        },
      },
    },
    devServer: {
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    },
  };
};
