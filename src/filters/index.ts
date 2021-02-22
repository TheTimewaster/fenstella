const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;

export function timeDelta(timestamp: number, currentTimestamp: number): string {
    const delta = currentTimestamp - timestamp;

    if (delta < MINUTE) {
        return "few seconds ago";
    }

    if (delta >= MINUTE && delta < HOUR) {
        const minutes = Math.floor(delta / (MINUTE));
        return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    }

    if (delta >= HOUR && delta < HOUR * 4) {
        const minutes = Math.floor(delta / HOUR);
        return minutes === 1 ? `${minutes} hour ago` : `${minutes} hours ago`;
    }

    if (delta >= HOUR * 4 && delta < HOUR * 24) {
        return Intl.DateTimeFormat("en-DE", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        }).format(new Date(timestamp));
    }

    if (delta >= HOUR * 24 && delta < HOUR * 24 * 7) {
        return Intl.DateTimeFormat("en-DE", {
            weekday: "long",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        }).format(new Date(timestamp));
    }

    return Intl.DateTimeFormat("en-DE", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    }).format(new Date(timestamp));
}
