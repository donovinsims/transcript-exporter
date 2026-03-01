# Transcript Exporter

Extract and transcribe audio from YouTube, Spotify, and Apple Podcasts into clean text using AI.

## How It Works

Two parallel transcription paths:

1. **YouTube native captions** — calls `youtube_transcript_api` CLI; falls back to audio extraction if unavailable.
2. **Audio extraction** — uses `yt-dlp` to pull an audio stream URL, then sends it to Groq Whisper for transcription.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your keys:

```bash
cp .env.local.example .env.local
```

**Required:**

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for Whisper transcription. Get one at [console.groq.com](https://console.groq.com). |

**Optional:**

| Variable | Description |
|---|---|
| `YOUTUBE_API_KEY` | Falls back to `youtube-transcript` library if not set. |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | Not currently used in the main flow. |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

Paste a YouTube, Spotify, or Apple Podcasts URL into the input field and click **Extract Transcript**. The transcript streams in real time.

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/transcribe` | GET | SSE stream — real-time transcript chunks (used by the UI). |
| `/api/transcript` | POST | Single URL, returns full JSON transcript. |
| `/api/transcript/batch` | POST | Batch up to 100 URLs (default concurrency: 3). |

## Deployment (Vercel)

The `yt-dlp` binary is copied from `node_modules` to `/tmp/yt-dlp` at runtime to work within Vercel's read-only filesystem. Set `GROQ_API_KEY` in your Vercel project environment variables.

Max function duration is set to 300s (`maxDuration: 300`) to accommodate long audio files.
