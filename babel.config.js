const path = require('path');

module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        ['@babel/plugin-proposal-decorators', {legacy: true}],
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: [
                    '.ios.ts',
                    '.android.ts',
                    '.ts',
                    '.ios.tsx',
                    '.android.tsx',
                    '.tsx',
                    '.jsx',
                    '.js',
                    '.json',
                ],
                alias: {
                    src: './src',
                },
            },
        ],
    ],
    overrides: [
        {
            // test: /node_modules\/ml-matrix\/.*/,
            test: new RegExp(
                `\\${path.sep}node_modules\\${path.sep}ml-matrix\\${path.sep}.*`,
            ),
            plugins: [
                ['@babel/plugin-transform-class-properties', {loose: true}],
                ['@babel/plugin-transform-private-methods', {loose: true}],
                [
                    '@babel/plugin-transform-private-property-in-object',
                    {loose: true},
                ],
            ],
        },
    ],
};
