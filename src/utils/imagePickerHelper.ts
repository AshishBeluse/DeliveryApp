import { Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import type { Permission } from 'react-native-permissions';
import i18n from './i18n';

export type ImagePickerResponse = {
  uri: string;
  fileName: string;
  type: string;
  fileSize: number;
};

export const pickImage = async (
  source: 'camera' | 'gallery',
): Promise<{
  success: boolean;
  data?: ImagePickerResponse;
  error?: string;
  requiresSettingsRedirect?: boolean;
}> => {
  try {
    // ✅ Android gallery: NO permission required (system picker)
    // ✅ Android camera: needs CAMERA permission + manifest entry
    let permission: Permission | null = null;

    if (Platform.OS === 'android') {
      permission = source === 'camera' ? PERMISSIONS.ANDROID.CAMERA : null;
    } else {
      permission =
        source === 'camera'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
    }

    if (permission) {
      let status = await check(permission);

      if (status === RESULTS.DENIED) {
        const req = await request(permission);
        if (req !== RESULTS.GRANTED) {
          // ✅ re-check after request (some devices return DENIED instead of BLOCKED)
          status = await check(permission);

          if (status === RESULTS.BLOCKED) {
            return {
              success: false,
              error: i18n.t('imagePicker.permissionBlocked'),
              requiresSettingsRedirect: true,
            };
          }

          return {
            success: false,
            error: i18n.t('imagePicker.permissionDenied'),
          };
        }
      }

      if (status === RESULTS.BLOCKED) {
        return {
          success: false,
          error: i18n.t('imagePicker.permissionBlocked'),
          requiresSettingsRedirect: true,
        };
      }

      if (status === RESULTS.UNAVAILABLE) {
        return {
          success: false,
          error: i18n.t('imagePicker.permissionUnavailable'),
        };
      }
    }

    const options: CameraOptions & ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      includeBase64: false,
      selectionLimit: 1,
    };

    const pickerResult =
      source === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

    if (pickerResult.didCancel) {
      return { success: false, error: i18n.t('imagePicker.userCancelled') };
    }

    if (pickerResult.errorCode) {
      // permission error may come from image picker itself
      if (pickerResult.errorCode === 'permission') {
        return {
          success: false,
          error: i18n.t('imagePicker.permissionDenied'),
          requiresSettingsRedirect: true,
        };
      }

      return {
        success: false,
        error: pickerResult.errorMessage || i18n.t('imagePicker.genericError'),
      };
    }

    const asset = pickerResult.assets?.[0];
    if (!asset?.uri) {
      return { success: false, error: i18n.t('imagePicker.noImageSelected') };
    }

    return {
      success: true,
      data: {
        uri: asset.uri,
        fileName: asset.fileName || 'image.jpg',
        type: asset.type || 'image/jpeg',
        fileSize: asset.fileSize || 0,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || i18n.t('imagePicker.unexpectedError'),
    };
  }
};
