import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActivitiesTags } from "@/components/activities_tags";

interface ActivityFormProps {
  name: string;
  description: string;
  selectedTags: string[];
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
}

export function ActivityForm({
  name,
  description,
  selectedTags,
  onNameChange,
  onDescriptionChange,
  onToggleTag,
}: ActivityFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Nome</label>
        <Input
          placeholder="Digite o nome da atividade"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Descrição</label>
        <Textarea
          placeholder="Ex.: Atividade de completar as palavras com vogais."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <label className="text-sm">Categorias</label>
        <ActivitiesTags selectedTags={selectedTags} onToggleTag={onToggleTag} />
      </div>
    </div>
  );
}
