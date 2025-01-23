export const formatToDatabaseDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

export const formatToDayMonthYear = (dateString: string | Date): string => {
    const dateToFormat = new Date(dateString);
    const dateStr = formatToDatabaseDate(dateToFormat);

    const [year, month, day] = dateStr.split('-');
    
    // Convert month number to month name
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthName = monthNames[parseInt(month, 10) - 1];
    
    return `${day} ${monthName} ${year}`;
}

export const getNextUpdateDateTime = (date: Date): string => {
    // Add 24 hours (in milliseconds) to the given date
    const temp = new Date(date);
    const time = temp.getTime();
    const updatedDate = new Date(time + 24 * 60 * 60 * 1000);

    const day = updatedDate.getDate().toString().padStart(2, '0'); // Add leading zero if necessary
    const month = updatedDate.toLocaleString('en-US', { month: 'short' }); // Short month name
    const year = updatedDate.getFullYear();
    const timeString = updatedDate.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    // Construct the formatted string
    return `${day} ${month} ${year} - ${timeString}`;
    // 'undefined' uses the user's current locale and timezone
}
