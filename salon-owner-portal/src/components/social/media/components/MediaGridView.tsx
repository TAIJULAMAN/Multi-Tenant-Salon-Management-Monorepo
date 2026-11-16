import React from "react";
import { MediaSession } from "../data";
import { MediaCard } from "../MediaCard";

interface MediaGridViewProps {
  paginatedSessions: MediaSession[];
  selectedMediaItems: string[];
  toggleMediaItem: (itemId: string) => void;
}

export function MediaGridView({
  paginatedSessions,
  selectedMediaItems,
  toggleMediaItem
}: MediaGridViewProps) {
  const allItems = paginatedSessions.flatMap(s => s.items);

  return (
    <div className="min-h-[350px] p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {allItems.length === 0 ? (
        <div className="col-span-full py-16 text-center text-sm font-manrope text-gray-400">
          No media found
        </div>
      ) : (
        allItems.map(item => (
          <MediaCard
            key={item.id}
            item={item}
            selected={selectedMediaItems.includes(item.id)}
            onSelect={() => toggleMediaItem(item.id)}
            onDelete={() => alert("Delete media item")}
          />
        ))
      )}
    </div>
  );
}
