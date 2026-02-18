'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowUpDown, Package, Sparkles, X } from 'lucide-react';
import AddPartButton from './AddPartButton';

interface InventoryClientProps {
    parts: any[];
    categories: any[];
    isAdmin: boolean;
}

export default function InventoryClient({ parts, categories, isAdmin }: InventoryClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [showInStockOnly, setShowInStockOnly] = useState(false);

    const filteredParts = useMemo(() => {
        let result = [...parts];

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(part =>
                part.name.toLowerCase().includes(query) ||
                part.description.toLowerCase().includes(query)
            );
        }

        // Category Filter
        if (selectedCategory !== 'all') {
            result = result.filter(part => part.categoryId === parseInt(selectedCategory));
        }

        // Stock Filter
        if (showInStockOnly) {
            result = result.filter(part => part.stock > 0);
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return 0;
        });

        return result;
    }, [parts, searchQuery, selectedCategory, sortBy]);

    return (
        <div className="space-y-12 pb-20">
            {/* Header & Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 relative z-20">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-hyundai-accent/10 flex items-center justify-center text-hyundai-accent">
                            <Package className="w-5 h-5 shadow-[0_0_15px_rgba(0,114,188,0.3)]" />
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-widest text-white flex items-center gap-4">
                            GENUINE <span className="text-hyundai-accent">INVENTORY</span>
                        </h1>
                    </div>
                    <p className="text-sm text-white/40 font-bold tracking-wide leading-relaxed italic ml-13">
                        "Browse our curated selection of authentic Hyundai parts and high-performance components."
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    {isAdmin && <AddPartButton categories={categories} />}

                    {/* Search */}
                    <div className="relative flex-grow max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-hyundai-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Find specific components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-white/20 focus:border-hyundai-accent/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-hyundai-accent/20 outline-none transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="relative min-w-[180px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-hyundai-accent w-4 h-4 pointer-events-none" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full appearance-none bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-[11px] font-black uppercase tracking-widest text-white/80 focus:border-hyundai-accent/50 focus:bg-white/[0.08] outline-none transition-all cursor-pointer"
                        >
                            <option value="all" className="bg-[#0a1425]">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id} className="bg-[#0a1425]">{cat.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-t-white/20 border-x-4 border-x-transparent" />
                    </div>

                    {/* Sort */}
                    <div className="relative min-w-[180px]">
                        <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4 pointer-events-none" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full appearance-none bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-[11px] font-black uppercase tracking-widest text-white/80 focus:border-hyundai-accent/50 focus:bg-white/[0.08] outline-none transition-all cursor-pointer"
                        >
                            <option value="newest" className="bg-[#0a1425]">Newest Arrival</option>
                            <option value="price-low" className="bg-[#0a1425]">Price: Low to High</option>
                            <option value="price-high" className="bg-[#0a1425]">Price: High to Low</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-4 border-t-white/20 border-x-4 border-x-transparent" />
                    </div>

                    {/* Stock Toggle */}
                    <button
                        onClick={() => setShowInStockOnly(!showInStockOnly)}
                        className={`px-4 py-3.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${showInStockOnly
                                ? 'bg-hyundai-accent text-white border-hyundai-accent'
                                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        In Stock Only
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {filteredParts.map((part) => (
                    <div key={part.id} className="glass-card flex flex-col group p-6 border-white/5 hover:border-hyundai-accent/30 transition-all duration-500 relative">
                        {/* Decorative Polish */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-hyundai-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-white/[0.04] transition-all duration-700 relative overflow-hidden">
                            {part.image ? (
                                <img
                                    src={part.image}
                                    alt={part.name}
                                    className="object-contain w-full h-full p-6 transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 opacity-10">
                                    <Package size={48} />
                                    <span className="text-[10px] uppercase font-black tracking-widest">No Visual</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1425]/20 to-transparent pointer-events-none" />
                        </div>

                        <div className="space-y-2 mb-6 flex-grow">
                            <span className="text-[9px] uppercase font-black text-hyundai-accent tracking-[0.2em] px-2 py-0.5 bg-hyundai-accent/10 rounded-md inline-block">
                                {part.category?.name || 'GENUINE COMPONENT'}
                            </span>
                            <h4 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-hyundai-accent transition-colors duration-300">
                                {part.name}
                            </h4>
                            <p className="text-[11px] text-white/40 font-medium line-clamp-2 leading-relaxed italic">
                                "{part.description}"
                            </p>
                        </div>

                        <div className="space-y-5 mt-auto">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest px-1">
                                <span className="text-white/20">Inventory Status</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${part.stock > 10 ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                                    <span className={part.stock > 10 ? 'text-green-500/80' : 'text-amber-500/80'}>
                                        {part.stock} UNITS
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/5 pt-6">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20 leading-none mb-1">List Price</span>
                                    <span className="text-xl font-black italic text-hyundai-accent">Nu. {part.price.toLocaleString()}</span>
                                </div>
                                <Link
                                    href={`/inventory/${part.id}`}
                                    className="btn-primary !text-[10px] !px-5 !py-2 !tracking-[0.2em] shadow-lg shadow-hyundai-blue/20 hover:shadow-hyundai-accent/20 transition-all"
                                >
                                    DETAILS
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredParts.length === 0 && (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] border border-dashed border-white/5 rounded-[3rem]">
                        <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center text-white/20">
                            <Search size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black uppercase tracking-widest text-white/80">No matches found</h3>
                            <p className="text-xs text-white/30 font-bold uppercase tracking-tight italic max-w-xs">
                                Try adjusting your search or filters to explore the rest of our genuine registry.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-hyundai-accent hover:brightness-125 transition-all"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
