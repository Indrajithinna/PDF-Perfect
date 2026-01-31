const autocannon = require('autocannon');

console.log('Starting stress test on http://localhost:8080/ ...');

const instance = autocannon({
    url: 'http://localhost:8080/',
    connections: 100, // concurrent connections
    pipelining: 1,
    duration: 10, // seconds
}, console.log);

// Track progress
autocannon.track(instance, { renderProgressBar: true });
