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
    <div className={`grid grid-cols-12 px-2 py-1 gap-1 ${className ?? ""}`}>
      <div className="col-span-12">
        <Actions className={actionsClassName} />
      </div>
      <div className="col-span-12">
        <Options className={optionsClassName} />
      </div>
    </div>
  );
}
