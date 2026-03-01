import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function extractYoutubeTranscript(url: string): Promise<string> {
    try {
        // Extract Video ID using Regex
        const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }

        console.log(`Executing Python youtube_transcript_api for ID: ${videoId}...`);

        // Execute the python package directly via CLI
        const { stdout, stderr } = await execAsync(`youtube_transcript_api ${videoId} --format json`);

        if (stderr) {
            console.warn('youtube_transcript_api stderr:', stderr);
        }

        const transcriptData = JSON.parse(stdout);
        const flattenedData = Array.isArray(transcriptData[0]) ? transcriptData[0] : transcriptData;

        // Map transcript data and join
        return flattenedData.map((t: { text: string }) => t.text).join(' ');

    } catch (error: unknown) {
        console.error('Child Process Execution Error:', error);
        throw new Error('Native transcript (CC) is unavailable for this video. ' + (error instanceof Error ? error.message : ''));
    }
}
