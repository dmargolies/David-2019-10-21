const BASE = '/api/files';

async function betterFetch(url, params) {
  const response = await fetch(url, params)
  const json = await response.json();

  if (!response.ok) {
    return Promise.reject({ ...json, status: response.status, statusText: response.statusText });
  }

  return json;
}

export function deleteFile(filekey) {
  return betterFetch(`${BASE}/${filekey}`, { method: 'DELETE' });
}

export function fetchFiles() {
  return betterFetch(BASE);
}

export function postFile(file) {
  const body = new FormData();
  body.append('file', file);

  return betterFetch(BASE,{ method: 'POST', body });
}

export function searchFiles(searchTerm) {
  return betterFetch(`${BASE}?q=${searchTerm}`);
}
