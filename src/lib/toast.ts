import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
    });
  },

  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
    });
  },

  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
    });
  },

  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
    });
  },

  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  custom: (jsx: (id: string | number) => React.ReactElement) => {
    return sonnerToast.custom(jsx);
  },

  dismiss: (id?: string | number) => {
    return sonnerToast.dismiss(id);
  },

  message: (message: string, data?: any) => {
    return sonnerToast.message(message, data);
  },
};
