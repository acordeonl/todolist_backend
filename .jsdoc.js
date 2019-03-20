module.exports = {
    plugins: ['plugins/markdown'],
    source: {
        include: [
            "helpers",
            "middleware",
            "routes"
        ],
        exclude: [
            ".git",
            ".meteor",
            "node_modules"
        ],
        includePattern: ".+\\.js(x|doc)?$"
    },
    opts: {
      destination: "public/docs",
      recurse: true,
      readme: 'README.md'
    },
};