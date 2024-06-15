module.exports = [
    {
        name: 'preflight'
    },
    {
        name: 'heartbeat',
        interval: '5s'
    },
    {
        name: 'bot',
        interval: process.env.POST_FREQUENCY || '1h',
        timeout: 0
    },
]