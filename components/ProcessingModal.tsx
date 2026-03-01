import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Headphones } from 'lucide-react';

interface ProcessingModalProps {
    isOpen: boolean;
    status: string;
}

export default function ProcessingModal({ isOpen, status }: ProcessingModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/50 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-md p-8 text-center bg-card/90 backdrop-blur-xl border border-brand-04/40 rounded-[2rem] shadow-2xl relative overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-brand-03/10 to-transparent z-0 pointer-events-none" />

                        <div className="flex justify-center mb-8 relative z-10">
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-16 h-16 rounded-2xl bg-brand-03/50 flex items-center justify-center border border-brand-04/50 shadow-inner"
                            >
                                <Headphones className="w-8 h-8 text-brand-08" />
                            </motion.div>
                        </div>

                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="text-2xl font-bold tracking-tight text-brand-08 mb-4 relative z-10"
                        >
                            Extracting Transcript
                        </motion.h3>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="flex items-center justify-center gap-3 text-base font-sans font-medium text-brand-07 mb-8 relative z-10"
                        >
                            <Loader2 className="w-5 h-5 animate-spin text-brand-08/80" />
                            <span className="animate-pulse">{status || 'Initializing engine...'}</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="text-sm font-sans text-brand-06 bg-background/50 p-5 rounded-2xl border border-brand-04/30 leading-relaxed shadow-sm relative z-10"
                        >
                            High-quality transcription models are processing your audio. This usually takes <strong>30-60 seconds</strong> depending on length.
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
