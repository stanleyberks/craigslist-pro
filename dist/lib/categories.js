export const categories = {
    software: 'sof',
    web: 'web',
    admin: 'sad',
    qa: 'qat',
    dba: 'dba',
    security: 'sec',
    devops: 'tch',
    cloud: 'tch',
    network: 'tch',
    systems: 'sad',
    support: 'tch',
    tech: 'tch',
    computer: 'tch'
};
export function getCategoryCode(category) {
    return categories[category] || category;
}
