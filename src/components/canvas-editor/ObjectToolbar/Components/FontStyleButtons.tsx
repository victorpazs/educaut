"use client";
import React from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
} from "lucide-react";
import IconButton from "../../../ui/icon-button";

type FontStyleButtonsProps = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleUnderline: () => void;
  onToggleStrikethrough: () => void;
};

export default function FontStyleButtons({
  isBold,
  isItalic,
  isUnderline,
  isStrike,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onToggleStrikethrough,
}: FontStyleButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      <IconButton
        title="Negrito"
        aria-pressed={isBold}
        onClick={onToggleBold}
        isSelected={isBold}
        icon={<Bold className="h-4 w-4" />}
      />
      <IconButton
        title="Itálico"
        aria-pressed={isItalic}
        onClick={onToggleItalic}
        isSelected={isItalic}
        icon={<Italic className="h-4 w-4" />}
      />
      <IconButton
        title="Sublinhado"
        aria-pressed={isUnderline}
        onClick={onToggleUnderline}
        isSelected={isUnderline}
        icon={<UnderlineIcon className="h-4 w-4" />}
      />
      <IconButton
        title="Tachado"
        aria-pressed={isStrike}
        onClick={onToggleStrikethrough}
        isSelected={isStrike}
        icon={<Strikethrough className="h-4 w-4" />}
      />
    </div>
  );
}
