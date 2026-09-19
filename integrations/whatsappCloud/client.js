const graphBase = () => "https://graph.facebook.com/" + (process.env.META_GRAPH_VERSION || "v21.0");

export async function graphRequest(pathname, options = {}) {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) throw new Error("META_ACCESS_TOKEN is not configured");
  const url = graphBase() + "/" + String(pathname).replace(/^\\//, "");
  const response = await fetch(url, {
    ...options,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + token,
      ...(options.headers || {})
    },
    signal: options.signal || AbortSignal.timeout(20000)
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || ("graph_http_" + response.status));
  return body;
}
