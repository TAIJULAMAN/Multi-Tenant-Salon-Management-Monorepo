import React from "react";
import Image from "next/image";
import { X, Search as SearchIcon, Zap, Users, Edit2, UploadIcon, Film, ChevronRight } from "lucide-react";
import { MediaItem } from "../data";
import CustomSearch from "@/components/customComponent/CustomSearch";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomFileUpload from "@/components/customComponent/CustomFileUpload";

interface UploadWizardModalProps {
  onClose: () => void;
  uploadStep: number;
  setUploadStep: React.Dispatch<React.SetStateAction<number>>;
  wizardClient: string | null;
  setWizardClient: (val: string) => void;
  wizardClientSearch: string;
  setWizardClientSearch: (val: string) => void;
  ALL_CLIENTS: any[];
  wizardServices: string[];
  setWizardServices: React.Dispatch<React.SetStateAction<string[]>>;
  ALL_SERVICES: string[];
  wizardProviders: string[];
  onOpenProvidersModal: () => void;
  wizardNotes: string;
  setWizardNotes: (val: string) => void;
  wizardFiles: MediaItem[];
  setWizardFiles: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCompleteUpload: () => void;
}

export function UploadWizardModal({
  onClose,
  uploadStep,
  setUploadStep,
  wizardClient,
  setWizardClient,
  wizardClientSearch,
  setWizardClientSearch,
  ALL_CLIENTS,
  wizardServices,
  setWizardServices,
  ALL_SERVICES,
  wizardProviders,
  onOpenProvidersModal,
  wizardNotes,
  setWizardNotes,
  wizardFiles,
  setWizardFiles,
  fileInputRef,
  handleFileChange,
  handleCompleteUpload
}: UploadWizardModalProps) {
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400"><X size={20} /></button>
        <h3 className="text-2xl font-bold text-[#0A2540] mb-8">Add Media Upload</h3>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center w-full max-w-xs">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${uploadStep >= 1 ? "bg-[#635BFF] text-white" : "bg-gray-100 text-gray-400"}`}>1</div>
            <div className={`flex-1 h-1 transition-all ${uploadStep >= 2 ? "bg-[#635BFF]" : "bg-gray-100"}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${uploadStep >= 2 ? "bg-[#635BFF] text-white" : "bg-gray-100 text-gray-400"}`}>2</div>
            <div className={`flex-1 h-1 transition-all ${uploadStep >= 3 ? "bg-[#635BFF]" : "bg-gray-100"}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${uploadStep >= 3 ? "bg-[#635BFF] text-white" : "bg-gray-100 text-gray-400"}`}>3</div>
          </div>
        </div>

        <div className="min-h-[300px]">
          {uploadStep === 1 && (
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-[#635BFF] uppercase tracking-widest text-center mb-6">Step 1: Select Client</p>
              <div className="mb-6">
                <CustomSearch
                  value={wizardClientSearch}
                  onChange={setWizardClientSearch}
                  placeholder="Search by name or email..."
                  className="w-full"
                />
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {ALL_CLIENTS.filter(c => c.name.toLowerCase().includes(wizardClientSearch.toLowerCase()) || c.email.toLowerCase().includes(wizardClientSearch.toLowerCase())).map((client, i) => (
                  <div
                    key={i}
                    onClick={() => setWizardClient(client.name)}
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors
                                                ${wizardClient === client.name ? "border-[#635BFF] bg-indigo-50/30" : "border-[#E0E6EB] hover:bg-gray-50"}`}
                  >
                    <Image
                      src={`/avatar/icon${(i % 3) + 1}.png`}
                      alt={client.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-[#0A2540]">{client.name}</p>
                      <p className="text-xs text-gray-400">{client.email} • {client.phone || "(555) 000-0000"}</p>
                    </div>
                  </div>
                ))}
                {ALL_CLIENTS.filter(c => c.name.toLowerCase().includes(wizardClientSearch.toLowerCase()) || c.email.toLowerCase().includes(wizardClientSearch.toLowerCase())).length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-6">No clients found</p>
                )}
              </div>
            </div>
          )}

          {uploadStep === 2 && (
            <div className="space-y-6">
              <p className="text-[11px] font-bold text-[#635BFF] uppercase tracking-widest text-center">Step 2: Services & Details</p>
              <div>
                <CustomSelect
                  label="Services Provided"
                  value=""
                  options={[
                    { label: "Select services...", value: "" },
                    ...ALL_SERVICES.filter(s => !wizardServices.includes(s)).map(s => ({ label: s, value: s }))
                  ]}
                  onChange={(val) => {
                    if (val && !wizardServices.includes(val))
                      setWizardServices(prev => [...prev, val]);
                  }}
                />
                {wizardServices.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {wizardServices.map(s => (
                      <span key={s} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-indigo-50 text-[#635BFF] rounded-full">
                        {s}
                        <button onClick={() => setWizardServices(prev => prev.filter(n => n !== s))}><X size={11} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-[#0A2540] flex items-center gap-2 mb-2">
                  <Users size={16} className="text-[#635BFF]" />
                  Service Providers
                </label>
                <div
                  onClick={onOpenProvidersModal}
                  className="w-full p-4 border border-[#E0E6EB] rounded-xl cursor-pointer bg-white flex items-center gap-3 text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <Users size={18} className="text-[#635BFF]" />
                  <span className={wizardProviders.length > 0 ? "text-[#0A2540] font-bold text-sm" : "text-sm"}>
                    {wizardProviders.length > 0 ? wizardProviders.join(", ") : "Select employees..."}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-[#0A2540] flex items-center gap-2 mb-2">
                  <Edit2 size={16} className="text-gray-400" />
                  Additional Information <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={wizardNotes}
                  onChange={(e) => setWizardNotes(e.target.value)}
                  className="w-full p-4 border border-[#E0E6EB] rounded-xl h-32 outline-none"
                  placeholder="Add required notes about this media set..."
                />
                {!wizardNotes && (
                  <p className="text-red-500 text-xs mt-2">This field is required</p>
                )}
              </div>
            </div>
          )}

          {uploadStep === 3 && (
            <div className="space-y-6">
              <p className="text-[11px] font-bold text-[#635BFF] uppercase tracking-widest text-center">Step 3: Upload Media</p>

              {wizardFiles.length === 0 ? (
                <CustomFileUpload
                  label=""
                  accept="image/*,video/*"
                  onFileSelect={(file) => {
                    const fakeEvent = {
                      target: { files: [file] }
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleFileChange(fakeEvent);
                  }}
                />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-[#0A2540]">{wizardFiles.length} files selected</h4>
                    <button onClick={() => fileInputRef.current?.click()} className="text-sm text-[#635BFF] font-bold hover:underline">
                      Add more
                    </button>
                    <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                    {wizardFiles.map(file => (
                      <div key={file.id} className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden group border border-gray-200">
                        {file.type === 'video' && (file.src.startsWith('blob:') || file.src.match(/\.(mp4|webm|ogg)$/i)) ? (
                          <video src={`${file.src}#t=0.001`} className="absolute inset-0 w-full h-full object-cover" preload="metadata" muted playsInline />
                        ) : (
                          <Image src={file.src} alt={file.fileName || "Media"} fill className="object-cover" />
                        )}
                        {file.type === 'video' && <Film size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10 drop-shadow-md" />}
                        <button
                          onClick={() => setWizardFiles(prev => prev.filter(f => f.id !== file.id))}
                          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow hover:text-red-500 hover:bg-red-50 transition-all z-20"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-10 w-full">
          {uploadStep > 1 && (
            <button
              onClick={() => setUploadStep(prev => prev - 1)}
              style={{ width: "35%" }}
              className="py-4 border border-gray-200 rounded-xl font-bold text-[#0A2540] hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (uploadStep === 3) {
                handleCompleteUpload();
              } else {
                if (uploadStep === 1 && !wizardClient) return;
                if (uploadStep === 2 && !wizardNotes) return;
                setUploadStep(prev => prev + 1);
              }
            }}
            disabled={(uploadStep === 1 && !wizardClient) || (uploadStep === 2 && !wizardNotes) || (uploadStep === 3 && wizardFiles.length === 0)}
            style={{ width: uploadStep > 1 ? "65%" : "100%" }}
            className="py-4 bg-[#635BFF] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadStep === 3 ? "Complete" : "Next"}
            {uploadStep < 3 && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
