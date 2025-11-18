"use client";

import * as React from "react";
import {
  useDropzone,
  type DropzoneOptions,
  type FileRejection,
  type DropEvent,
} from "react-dropzone";

export type UploadRenderState = {
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  isFocused: boolean;
  open: () => void;
  inputId?: string;
};

export type UploadProps = Omit<DropzoneOptions, "onDrop"> & {
  children?: React.ReactNode | ((state: UploadRenderState) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  >;

  onDrop?: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;

  onFiles?: (files: File[]) => void;
  inputId?: string;
};

export const Upload = React.forwardRef<HTMLDivElement, UploadProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      inputProps,
      onDrop,
      onFiles,
      inputId,
      ...dropzoneOptions
    } = props;

    const handleDrop = React.useCallback<
      NonNullable<DropzoneOptions["onDrop"]>
    >(
      (accepted, rejections, event) => {
        onDrop?.(accepted, rejections, event);
        if (accepted?.length) {
          onFiles?.(accepted);
        }
      },
      [onDrop, onFiles]
    );

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      isFocused,
      open,
    } = useDropzone({
      ...dropzoneOptions,
      onDrop: handleDrop,
    });

    const rootProps = getRootProps({
      className,
      style,
    });

    const inputResolvedId = inputId ?? inputProps?.id;
    const inputElProps = getInputProps({
      ...inputProps,
      id: inputResolvedId,
    });

    const renderState: UploadRenderState = {
      isDragActive,
      isDragAccept,
      isDragReject,
      isFocused,
      open,
      inputId: inputResolvedId,
    };

    return (
      <div {...rootProps} ref={ref}>
        <input {...inputElProps} />
        {typeof children === "function" ? children(renderState) : children}
      </div>
    );
  }
);

Upload.displayName = "Upload";

export default Upload;
