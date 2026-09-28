import { supabase } from './supabase.js';

export const PHOTO_BUCKET = 'zdjecia';
const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|webp)$/i;

function toPhoto(file, groupName = '') {
  const path = groupName ? `${groupName}/${file.name}` : file.name;
  return {
    name: file.name,
    path,
    url: supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl,
  };
}

export async function listPhotoGroups() {
  const bucket = supabase.storage.from(PHOTO_BUCKET);
  const { data: entries, error } = await bucket.list('', {
    limit: 1000,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) return { groups: [], error };

  const rootEntries = entries ?? [];
  const ungroupedPhotos = rootEntries
    .filter((entry) => entry.id !== null && IMAGE_EXTENSIONS.test(entry.name))
    .map((file) => toPhoto(file));
  const folders = rootEntries.filter((entry) => entry.id === null);
  const folderResults = await Promise.all(
    folders.map(async (folder) => {
      const { data, error: folderError } = await bucket.list(folder.name, {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      return {
        name: folder.name,
        photos: (data ?? [])
          .filter((file) => file.id !== null && IMAGE_EXTENSIONS.test(file.name))
          .map((file) => toPhoto(file, folder.name)),
        error: folderError,
      };
    }),
  );

  const groups = folderResults
    .filter((group) => group.photos.length > 0)
    .map((group) => ({ ...group, label: group.name }));

  if (ungroupedPhotos.length > 0) {
    groups.push({ name: '', label: 'Bez grupy', photos: ungroupedPhotos });
  }

  const folderError = folderResults.find((group) => group.error)?.error ?? null;
  return { groups, error: folderError };
}