import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

// Keep imports optional so the app won't crash if native packages aren't installed yet.
let RNMapView: any = null;
let Polyline: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const maps = require("react-native-maps");
  RNMapView = maps.default || maps.MapView || maps;
  Polyline = maps.Polyline || maps.default?.Polyline;
} catch (e) {
  // react-native-maps not installed — we'll render a placeholder
}

import {
  startWatchingLocation,
  stopWatchingLocation,
} from "../services/locationService";

export default function MapTracker() {
  const [route, setRoute] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // start watching location (service will fall back to mocks if needed)
    watchIdRef.current = startWatchingLocation((pos) => {
      if (!pos) return;
      setRoute((r) => [
        ...r,
        { latitude: pos.latitude, longitude: pos.longitude },
      ]);
    });

    return () => {
      if (watchIdRef.current != null) stopWatchingLocation(watchIdRef.current);
    };
  }, []);

  if (RNMapView) {
    return (
      <View style={styles.container}>
        <RNMapView
          style={styles.map as any}
          initialRegion={
            route.length
              ? {
                  latitude: route[0].latitude,
                  longitude: route[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : {
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }
          }
        >
          {route.length > 0 && Polyline ? (
            <Polyline
              coordinates={route}
              strokeWidth={4}
              strokeColor="#ea580c"
            />
          ) : null}
        </RNMapView>
      </View>
    );
  }

  // Fallback placeholder (works on web / when native map isn't installed)
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Map unavailable</Text>
      <Text style={styles.placeholderSub}>
        Install react-native-maps or run on a device for full map features.
      </Text>
      <View style={styles.routePreview}>
        <Text style={{ color: "#6b7280" }}>Tracked points: {route.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: { flex: 1 },
  placeholder: {
    height: 260,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  placeholderSub: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  routePreview: { padding: 8, backgroundColor: "#fff", borderRadius: 8 },
});
