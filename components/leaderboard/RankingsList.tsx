'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface Candidate {
  _id: string;
  name: string;
  image: string;
  votes: number;
  category: 'queen' | 'king';
}

interface RankingsListProps {
  candidates: Candidate[];
}

export default function RankingsList({ candidates }: RankingsListProps) {
  const ranked = candidates.slice(0, 10); // Show top 10

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Full Rankings</h3>
      <div className="space-y-2">
        {ranked.map((candidate, index) => (
          <Card
            key={candidate._id}
            className="flex items-center gap-4 p-4 hover:shadow-md transition-shadow"
          >
            <div className="text-2xl font-bold text-muted-foreground w-8 text-center">
              #{index + 1}
            </div>

            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary">
              <Image
                src={candidate.image || "/placeholder.svg"}
                alt={candidate.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{candidate.name}</h4>
              <p className="text-sm text-muted-foreground">Ranking #{index + 1}</p>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-primary">{candidate.votes}</div>
              <p className="text-xs text-muted-foreground">votes</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
