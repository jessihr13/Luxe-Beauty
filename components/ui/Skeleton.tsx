// Skeleton Loader Components
// components/ui/Skeleton.tsx

'use client';

import { motion } from 'framer-motion';

export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <th key={i} className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i}>
                            {[1, 2, 3, 4, 5].map((j) => (
                                <td key={j} className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function SkeletonProductCard() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
            <div className="aspect-square bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
            </div>
        </motion.div>
    );
}

export function SkeletonList({ items = 3 }: { items?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`h-4 bg-gray-200 rounded animate-pulse ${i === lines - 1 ? 'w-2/3' : 'w-full'
                        }`}
                ></div>
            ))}
        </div>
    );
}
