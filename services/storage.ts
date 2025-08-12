// import { supabase } from './supabase';
// import { STORAGE_BUCKET } from '../utils/constants';

// function extFromUri(uri: string) {
//   const clean = uri.split('?')[0];
//   const parts = clean.split('.');
//   const ext = parts[parts.length - 1];
//   return ext?.toLowerCase() || 'jpg';
// }

// export const storageService = {
//   async uploadImage(uri: string, userId?: string): Promise<string | null> {
//     const res = await fetch(uri);
//     const blob = await res.blob();
//     const ext = extFromUri(uri);
//     const path = `${userId ?? 'public'}/${Date.now()}.${ext}`;

//     const { data, error } = await supabase.storage
//       .from(STORAGE_BUCKET)
//       .upload(path, blob, { upsert: false, contentType: blob.type || `image/${ext}` });

//     if (error) throw error;

//     const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
//     return pub.publicUrl;
//   },
// };

// new 
import * as FileSystem from 'expo-file-system';
import { STORAGE_BUCKET } from '../utils/constants';
import { supabase } from './supabase';

// Lấy URL từ .env (EXPO_PUBLIC_SUPABASE_URL)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;

function getExtFromUri(uri: string) {
  const q = uri.indexOf('?');
  const clean = q >= 0 ? uri.slice(0, q) : uri;
  const ext = clean.split('.').pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : 'jpg';
}

export const storageService = {
  /**
   * Upload ảnh lên Supabase Storage bằng uploadAsync (tránh lỗi Blob trên Android).
   * Trả về public URL (bucket đang để public).
   */
  async uploadImage(localUri: string, userId?: string | null): Promise<string> {
    const ext = getExtFromUri(localUri);
    const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
    const path = `${userId ?? 'public'}/${Date.now()}.${ext}`;

    // Lấy access token hiện tại để gọi REST Storage
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) throw new Error('Not authenticated');

    // Upload trực tiếp qua REST API
    const url = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`;
    const res = await FileSystem.uploadAsync(url, localUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
    });

    // 200/201 là OK
    if (res.status !== 200 && res.status !== 201) {
      // log để debug dễ hơn
      console.log('[uploadImage] failed', res.status, res.body);
      throw new Error(`Upload failed (${res.status})`);
    }

    // Vì bucket public, public URL có dạng:
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
    return publicUrl;
  },
};
