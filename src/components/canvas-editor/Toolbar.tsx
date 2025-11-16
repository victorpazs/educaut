"use client";
import React from "react";
import Options from "./Options";
import Actions from "./Actions";

type ToolbarProps = {
  className?: string;
  optionsClassName?: string;
  actionsClassName?: string;
};

export default function Toolbar({
  className,

  optionsClassName,
  actionsClassName,
}: ToolbarProps) {
  return (
    <div
      className={`flex items-center px-2 justify-between gap-3 ${
        className ?? ""
      }`}
    >
      <Options className={optionsClassName} />
      <Actions className={actionsClassName} />
    </div>
  );
}
