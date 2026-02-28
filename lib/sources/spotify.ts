import { TranscriptDocument, TranscriptEntry, Format } from "../types";
import { TranscriptError, TranscriptErrorCode } from "../errors";
import { parseVTT } from "../parsers/vtt";
import { parseSRT } from "../parsers/srt";
import { parsePlainText } from "../parsers/plain";

export async function fetchSpotifyTranscript(
    url: string,
    format: Format,
    transcriptFileContent?: string,
    transcriptFileType?: "vtt" | "srt" | "txt"
): Promise<TranscriptDocument> {
    try {
        // We only fetch metadata natively if possible
        // e.g. using `spotify-url-info` or official Spotify API
        // For transcripts, user MUST provide the file manually per requirements

        if (!transcriptFileContent || !transcriptFileType) {
            throw new TranscriptError(
                "Spotify transcripts not available programmatically. Please upload a transcript file.",
                TranscriptErrorCode.NO_TRANSCRIPT
            );
        }

        let entries: TranscriptEntry[] = [];
        if (transcriptFileType === "vtt") {
            entries = parseVTT(transcriptFileContent);
        } else if (transcriptFileType === "srt") {
            entries = parseSRT(transcriptFileContent);
        } else {
            entries = parsePlainText(transcriptFileContent);
        }

        const title = "Spotify Episode (Manual Transcript)";

        return {
            id: `spotify_${Date.now()}`,
            source: "spotify",
            url,
            title,
            entries,
            format,
        };
    } catch (error) {
        if (error instanceof TranscriptError) {
            throw error;
        }
        throw new TranscriptError(
            "Failed to parse manual Spotify transcript",
            TranscriptErrorCode.BAD_RESPONSE,
            error
        );
    }
}
