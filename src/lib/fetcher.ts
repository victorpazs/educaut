import { toast } from "sonner";

export async function fetchData(
  route: string,
  query: Record<string, any> = {}
) {
  const url = new URL(route, API_HOST);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url.toString(), config);

    if (!response.ok) {
      throw new Error(response.statusText); // Throw error
    }
    return await response.json();
  } catch (error: any) {
    toast.error(
      error && error.message ? error.message : "Something went wrong"
    );
    throw error;
  }
}
