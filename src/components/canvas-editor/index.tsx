"use client";
import CanvasEditorRoot from "./CanvasEditor";
import Canvas from "./Canvas";
import Options from "./Options";
import Actions from "./Actions";
import Toolbar from "./Toolbar";

type CanvasEditorType = typeof CanvasEditorRoot & {
  Canvas: typeof Canvas;
  Options: typeof Options;
  Actions: typeof Actions;
  Toolbar: typeof Toolbar;
};

const CanvasEditor = CanvasEditorRoot as CanvasEditorType;
CanvasEditor.Canvas = Canvas;
CanvasEditor.Options = Options;
CanvasEditor.Actions = Actions;
CanvasEditor.Toolbar = Toolbar;

export default CanvasEditor;
