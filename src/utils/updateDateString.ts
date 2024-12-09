export function updateDateString(value: number, t) {
    let hours: number = Math.floor(value / 3600);
    let minutes: number = Math.floor((value - hours * 3600) / 60);

    if (hours == 0 && minutes == 0) {
        return `${t('now')}`;
    } else {
        return `${hours > 0 ? `${hours}${t('time-h')} ` : ''}${
            minutes > 0 ? `${minutes}${t('time-m')}` : ''
        } ${t('ago')}`;
    }
}
