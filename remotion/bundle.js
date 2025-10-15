const {bundle} = require('@remotion/bundler');
const path = require('path');

const main = async () => {
    try {
        const bundleLocation = await bundle({
            entryPoint: path.resolve("./src/index.ts"),
            webpackOverride: (config) => config,
            outDir: path.resolve("./dist"),
        });

        console.log('Bundle created at:', bundleLocation);
    } catch (error) {
        console.error('Bundle failed:', error);
        process.exit(1);
    }
}

main();