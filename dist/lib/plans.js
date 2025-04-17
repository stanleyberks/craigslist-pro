export const SUBSCRIPTION_PLANS = {
    free: {
        name: 'free',
        alertLimit: 3,
        resultsPerAlert: 5,
        emailDigestFrequency: 'daily'
    },
    mid: {
        name: 'mid',
        alertLimit: 10,
        resultsPerAlert: 20,
        emailDigestFrequency: 'hourly'
    },
    pro: {
        name: 'pro',
        alertLimit: Infinity,
        resultsPerAlert: 100,
        emailDigestFrequency: 'realtime'
    }
};
