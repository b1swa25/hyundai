import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="mt-auto py-16 bg-white/[0.02] backdrop-blur-2xl border-t border-white/10 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-hyundai-accent/10 rounded-full blur-[100px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-hyundai-blue/20 rounded-full blur-[120px] translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3 opacity-80 mb-2">
                        <Image
                            src="/images/hyundai_logo_spinner.png"
                            alt="Hyundai Logo"
                            width={32}
                            height={32}
                            className="brightness-110"
                        />
                        <span className="text-lg font-black italic tracking-[0.2em] text-white">HYUNDAI</span>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                            &copy; 2026 Bhutan Hyundai Motors
                        </p>
                        <div className="h-px w-12 bg-hyundai-accent mx-auto"></div>
                        <p className="max-w-md mx-auto text-xs font-medium text-white/50 leading-relaxed uppercase tracking-widest">
                            Driving Progress for Humanity with <span className="text-white/80">State-of-the-Art</span> Auto-Electrical Solutions.
                        </p>
                    </div>

                    <div className="pt-8 flex gap-8">
                        <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-hyundai-accent transition-colors cursor-pointer">Quality First</div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-hyundai-accent transition-colors cursor-pointer">Customer Focused</div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-hyundai-accent transition-colors cursor-pointer">Innovation Hub</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
