export const formatToDayMonthYear = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    
    // Convert month number to month name
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthName = monthNames[parseInt(month, 10) - 1];
    
    return `${day} ${monthName} ${year}`;
}

export const formatToDatabaseDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}
