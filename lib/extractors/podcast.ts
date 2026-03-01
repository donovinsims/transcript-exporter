import { create } from 'youtube-dl-exec';
import path from 'path';
import { extractApplePodcastInfo, extractXiaoyuzhouInfo } from '../podcast-parser';

// Robust binary path resolution for both local and Vercel environments
const getBinaryPath = () => {
    // 1. Try local node_modules
    const localPath = path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp');
    // 2. Fallback to just 'yt-dlp' if it's in the PATH (e.g. on some Vercel setups or dev machines)
    return localPath;
};

const youtubedl = create(getBinaryPath());

export async function extractPodcastAudioStream(url: string): Promise<string> {
    // 1. Check for platform-specific high-speed extractors
    try {
        if (url.includes('podcasts.apple.com')) {
            const info = await extractApplePodcastInfo(url);
            if (info.audioUrl) return info.audioUrl;
        }

        if (url.includes('xiaoyuzhoufm.com') || url.includes('小宇宙')) {
            const info = await extractXiaoyuzhouInfo(url);
            if (info.audioUrl) return info.audioUrl;
        }
    } catch (specificError) {
        console.warn('Platform-specific extraction failed, falling back to yt-dlp:', specificError);
    }

    // 2. Fallback to yt-dlp for everything else (RSS, Spotify, Generic)
    let rawData;
    try {
        rawData = await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
            preferFreeFormats: true,
            format: 'worstaudio/bestaudio',
        });
    } catch (firstAttemptError: unknown) {
        const firstErr = firstAttemptError instanceof Error ? firstAttemptError.message : String(firstAttemptError);
        console.warn('First attempt to extract audio failed, trying with basic flags:', firstErr);
        try {
            rawData = await youtubedl(url, {
                dumpSingleJson: true,
                noWarnings: true,
                noCheckCertificates: true,
            });
        } catch (secondAttemptError: unknown) {
            const secondErr = secondAttemptError instanceof Error ? secondAttemptError.message : String(secondAttemptError);
            console.error('Second attempt to extract audio also failed:', secondErr);
            throw new Error(`Failed to extract audio stream: ${secondErr || firstErr || 'Unknown error'}`);
        }
    }

    try {
        const data = rawData as Record<string, unknown>;
        if (typeof data.url === 'string') return data.url;

        type AudioFormat = { acodec?: string; url?: string };
        const audioFormats = (data.formats as AudioFormat[])?.filter(f => f.acodec !== 'none') || [];
        if (audioFormats.length > 0 && typeof audioFormats[0].url === 'string') {
            return audioFormats[0].url;
        }

        throw new Error('Could not find a valid audio stream URL.');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Audio Extraction Error:', errorMessage);

        if (
            errorMessage.toLowerCase().includes('sign in') ||
            errorMessage.toLowerCase().includes('premium') ||
            errorMessage.toLowerCase().includes('drm') ||
            errorMessage.toLowerCase().includes('exclusive')
        ) {
            throw new Error('PAYWALL_DETECTED');
        }

        throw new Error('Failed to extract audio stream from this URL.');
    }
}
