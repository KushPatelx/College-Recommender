import { Sparkles, ArrowUpRight } from "lucide-react";

export default function PresetBar({ presets, onSelect }) {
  return (
    <div className="preset-bar reveal-item">
      <div className="preset-intro"><span className="preset-spark"><Sparkles size={17} /></span><div><strong>Try a demo profile</strong><small>One click. Instant model run.</small></div></div>
      <div className="preset-options">
        {presets.map((preset) => (
          <button type="button" className="preset-button" key={preset.label} onClick={() => onSelect(preset)}>
            <span className="preset-emoji">{preset.emoji}</span>{preset.label}<ArrowUpRight size={14} className="preset-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
}
