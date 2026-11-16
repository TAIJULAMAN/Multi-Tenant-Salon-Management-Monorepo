import React from "react";
import { Instagram, Facebook, Twitter, Plus } from "lucide-react";
import { SocialPost } from "../../types";

interface MonthViewProps {
  currentDate: Date;
  posts: SocialPost[];
  onAddPost?: (date: string) => void;
}

export function MonthView({ currentDate, posts, onAddPost }: MonthViewProps) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to build the calendar grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month leading days (to fill 35 or 42 slots)
  const remainingSlots = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
  for (let i = 1; i <= remainingSlots; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  // Format YYYY-MM-DD for matching
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="overflow-auto custom-scrollbar h-full w-full flex flex-col">
      <div className="flex flex-col h-full bg-white border border-[#E2E8F0] rounded-lg min-w-[800px] flex-1">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-white">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-4 text-center text-[12px] font-bold text-[#64748B]">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 flex-1 min-h-[600px]">
          {days.map((dayObj, index) => {
            const formattedDate = formatDate(dayObj.date);
            const dayPosts = posts.filter(p => p.date === formattedDate);
            const isToday = formattedDate === formatDate(new Date());

            return (
              <div
                key={index}
                onClick={() => onAddPost && onAddPost(formattedDate)}
                className={`min-h-[120px] p-2 border-b border-r border-[#E2E8F0] cursor-pointer transition-colors group flex flex-col ${index % 7 === 6 ? 'border-r-0' : ''} ${!dayObj.isCurrentMonth ? 'bg-[#F8FAFC]/50 hover:bg-[#F1F5F9]' : 'bg-white hover:bg-slate-50'}`}
              >
                <div className="flex justify-end mb-2">
                  <span className={`text-[12px] ${isToday ? 'w-6 h-6 flex items-center justify-center bg-[#635BFF] text-white rounded-full font-bold' : (dayObj.isCurrentMonth ? 'text-[#94A3B8]' : 'text-[#CBD5E1]')}`}>
                    {dayObj.date.getDate()}
                  </span>
                </div>

                <div className="space-y-1">
                  {dayPosts.map(post => (
                    <div 
                      key={post.id} 
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#B4C2FF] text-[#312E81] rounded-md text-[11px] font-semibold px-2 py-1 flex items-center justify-between cursor-pointer hover:bg-[#9FAFFE] transition-colors"
                    >
                      <span className="truncate pr-2">{post.startTime} - {post.title}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {post.platforms.includes('instagram') && <Instagram size={12} strokeWidth={2.5} />}
                        {post.platforms.includes('facebook') && <Facebook size={12} strokeWidth={2.5} />}
                        {post.platforms.includes('twitter') && <Twitter size={12} strokeWidth={2.5} />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hover Add Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-2">
                  <div className="w-full h-7 border border-dashed border-[#818CF8] bg-[#EEF2FF] rounded flex items-center justify-center text-[#635BFF]">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
