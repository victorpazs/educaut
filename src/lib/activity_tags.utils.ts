import type { ComponentType } from "react";
import {
  Calculator,
  BookOpen,
  FlaskConical,
  History as HistoryIcon,
  Globe,
  Palette,
  Dumbbell,
  Music,
  Cpu,
  Tag as TagIcon,
} from "lucide-react";

export type TagIconComponent = ComponentType<{ className?: string }>;

const MAP: Record<string, TagIconComponent> = {
  math: Calculator,
  portuguese: BookOpen,
  science: FlaskConical,
  history: HistoryIcon,
  geography: Globe,
  arts: Palette,
  pe: Dumbbell,
  english: BookOpen,
  music: Music,
  technology: Cpu,
};

export function getTagIcon(tag: string): TagIconComponent {
  return MAP[tag] ?? TagIcon;
}
