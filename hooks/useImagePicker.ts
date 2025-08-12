// import * as ImagePicker from 'expo-image-picker';
// import { useState } from 'react';
// import { storageService } from '../services/storage';
// import { useAuth } from '../contexts/AuthContext';

// export function useImagePicker() {
//   const { user } = useAuth();
//   const [uploading, setUploading] = useState(false);

//   const pickAndUploadImage = async (): Promise<string | null> => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') throw new Error('Permission denied');

//     // SDK mới dùng MediaType; fallback cho SDK cũ để khỏi lỗi type
//     const hasNew = (ImagePicker as any).MediaType?.image;
//     const result: any = await ImagePicker.launchImageLibraryAsync(
//       hasNew
//         ? { mediaTypes: (ImagePicker as any).MediaType.image, selectionLimit: 1, quality: 0.8 }
//         : { mediaTypes: (ImagePicker as any).MediaTypeOptions.Images, quality: 0.8 }
//     );

//     if (result.canceled) return null;
//     const uri = result.assets?.[0]?.uri;
//     if (!uri) return null;

//     setUploading(true);
//     try {
//       const url = await storageService.uploadImage(uri, user?.id);
//       return url;
//     } finally {
//       setUploading(false);
//     }
//   };

//   return { pickAndUploadImage, uploading };
// }

// new 
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { storageService } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';

export function useImagePicker() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  /**
   * Mở gallery + upload lên Supabase Storage.
   * Trả về public URL (string) hoặc null nếu cancel.
   */
  const pickAndUploadImage = async (): Promise<string | null> => {
    // 1) Quyền truy cập ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission for media library denied');
    }

    // 2) SDK mới dùng MediaType; fallback cho SDK cũ để khỏi warning
    const hasNew = (ImagePicker as any).MediaType?.image;
    const options: any = hasNew
      ? { mediaTypes: (ImagePicker as any).MediaType.image, selectionLimit: 1, quality: 0.85 }
      : { mediaTypes: (ImagePicker as any).MediaTypeOptions.Images, quality: 0.85 };

    const result: any = await ImagePicker.launchImageLibraryAsync(options);
    if (result.canceled) return null;

    // 3) Lấy file URI
    const asset = result.assets?.[0];
    const uri: string | undefined = asset?.uri;
    if (!uri) return null;

    // 4) Upload
    setUploading(true);
    try {
      const url = await storageService.uploadImage(uri, user?.id);
      return url;
    } finally {
      setUploading(false);
    }
  };

  return { pickAndUploadImage, uploading };
}
