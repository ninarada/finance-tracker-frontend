
// "31.12.2007" → new Date("2007-12-31")
export function parseDate(dateStr: string): Date | null {
    const [day, month, year] = dateStr.split('.');
    if (!day || !month || !year) return null;
    return new Date(`${year}-${month}-${day}`);
}
// date: parseDate(receipt.date)

