export function getTimeAgo(timestamp: number) {
    const diff = Math.floor(Date.now() / 1000) - timestamp

    if (diff < 60) {
        return `${diff} сек. назад`
    }

    const minutes = Math.floor(diff / 60)

    if (minutes < 60) {
        return `${minutes} мин. назад`
    }

    const hours = Math.floor(minutes / 60)

    if (hours < 24) {
        return `${hours} ч. назад`
    }

    const days = Math.floor(hours / 24)

    return `${days} дн. назад`
}