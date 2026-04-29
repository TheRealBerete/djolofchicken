export function playNotificationSound() {
  try {
    const audio = new Audio("/new_order.mp3");
    audio.volume = 0.7;
    audio.play();
  } catch {
    // Audio not supported
  }
}
