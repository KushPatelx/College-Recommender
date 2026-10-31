import {
  Sparkles,
  ArrowUpRight,
  MousePointerClick,
} from "lucide-react";

export default function PresetBar({ presets, onSelect }) {
  return (
    <section className="pw-preset-card">
      <div className="pw-preset-heading">
        <div className="pw-preset-icon">
          <Sparkles size={19} />
        </div>

        <div>
          <h3>Explore demo profiles</h3>
          <p>Not sure where to start? Try a sample student profile.</p>
        </div>
      </div>

      <div className="pw-preset-options">
        {presets.map((preset) => (
          <button
            type="button"
            className="pw-preset-button"
            key={preset.label}
            onClick={() => onSelect(preset)}
          >
            <span className="pw-preset-emoji">
              {preset.emoji}
            </span>

            <span>{preset.label}</span>

            <ArrowUpRight
              size={15}
              className="pw-preset-arrow"
            />
          </button>
        ))}
      </div>

      <div className="pw-preset-footnote">
        <MousePointerClick size={14} />
        Select any profile to automatically fill the form.
      </div>
    </section>
  );
}