'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Check, X, Loader2, Download, Share2 } from 'lucide-react';
import ProcessingModal from '@/components/ProcessingModal';
import ErrorModal from '@/components/ErrorModal';
import BrandSwitcher from '@/components/BrandSwitcher';

export default function Home() {
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('');
    const [transcript, setTranscript] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showError, setShowError] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const eventSourceRef = useRef<EventSource | null>(null);
    const transcriptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcript]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setTranscript('');
        setErrorMsg('');
        setShowError(false);
        setIsProcessing(true);
        setStatus('Initializing extraction...');

        const sseUrl = `/api/transcribe?url=${encodeURIComponent(url)}`;
        const source = new EventSource(sseUrl);
        eventSourceRef.current = source;

        source.addEventListener('status', (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            setStatus(data.message);
        });

        source.addEventListener('chunk', (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            setIsProcessing(false);
            setTranscript((prev) => prev + data.text);
        });

        source.addEventListener('error', (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            setErrorMsg(data.message);
            setShowError(true);
            setIsProcessing(false);
            source.close();
        });

        source.addEventListener('done', () => {
            setIsProcessing(false);
            source.close();
        });

        source.onerror = () => {
            if (isProcessing) {
                setErrorMsg('Connection to server lost. Please check the URL or try again later.');
                setShowError(true);
                setIsProcessing(false);
            }
            source.close();
        };
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(transcript);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const downloadTranscript = (format: 'txt' | 'md') => {
        const element = document.createElement('a');
        const file = new Blob([transcript], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `transcript.${format}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const shareTranscript = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Podcast Transcript',
                    text: transcript.slice(0, 100) + '...',
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        }
    };


    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center pt-24 pb-20 px-4 md:px-6 font-sans overflow-x-hidden relative">
            {/* Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-08/10 blur-[120px] rounded-full z-0 pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-03/10 blur-[120px] rounded-full z-0 pointer-events-none" />

            <ProcessingModal isOpen={isProcessing} status={status} />
            <ErrorModal
                isOpen={showError}
                message={errorMsg}
                onClose={() => setShowError(false)}
            />

            <div className="w-full max-w-2xl mx-auto space-y-12 z-10 relative">

                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-zinc-900/40 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="flex flex-col mb-10 relative z-10">
                        <motion.div
                            initial={{ rotate: -10, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="w-16 h-16 rounded-[1.25rem] bg-brand-08/10 flex items-center justify-center mb-8 border border-brand-08/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                        >
                            <FileText className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-[1.2] flex flex-wrap items-center gap-x-3">
                            <span>Convert</span>
                            <BrandSwitcher />
                            <span>podcasts to</span>
                            <span className="text-white/90 relative inline-block">
                                text instantly
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-white/40 to-transparent"
                                />
                            </span>
                        </h1>
                        <p className="text-lg text-zinc-400 font-medium max-w-md leading-relaxed">
                            Paste a YouTube, Spotify, or Apple link to get a clean, readable transcript in seconds.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 w-full relative z-10"
                    >
                        <div className="w-full relative group/input">
                            <label htmlFor="podcast-url-input" className="sr-only">Podcast URL</label>
                            <input
                                id="podcast-url-input"
                                type="url"
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste podcast URL here..."
                                className="w-full h-16 rounded-2xl border border-white/10 bg-black/40 px-6 text-lg font-sans text-white transition-all placeholder:text-zinc-600 hover:border-white/20 focus:border-brand-08/50 focus:ring-4 focus:ring-brand-08/5 outline-none disabled:opacity-50"
                            />
                            {url && (
                                <button
                                    type="button"
                                    onClick={() => setUrl('')}
                                    title="Clear URL"
                                    aria-label="Clear URL"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="h-16 px-10 rounded-2xl font-bold text-lg text-black bg-white hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-white/5 flex items-center justify-center gap-3"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : 'Extract Transcript'}
                        </button>
                    </form>
                </motion.div>

                <AnimatePresence>
                    {transcript && (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.98 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full bg-zinc-900/40 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-[60vh] relative"
                        >
                            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-08 shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse" />
                                    <span className="text-sm font-bold tracking-widest uppercase text-zinc-400">Output</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => downloadTranscript('md')}
                                        className="p-3 text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                                        title="Download as Markdown"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={shareTranscript}
                                        className="p-3 text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                                        title="Share"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <div className="w-[1px] h-6 bg-white/10 mx-1" />
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-6 py-2.5 text-sm font-bold text-black bg-white hover:bg-zinc-200 transition-all rounded-xl flex items-center gap-2 active:scale-95"
                                    >
                                        {isCopied ? <Check className="w-4 h-4" /> : 'Copy Text'}
                                    </button>
                                </div>
                            </div>
                            <div
                                ref={transcriptRef}
                                className="p-8 md:p-12 overflow-y-auto font-sans leading-[1.8] text-zinc-300 text-lg scroll-smooth selection:bg-brand-08/30"
                            >
                                {transcript}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
