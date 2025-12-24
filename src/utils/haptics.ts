type Pattern =
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError'
  | 'selection';

let Haptics: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Haptics = require('react-native-haptic-feedback');
} catch {
  Haptics = null; 
}

const defaultOpts = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const triggerHaptic = (pattern: Pattern = 'impactLight') => {
  if (Haptics?.trigger) {
    try {
      Haptics.trigger(pattern, defaultOpts);
    } catch {
      // no-op
    }
  }
};

