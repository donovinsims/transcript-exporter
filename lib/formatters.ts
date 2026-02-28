import { TranscriptDocument } from "./types";

export function formatTranscript(doc: TranscriptDocument): string {
    if (doc.format === "md") {
        return formatAsMarkdown(doc);
    }
    return formatAsPlainText(doc);
}

function formatAsMarkdown(doc: TranscriptDocument): string {
    let md = `# ${doc.title}\\n\\n`;
    md += `**Source**: [${doc.url}](${doc.url})\\n`;
    if (doc.durationMs) {
        md += `**Duration**: ${formatDuration(doc.durationMs)}\\n`;
    }
    md += `\\n---\\n\\n`;

    for (const entry of doc.entries) {
        const safeText = entry.text
            .replace(/\*/g, "\\*")
            .replace(/_/g, "\\_")
            .replace(/#/g, "\\#")
            .replace(/\[/g, "\\[")
            .replace(/\]/g, "\\]");

        md += `**[${entry.timestamp}]** ${safeText}\\n\\n`;
    }

    return md;
}

function formatAsPlainText(doc: TranscriptDocument): string {
    let txt = `${doc.title}\\n\\n`;
    txt += `Source: ${doc.url}\\n`;
    if (doc.durationMs) {
        txt += `Duration: ${formatDuration(doc.durationMs)}\\n`;
    }
    txt += `\\n----------------------------------------\\n\\n`;

    for (const entry of doc.entries) {
        txt += `[${entry.timestamp}] ${entry.text}\\n`;
    }

    return txt;
}

function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
