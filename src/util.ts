const units = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
];

export function timeAgo(date: string | number | Date) {
    const time = Math.floor(
        (new Date().valueOf() - new Date(date).valueOf()) / 1000
    );
    const { interval, unit } = calculateTimeDifference(time);
    const suffix = interval === 1 ? '' : 's';
    return `${interval} ${unit}${suffix} ago`;
};

function calculateTimeDifference (time: number) {
    for (let { label, seconds } of units) {
        const interval = Math.floor(time / seconds);
        if (interval >= 1) {
        return {
            interval: interval,
            unit: label
        };
        }
    }
    return {
        interval: 0,
        unit: ''
    };
};

export function sinceclass(date: Date) { 
    const since = Math.floor(
        (new Date().valueOf() - date.valueOf()) / 1000 / 86400
    )
    if (since <= 0) return 'text-blue-500';
    else if (since <= 7) return 'text-green-500';
    else if (since <= 30) return 'text-orange-500';
    else return 'text-red-500	';
}