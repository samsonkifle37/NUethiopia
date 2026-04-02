"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const EMOJI_CATEGORIES = {
  travel: ["✈️", "🧳", "🗺️", "🏖️", "⛰️", "🏔️", "🌋", "🗼", "🏰", "🕌"],
  food: ["☕", "🍰", "🍷", "🍽️", "🥘", "🍲", "🥗", "🍱", "🌮", "🍜"],
  activities: ["🏃", "🚴", "🏊", "🧗", "⛳", "🎿", "🛶", "🏄", "🤿", "🧘"],
  nature: ["🌲", "🌴", "🌺", "🌸", "🌼", "🌻", "🌷", "🌹", "🦁", "🐘"],
  favorites: ["⭐", "❤️", "💎", "🎁", "🏆", "👑", "🌟", "✨", "💫", "🔥"],
};

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
}

export function EmojiPicker({ value, onChange, label }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>("travel");

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="text-3xl">{value}</span>
        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showPicker ? "rotate-180" : ""}`} />
      </button>

      {/* Picker Dropdown */}
      {showPicker && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {Object.keys(EMOJI_CATEGORIES).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat as keyof typeof EMOJI_CATEGORIES)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-stone-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Emojis Grid */}
          <div className="grid grid-cols-5 gap-2">
            {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onChange(emoji);
                  setShowPicker(false);
                }}
                className={`w-full aspect-square text-2xl flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors ${
                  value === emoji ? "bg-stone-900/10 ring-2 ring-stone-900" : ""
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Custom Emoji Input */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Or paste any emoji:
            </label>
            <input
              type="text"
              maxLength={2}
              placeholder="Paste emoji..."
              value={value}
              onChange={(e) => onChange(e.target.value.slice(0, 2))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
        </div>
      )}
    </div>
  );
}
