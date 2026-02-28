import { TranscriptEntry } from "../types";

export function parsePlainText(content: string): TranscriptEntry[] {
    const lines = content.split(/\\r?\\n/).filter((line) => line.trim() !== "");
    const entries: TranscriptEntry[] = lines.map((line, index) => {
        return {
            startMs: index * 1000, // Dummy increment if there are no timestamps
            timestamp: new Date(index * 1000).toISOString().substring(11, 19),
            text: line.trim(),
        };
    });

    return entries;
}
