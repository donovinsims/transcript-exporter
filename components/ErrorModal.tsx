import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

export default function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/50 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-md p-8 overflow-hidden text-left bg-card/90 backdrop-blur-xl border border-brand-04/40 rounded-[2rem] shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-6 pb-4">
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center gap-3 text-destructive"
                            >
                                <AlertCircle className="w-7 h-7" />
                                <h3 className="text-xl font-bold tracking-tight text-brand-08">Action Required</h3>
                            </motion.div>
                            <button
                                title="Close"
                                onClick={onClose}
                                className="p-2 text-brand-05 hover:bg-brand-03 hover:text-brand-08 transition-colors rounded-xl outline-none cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative z-10 space-y-6"
                        >
                            <p className="text-p1 font-sans text-brand-07 font-medium leading-relaxed">
                                {message}
                            </p>

                            {(message.includes('Paywall') || message.includes('DRM')) && (
                                <div className="p-5 bg-background/50 border border-brand-04/40 rounded-2xl text-brand-06 font-sans text-sm leading-relaxed shadow-inner">
                                    <strong className="text-brand-08 font-semibold">Why?</strong> The platform is blocking access to this specific episode because it is region-locked or exclusive to paid subscribers. Please try another public podcast link.
                                </div>
                            )}

                            {message.includes('Too Large') && (
                                <div className="p-5 bg-background/50 border border-brand-04/40 rounded-2xl text-brand-06 font-sans text-sm leading-relaxed shadow-inner">
                                    <strong className="text-brand-08 font-semibold">Audio Limit:</strong> The AI model (Whisper) currently supports a maximum of 25MB per file. This episode exceeds that limit.
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 flex justify-end"
                        >
                            <button
                                type="button"
                                className="inline-flex justify-center px-6 py-2.5 font-sans font-medium text-sm text-brand-01 transition-colors bg-brand-08 hover:opacity-90 rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-06 cursor-pointer active:scale-[0.98]"
                                onClick={onClose}
                            >
                                Got it
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
