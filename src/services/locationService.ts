// Minimal location service with safe fallbacks for web and environments without expo-location
let watchIdCounter = 1;

type PositionCallback = (
  pos: { latitude: number; longitude: number } | null
) => void;

/**
 * startWatchingLocation
 * - Tries (in order): expo-location (native), browser geolocation, then mock interval.
 * - Returns an opaque id which can be passed to stopWatchingLocation.
 */
export function startWatchingLocation(cb: PositionCallback): number {
  // Prefer expo-location if it's available at runtime (native / dev client)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Location = require("expo-location");
    if (Location && typeof Location.watchPositionAsync === "function") {
      const id = watchIdCounter++;
      // start native watch
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            console.warn("expo-location permission not granted");
            cb(null);
            return;
          }

          const subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Highest,
              timeInterval: 2000,
              // distanceInterval: 1, // optional
            },
            (loc: any) => {
              if (!loc || !loc.coords) return;
              cb({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              });
            }
          );

          // store subscription so we can remove later
          (startWatchingLocation as any)[id] = subscription;
        } catch (e) {
          console.warn("expo-location watch failed", e);
          cb(null);
        }
      })();
      return id;
    }
  } catch (e) {
    // expo-location not available at runtime
  }

  // Browser geolocation fallback
  if (typeof navigator !== "undefined" && "geolocation" in navigator) {
    const id = watchIdCounter++;
    const geoId = navigator.geolocation.watchPosition(
      (position) => {
        cb({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation watch error", err);
        cb(null);
      },
      { enableHighAccuracy: true }
    );
    (startWatchingLocation as any)[id] = geoId;
    return id;
  }

  // Fallback: emit a mock position every 2s
  const id = watchIdCounter++;
  let lat = 37.7749;
  let lng = -122.4194;
  const timer = setInterval(() => {
    lat += (Math.random() - 0.5) * 0.0005;
    lng += (Math.random() - 0.5) * 0.0005;
    cb({ latitude: lat, longitude: lng });
  }, 2000);
  (startWatchingLocation as any)[id] = timer;
  return id;
}

export function stopWatchingLocation(id: number) {
  const ref = (startWatchingLocation as any)[id];
  try {
    // expo-location subscription
    if (ref && typeof ref.remove === "function") {
      ref.remove();
      return;
    }

    // browser clearWatch
    if (
      typeof navigator !== "undefined" &&
      "geolocation" in navigator &&
      typeof ref === "number"
    ) {
      navigator.geolocation.clearWatch(ref);
      return;
    }

    // timer
    if (ref) {
      clearInterval(ref as any);
      return;
    }
  } catch (e) {
    // ignore
  }
}
