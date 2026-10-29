const baseUrl = import.meta.env.BASE_URL;

export function link(path: string): string {
  if (baseUrl === '/') return path;
  return `${baseUrl}${path}`;
}

export function workPath(slug: string): string {
  return link(`/works/${slug}/`);
}

export function collectionPath(slug: string): string {
  return link(`/collections/${slug}/`);
}
