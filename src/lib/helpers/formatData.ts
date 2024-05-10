// To convert date into human readable format (eg: 23rd march)

export const formatDate = (dateString: Date) => {
    const options: any = { day: "numeric", month: "long", year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
};