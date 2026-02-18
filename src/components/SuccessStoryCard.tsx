'use client';

import { useState } from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { deleteSuccessStory } from '@/lib/actions';
import ConfirmationModal from './ConfirmationModal';

interface SuccessStoryCardProps {
    story: {
        id: number;
        title: string;
        description: string;
        image?: string | null;
        createdAt: Date;
    };
    isAdmin?: boolean;
}

export default function SuccessStoryCard({ story, isAdmin }: SuccessStoryCardProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = async () => {
        await deleteSuccessStory(story.id);
    };

    return (
        <>
            <div className="glass-card flex flex-col group overflow-hidden border-white/5 hover:border-hyundai-accent/30 transition-all duration-500">
                {/* Image Section */}
                <div className="aspect-[16/10] bg-white/5 relative overflow-hidden">
                    {story.image ? (
                        <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white/10 font-black uppercase tracking-[0.2em] text-xs">Excellence Story</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1425] via-transparent to-transparent opacity-60" />

                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-hyundai-accent/20 backdrop-blur-md border border-hyundai-accent/30 rounded-full">
                        <Calendar className="w-3 h-3 text-hyundai-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                            {new Date(story.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </span>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg backdrop-blur-md border border-red-500/20 transition-all z-20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4 flex-grow flex flex-col">
                    <div className="space-y-2">
                        <h4 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-hyundai-accent transition-colors">
                            {story.title}
                        </h4>
                        <p className="text-sm text-white/60 font-medium leading-relaxed line-clamp-3">
                            {story.description}
                        </p>
                    </div>

                    <div className="pt-4 mt-auto">
                        <div className="h-px w-12 bg-hyundai-accent/50 group-hover:w-full transition-all duration-700" />
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Success Story"
                message="Are you sure you want to delete this success story? This action cannot be undone."
                confirmText="Delete Story"
            />
        </>
    );
}
