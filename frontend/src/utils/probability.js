import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export function getProbabilityTheme(probability) {
  if (probability > 80) {
    return {
      className: "probability-high",
      label: "High chance",
      icon: CheckCircle2,
    };
  }
  if (probability >= 50) {
    return {
      className: "probability-medium",
      label: "Moderate chance",
      icon: AlertTriangle,
    };
  }
  return {
    className: "probability-low",
    label: "Ambitious",
    icon: ShieldAlert,
  };
}
