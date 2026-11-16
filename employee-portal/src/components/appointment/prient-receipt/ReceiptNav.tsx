import { Download } from "lucide-react";
import PageHeader from "@/components/common-component/PageHeader";

export default function ReceiptNav() {
  return (
    <PageHeader
      showBackButton={true}
      title={
        <div className="flex flex-col">
          <span className="text-base font-bold font-manrope text-[#29343D]">
            Service Receipt
          </span>
          <span className="text-xs font-manrope text-[#98A4AE] font-normal">
            Italian Fiscal Invoice
          </span>
        </div>
      }
      actions={
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#DDDBFF] hover:bg-[#c7c4ff] transition-colors text-[#635BFF] text-sm font-semibold font-manrope rounded-[8px] cursor-pointer">
          <Download size={15} />
          <span>Download PDF</span>
        </button>
      }
    />
  );
}
