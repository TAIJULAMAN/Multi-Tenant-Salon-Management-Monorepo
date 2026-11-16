import { Download } from "lucide-react";
import PageHeader from "@/components/common-component/PageHeader";
import { CustomButton } from "@/components/common/CustomButton";

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
        <CustomButton
          variant="light-purple"
          icon={Download}
          title="Download PDF"
          onClick={() => window.print()}
        />
      }
    />
  );
}
