import { Platform, PermissionsAndroid } from 'react-native';
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
import { Permission } from 'react-native-permissions';
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
    let permission: Permission;

    if (Platform.OS === 'android') {
      const sdkVersion = Platform.Version;

      if (source === 'camera') {
        permission = PERMISSIONS.ANDROID.CAMERA;
      } else {
        // Handle Android 13+ properly
        permission =
          sdkVersion >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    } else {
      permission =
        source === 'camera'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
    }

    let result = await check(permission);

    if (result === RESULTS.DENIED) {
      const req = await request(permission);
      if (req !== RESULTS.GRANTED) {
        return {
          success: false,
          error: i18n.t('imagePicker.permissionDenied'),
        };
      }
    } else if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
      return {
        success: false,
        error: i18n.t('imagePicker.permissionBlocked'),
        requiresSettingsRedirect: true,
      };
    }

    const options: CameraOptions & ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      includeBase64: false,
    };

    const pickerResult =
      source === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

    if (pickerResult.didCancel) {
      return { success: false, error: i18n.t('imagePicker.userCancelled') };
    }

    if (pickerResult.errorCode) {
      return {
        success: false,
        error: pickerResult.errorMessage || i18n.t('imagePicker.genericError'),
      };
    }

    const asset = pickerResult.assets?.[0];
    if (asset?.uri) {
      return {
        success: true,
        data: {
          uri: asset.uri,
          fileName: asset.fileName || 'image.jpg',
          type: asset.type || 'image/jpeg',
          fileSize: asset.fileSize || 0,
        },
      };
    }

    return { success: false, error: i18n.t('imagePicker.noImageSelected') };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || i18n.t('imagePicker.unexpectedError'),
    };
  }
};

