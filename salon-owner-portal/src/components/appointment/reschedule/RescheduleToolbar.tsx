import React from "react";
import RescheduleCalanderHead from "./RescheduleCalanderHead";
import { CalendarView, StaffMember } from "./utils";

interface RescheduleToolbarProps {
  prevDay: () => void;
  nextDay: () => void;
  activePeriod: CalendarView;
  setActivePeriod: (period: CalendarView) => void;
  formatDate: (d: Date) => string;
  currentDate: Date;
  onToggleFullscreen: () => void;
  selectedTeamIds: string[];
  setSelectedTeamIds: React.Dispatch<React.SetStateAction<string[]>>;
  teamMembers: StaffMember[];
}

export default function RescheduleToolbar({
  prevDay,
  nextDay,
  activePeriod,
  setActivePeriod,
  formatDate,
  currentDate,
  onToggleFullscreen,
  selectedTeamIds,
  setSelectedTeamIds,
  teamMembers,
}: RescheduleToolbarProps) {
  return (
    <div className="shrink-0">
      <RescheduleCalanderHead
        prevDay={prevDay}
        activePeriod={activePeriod}
        formatDate={formatDate}
        nextDay={nextDay}
        currentDate={currentDate}
        setActivePeriod={setActivePeriod}
        onToggleFullscreen={onToggleFullscreen}
        selectedTeamIds={selectedTeamIds}
        setSelectedTeamIds={setSelectedTeamIds}
        teamMembers={teamMembers}
      />
    </div>
  );
}
