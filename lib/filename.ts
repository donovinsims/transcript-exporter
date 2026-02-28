export function sanitizeFilename(title: string, format: "txt" | "md", source: string): string {
    let cleanTitle = title
        // Replace non-alphanumeric (except spaces, hyphens, underscores) with nothing
        .replace(/[^a-zA-Z0-9 \\-_]/g, "")
        // Replace multiple spaces with a single space
        .replace(/\\s+/g, " ")
        .trim()
        // Replace spaces with underscores
        .replace(/ /g, "_")
        .slice(0, 100); // Reasonably short

    if (!cleanTitle) {
        cleanTitle = `transcript_${Date.now()}`;
    }

    return `${source}_${cleanTitle}.${format}`;
}
