const vibrate = (ms: number | number[]) => {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(ms);
    }
  } catch {}
};

export const hapticService = {
  light: () => vibrate(10),
  warning: () => vibrate(30),
  error: () => vibrate([50, 30, 50]),
  success: () => vibrate(15),
};
