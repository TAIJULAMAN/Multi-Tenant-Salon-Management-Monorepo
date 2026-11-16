import { AppStatus, CalAppointment } from "@/@types/salon-owner/CalAppointment.type";

export default function DragGhost({
  appt,
  statusColor,
  x,
  y,
  width,
  height,
  startTime,
  endTime,
}: {
  appt: CalAppointment;
  statusColor: Record<AppStatus, { bg: string; text: string; border: string }>;
  x: number;
  y: number;
  width: number;
  height: number;
  startTime: string;
  endTime: string;
}) {
  const c = statusColor[appt.status] ?? {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-l-gray-300",
  };

  const borderColorMap: Record<string, string> = {
    "border-l-[#635BFF]": "#635BFF",
    "border-l-[#16CDC7]": "#16CDC7",
    "border-l-[#FFD648]": "#FFD648",
    "border-l-[#FF6692]": "#FF6692",
    "border-l-[#36C76C]": "#36C76C",
  };
  const borderColor = borderColorMap[c.border] ?? "#635BFF";

  const bgColorMap: Record<string, string> = {
    "bg-[#F3F0FF]": "#F3F0FF",
    "bg-[#E6FFFE]": "#E6FFFE",
    "bg-[#FFFBEA]": "#FFFBEA",
    "bg-[#FFF0F3]": "#FFF0F3",
    "bg-[#EDFBF3]": "#EDFBF3",
  };
  const bgColor = bgColorMap[c.bg] ?? "#ffffff";

  const textColorMap: Record<string, string> = {
    "text-[#635BFF]": "#635BFF",
    "text-[#16CDC7]": "#16CDC7",
    "text-[#E6B800]": "#E6B800",
    "text-[#FF6692]": "#FF6692",
    "text-[#36C76C]": "#36C76C",
  };
  const textColor = textColorMap[c.text] ?? "#0A2540";

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        width,
        height,
        pointerEvents: "none",
        willChange: "transform",
        zIndex: 9999,
        backgroundColor: bgColor,
        color: textColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: "0px 8px 8px 0px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 10px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.22)",
        outline: `2px solid ${borderColor}`,
        outlineOffset: "-2px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p className="font-manrope font-semibold truncate text-[12px]">
          {appt.service}
        </p>
        <p
          className="font-manrope font-normal truncate text-[11px]"
          style={{ opacity: 0.75 }}
        >
          {appt.clientName}
        </p>
        <p className="font-manrope font-semibold text-[10px] mt-0.5">
          {startTime} - {endTime}
        </p>
      </div>
    </div>
  );
}
