//console.log('----- config.ts');

const merge = require('lodash/merge');

const isDev = process.env.NODE_ENV !== 'production';
console.log('isDev', isDev);

const second = 1000;
const minute = 60 * second;

const prodConfig = {
    appName: 'dehydrator',
    // baseUrl: 'http://192.168.77.101:4000',
    // baseUrl: 'localhost:4000',
    baseUrl: 'https://dehydrator-dev.golden-team.org',
    apiString: '/api',
    dev: isDev,
    broadcastPort: 6024,
    testLogin: '',
    testPassword: '',
    publicMachineIdLength: 8,
    mock: {
        machineUID: '97d7d438-83d5-4f04-9875-5d08f09dbe50',
    },

    socket: {
        active: true,
        host: 'http://dehydrator-dev.golden-team.org',
        // host: 'http://192.168.77.101',
        // port: 3000,
    },
    pairTimeout: 20 * second,
    pairSocketLiveTimeout: minute,
    scanTime: 20 * second,
    resetTimeout: 3 * minute,
    resetSocketLiveTimeout: minute,
    // socket: {
    //     active: true,
    //     host: 'localhost',
    //     port: 3000,
    // },
    machine: {
        cycle: {
            fanSpeed: [
                {
                    id: 'normal',
                    value: 100,
                },
                {
                    id: 'reduced',
                    value: 85,
                },
                {
                    id: 'light',
                    value: 70,
                },
            ],
        },
    },
    hashes: {
        outOfDateHashTime: 10 * 60 * 1000, // 10 minutes in milliseconds
        hashCleanerWorkingInterval: 1 * 60 * 1000, // 1 minute in milliseconds
    },
};

let localConfig = {};
// if (isDev) {
try {
    localConfig = require('./config.local.js');
} catch (ex) {
    console.log('ex', ex);
    console.log('config.local does not exist.');
}
// }

module.exports = merge(prodConfig, localConfig);
