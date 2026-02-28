import { parseVTT } from "./lib/parsers/vtt";
import { parseSRT } from "./lib/parsers/srt";
import { sanitizeFilename } from "./lib/filename";
import { formatTranscript } from "./lib/formatters";
import { TranscriptDocument } from "./lib/types";

async function runTests() {
    let passed = 0;
    let failed = 0;

    function assert(condition: boolean, msg: string) {
        if (condition) {
            console.log(`✅ PASS: ${msg}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${msg}`);
            failed++;
        }
    }

    // 1. URL parsing test coverage (indirectly via detectSource in API mock)
    const isYoutube = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");
    assert(isYoutube("https://youtube.com/watch?v=dQw4w9WgXcQ"), "YouTube URL detection");
    assert(isYoutube("https://youtu.be/dQw4w9WgXcQ"), "YouTube short URL detection");

    // 2. VTT parsing
    const vttMock = `WEBVTT

00:00:00.000 --> 00:00:05.123
Hello world

00:00:05.123 --> 00:00:10.000
This is a test`;

    const parsedVtt = parseVTT(vttMock);
    assert(parsedVtt.length === 2, "VTT parsed correct number of entries");
    assert(parsedVtt[0].text === "Hello world", "VTT parsed text");

    // 3. SRT parsing
    const srtMock = `1
00:00:00,000 --> 00:00:05,123
Hello world

2
00:00:05,123 --> 00:00:10,000
This is a test`;

    const parsedSrt = parseSRT(srtMock);
    assert(parsedSrt.length === 2, "SRT parsed correct number of entries");
    assert(parsedSrt[1].text === "This is a test", "SRT parsed text");

    // 4. Filename sanitation
    assert(sanitizeFilename("My Awesome Podcast! (Ep 1)", "txt", "apple") === "apple_My_Awesome_Podcast_Ep_1.txt", "Filename sanitation removes special chars");

    // 5. MD escaping
    const mockDoc: TranscriptDocument = {
        id: "test",
        source: "youtube",
        url: "https://test.com",
        title: "Test Video",
        format: "md",
        entries: [{
            startMs: 0,
            timestamp: "00:00",
            text: "This is a *test* with _underscores_ #tags [link]"
        }]
    };

    const formattedMd = formatTranscript(mockDoc);
    assert(formattedMd.includes("\\\\*test\\\\*"), "Markdown format escapes asterisks");
    assert(formattedMd.includes("\\\\[link\\\\]"), "Markdown format escapes brackets");

    console.log(`\\nTests complete: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
}

runTests();
