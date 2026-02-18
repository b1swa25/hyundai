'use client';

import { useState } from 'react';
import { Sparkles, Plus, Trash2, LayoutGrid } from 'lucide-react';
import AddSuccessStoryModal from './AddSuccessStoryModal';
import SuccessStoryCard from './SuccessStoryCard';

interface SuccessStoriesManagerProps {
    stories: any[];
}

export default function SuccessStoriesManager({ stories }: SuccessStoriesManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="glass-card !p-8 space-y-8 border-white/5 border relative group">
                {/* Decorative Background - Isolated Overflow */}
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-hyundai-accent/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-hyundai-accent/10 flex items-center justify-center text-hyundai-accent">
                                <Sparkles className="w-5 h-5 shadow-[0_0_15px_rgba(0,114,188,0.3)]" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-widest text-white">Success Stories</h3>
                        </div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-tight ml-13">Highlight achievements and conferences</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary !py-3 !px-6 !text-[10px] shadow-lg shadow-hyundai-blue/20 group/btn flex items-center gap-2"
                    >
                        <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" />
                        New Success Story
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {stories.map((story) => (
                        <SuccessStoryCard key={story.id} story={story} isAdmin={true} />
                    ))}

                    {stories.length === 0 && (
                        <div className="col-span-full py-20 bg-white/[0.02] border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-white/10">
                                <LayoutGrid size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest text-white/40">No Stories Published</h4>
                                <p className="text-[10px] text-white/10 font-bold uppercase tracking-tight">Click the button above to spotlight your first success</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddSuccessStoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
