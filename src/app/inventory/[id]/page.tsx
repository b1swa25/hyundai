import { getDb } from '@/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, ShieldCheck } from 'lucide-react';

export default async function PartDetail({ params }: { params: { id: string } }) {
    const db = getDb();
    const part = await db.query.parts.findFirst({
        where: (parts: any, { eq }: any) => eq(parts.id, parseInt(params.id)),
        with: { category: true },
    });


    if (!part) notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <Link href="/inventory" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
                <ArrowLeft className="w-4 h-4" />
                Back to Inventory
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="aspect-square bg-white/5 border border-white/10 border-dashed rounded-2xl flex items-center justify-center overflow-hidden">
                    {part.image ? (
                        <img src={part.image} alt={part.name} className="object-cover w-full h-full" />
                    ) : (
                        <ShieldCheck className="w-24 h-24 text-hyundai-accent opacity-20" />
                    )}
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <span className="inline-block bg-hyundai-accent/20 text-hyundai-accent text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-hyundai-accent/30">
                            {(part as any).category?.name || 'GENUINE COMPONENT'}
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight">{part.name}</h1>
                        <p className="text-3xl font-bold accent-text">Nu. {part.price.toLocaleString()}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider opacity-60">Description</h3>
                            <p className="text-lg opacity-80 leading-relaxed">{part.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40">Availability</p>
                                <p className="font-bold">{part.stock > 0 ? `${part.stock} In Stock` : 'Out of Stock'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40">Item Code</p>
                                <p className="font-bold">BH-{(part.id + 1000).toString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button className="btn-primary w-full py-4 flex items-center justify-center gap-3">
                            <ShoppingCart className="w-5 h-5" />
                            Check Availability
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
