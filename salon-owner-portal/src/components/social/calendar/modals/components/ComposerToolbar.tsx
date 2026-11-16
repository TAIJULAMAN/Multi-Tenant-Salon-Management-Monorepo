import React from "react";
import { Smile, Hash } from "lucide-react";

export function ComposerToolbar({
  emojiPickerRef,
  showEmojiPicker,
  setShowEmojiPicker,
  insertAtCursor,
  descriptionLength,
  emojis
}: {
  emojiPickerRef: React.RefObject<HTMLDivElement | null>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (val: boolean) => void;
  insertAtCursor: (text: string) => void;
  descriptionLength: number;
  emojis: string[];
}) {
  return (
    <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 mt-2">
      <div className="flex items-center gap-2">
        <div className="relative" ref={emojiPickerRef}>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-[#64748B] hover:text-[#635BFF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 w-[280px] bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-3 grid grid-cols-5 gap-2 z-20">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    insertAtCursor(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-xl hover:bg-[#F1F5F9] p-2 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => insertAtCursor("#")}
          className="p-2 text-[#64748B] hover:text-[#635BFF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
        >
          <Hash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
