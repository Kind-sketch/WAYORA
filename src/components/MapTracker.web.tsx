import React from "react";
import { StyleSheet, View, Text } from "react-native";

// TypeScript declaration for iframe in React Native Web
declare global {
  namespace JSX {
    interface IntrinsicElements {
      iframe: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
    }
  }
}

export default function MapTracker() {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-122.44,-37.79,-122.42,-37.78&layer=mapnik&marker=37.78825,-122.4324`;
  
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: 10 }}
          title="Map Tracker"
          loading="lazy"
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>📍 Current Location</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    height: 240,
    position: 'relative',
  },
  mapContainer: {
    height: "100%", 
    width: "100%",
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1000,
  },
  overlayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});
