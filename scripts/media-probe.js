// HTMLMediaElement.play() can remain pending forever when a provider mounts a
// video without a usable source. Bound the diagnostic, not the actual player.
export async function probePlay(locator, timeout = 5000) {
  return locator.evaluate(async (video, ms) => {
    let timer;
    video.muted = true;
    try {
      await Promise.race([
        video.play(),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Playback probe timed out waiting for media')), ms); }),
      ]);
    } catch (error) { video.pause(); throw error; }
    finally { clearTimeout(timer); }
  }, timeout);
}
