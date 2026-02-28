import { NextRequest, NextResponse } from "next/server";
import { SingleRequestSchema, Source } from "../../../lib/types";
import { fetchYoutubeTranscript } from "../../../lib/sources/youtube";
import { fetchAppleTranscript } from "../../../lib/sources/apple";
import { fetchSpotifyTranscript } from "../../../lib/sources/spotify";
import { TranscriptError, TranscriptErrorCode } from "../../../lib/errors";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = SingleRequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { code: TranscriptErrorCode.BAD_RESPONSE, message: "Invalid request body", details: result.error },
                { status: 400 }
            );
        }

        const { url, format, source } = result.data;
        const resolvedSource = source || detectSource(url);

        if (!resolvedSource) {
            return NextResponse.json(
                { code: TranscriptErrorCode.UNSUPPORTED_SOURCE, message: "Could not auto-detect source from URL." },
                { status: 400 }
            );
        }

        let doc;
        switch (resolvedSource) {
            case "youtube":
                doc = await fetchYoutubeTranscript(url, format);
                break;
            case "apple":
                doc = await fetchAppleTranscript(url, format);
                break;
            case "spotify":
                // For Spotify, the client needs to supply transcript components,
                // which we don't have in the basic POST yet. Let's assume it fails if empty.
                doc = await fetchSpotifyTranscript(url, format, undefined, undefined);
                break;
            default:
                return NextResponse.json(
                    { code: TranscriptErrorCode.UNSUPPORTED_SOURCE, message: "Unsupported source." },
                    { status: 400 }
                );
        }

        return NextResponse.json({ success: true, document: doc });
    } catch (error) {
        if (error instanceof TranscriptError) {
            const status = error.code === TranscriptErrorCode.NOT_FOUND || error.code === TranscriptErrorCode.NO_TRANSCRIPT ? 404 : 500;
            return NextResponse.json(error.toJSON(), { status });
        }

        console.error("Unknown error in single transcript API:", error);
        return NextResponse.json(
            { code: TranscriptErrorCode.UNKNOWN, message: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}

function detectSource(url: string): Source | null {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("podcasts.apple.com")) return "apple";
    if (url.includes("spotify.com")) return "spotify";
    return null;
}
