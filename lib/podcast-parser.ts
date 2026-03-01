import axios from 'axios';
import { Parser } from 'xml2js';

/**
 * RSS Parser Utility for Podcasts
 * Ported and adapted from wendy7756/podcast-transcriber
 */

export interface PodcastItem {
    title: string;
    description: string;
    audioUrl: string;
    pubDate?: string;
}

export interface PodcastInfo {
    audioUrl: string;
    title: string;
    description: string;
}

/**
 * Parses RSS feed and extracts audio links
 */
export async function parseRSSFeed(rssUrl: string): Promise<PodcastItem[]> {
    try {
        const response = await axios.get(rssUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            timeout: 30000
        });

        const parser = new Parser();
        const result = await parser.parseStringPromise(response.data);

        const channel = result.rss?.channel?.[0] || result.feed;
        if (!channel) {
            throw new Error('Invalid RSS format');
        }

        const items = channel.item || channel.entry || [];
        const audioItems: PodcastItem[] = [];

        for (const item of items) {
            const audioItem = extractAudioFromRSSItem(item);
            if (audioItem) {
                audioItems.push(audioItem);
            }
        }

        return audioItems;
    } catch (error: unknown) {
        console.error('RSS Parsing Error:', error);
        throw new Error(`RSS Parsing Failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Extracts audio info from an RSS item
 */
function extractAudioFromRSSItem(item: Record<string, any>): PodcastItem | null {
    try {
        const title = extractText(item.title);
        const description = extractText(item.description) || extractText(item.summary);
        let audioUrl: string | null = null;

        // Method 1: enclosure tag
        if (item.enclosure && item.enclosure[0] && item.enclosure[0].$.url) {
            audioUrl = item.enclosure[0].$.url;
        }

        // Method 2: media:content
        if (!audioUrl && item['media:content']) {
            const mediaContent = item['media:content'][0];
            if (mediaContent && mediaContent.$.url) {
                audioUrl = mediaContent.$.url;
            }
        }

        if (!audioUrl) return null;

        return {
            title: title || 'Untitled',
            description: description || '',
            audioUrl: audioUrl,
            pubDate: extractText(item.pubDate) || extractText(item.published) || undefined
        };
    } catch {
        return null;
    }
}

function extractText(node: any): string | null {
    if (!node) return null;
    if (typeof node === 'string') return node.trim();
    if (Array.isArray(node) && node.length > 0) return extractText(node[0]);
    if (typeof node === 'object' && node._) return node._.trim();
    return null;
}

/**
 * Discovers RSS URL from a podcast page
 */
export async function discoverRSSFromPage(pageUrl: string): Promise<string | null> {
    try {
        const response = await axios.get(pageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            timeout: 15000
        });

        const html = response.data;
        const rssPatterns = [
            /<link[^>]*type=["']application\/rss\+xml["'][^>]*href=["']([^"']+)["']/i,
            /<link[^>]*href=["']([^"']*rss[^"']*)["']/i,
            /<link[^>]*href=["']([^"']*feed[^"']*)["']/i,
            /href=["']([^"']*\.xml)["']/i
        ];

        for (const pattern of rssPatterns) {
            const match = html.match(pattern);
            if (match) {
                let rssUrl = match[1];
                if (rssUrl.startsWith('/')) {
                    const baseUrl = new URL(pageUrl);
                    rssUrl = `${baseUrl.protocol}//${baseUrl.host}${rssUrl}`;
                }
                return rssUrl;
            }
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Extracts Apple Podcast audio info via iTunes API
 */
export async function extractApplePodcastInfo(url: string): Promise<PodcastInfo> {
    const podcastIdMatch = url.match(/id(\d+)/);
    if (!podcastIdMatch) throw new Error('Invalid Apple Podcast URL');

    const podcastId = podcastIdMatch[1];
    const episodeIdMatch = url.match(/i=(\d+)/);
    const episodeId = episodeIdMatch ? episodeIdMatch[1] : null;

    const itunesApiUrl = `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcast`;
    const itunesResponse = await axios.get(itunesApiUrl);

    if (!itunesResponse.data?.results?.length) {
        throw new Error('Podcast not found in iTunes');
    }

    const feedUrl = itunesResponse.data.results[0].feedUrl;
    const items = await parseRSSFeed(feedUrl);

    if (episodeId) {
        const matched = items.find(item => item.audioUrl.includes(episodeId));
        if (matched) return matched;
    }

    return items[0];
}

/**
 * Extracts Xiaoyuzhou Podcast audio info
 */
export async function extractXiaoyuzhouInfo(url: string): Promise<PodcastInfo> {
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
    });

    const ogAudioMatch = response.data.match(/<meta\s+property="og:audio"\s+content="([^"]+)"/);
    if (ogAudioMatch) {
        return {
            audioUrl: ogAudioMatch[1],
            title: 'Xiaoyuzhou Episode',
            description: ''
        };
    }

    throw new Error('Unable to extract Xiaoyuzhou audio URL');
}
