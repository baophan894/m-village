'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface Candidate {
  _id: string;
  name: string;
  image: string;
  votes: number;
  category: 'queen' | 'king';
}

interface TopThreeProps {
  category: 'queen' | 'king';
  candidates: Candidate[];
}

export default function TopThree({ category, candidates }: TopThreeProps) {
  const topThree = candidates.slice(0, 3);

  // Pad with empty slots if less than 3
  while (topThree.length < 3) {
    topThree.push({
      _id: `empty-${topThree.length}`,
      name: `#${topThree.length + 1}`,
      image: '',
      votes: 0,
      category,
    } as Candidate);
  }

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
          Top 3 Contestants
        </h2>
        <p className="text-muted-foreground capitalize">{category} Category</p>
      </div>

      {/* Podium Layout */}
      <div className="flex items-end justify-center gap-4 mb-12">
        {/* 2nd Place */}
        <div className="w-32 text-center">
          <Card className="overflow-hidden h-40 mb-4 border-2 border-gray-400 relative">
            {topThree[1]?.image && (
              <Image
                src={topThree[1].image || "/placeholder.svg"}
                alt={topThree[1].name}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">#2</span>
            </div>
          </Card>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-2">
            <p className="font-semibold truncate text-sm">{topThree[1]?.name}</p>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
              {topThree[1]?.votes}
            </p>
          </div>
        </div>

        {/* 1st Place */}
        <div className="w-40 text-center">
          <Card className="overflow-hidden h-56 mb-4 border-4 border-yellow-400 relative ring-4 ring-yellow-200">
            {topThree[0]?.image && (
              <Image
                src={topThree[0].image || "/placeholder.svg"}
                alt={topThree[0].name}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 mb-2 text-white">
            <p className="font-semibold truncate">{topThree[0]?.name}</p>
            <p className="text-2xl font-bold">🏆 {topThree[0]?.votes}</p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="w-32 text-center">
          <Card className="overflow-hidden h-40 mb-4 border-2 border-orange-400 relative">
            {topThree[2]?.image && (
              <Image
                src={topThree[2].image || "/placeholder.svg"}
                alt={topThree[2].name}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">#3</span>
            </div>
          </Card>
          <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-3 mb-2">
            <p className="font-semibold truncate text-sm">{topThree[2]?.name}</p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {topThree[2]?.votes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
