import React, { useRef, useCallback } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { RISK_COLORS } from "../constants/theme";
import { SamplePoint } from "../constants/sampleData";

interface MapDisplayProps {
  samples: SamplePoint[];
  onMarkerPress: (sample: SamplePoint) => void;
  mapRef: React.RefObject<any>;
}

function buildMapHTML(samples: SamplePoint[]): string {
  const markers = samples
    .map(
      (s) => `
      L.circleMarker([${s.latitude}, ${s.longitude}], {
        radius: 12,
        fillColor: '${RISK_COLORS[s.riskLevel]}',
        color: '#FFFFFF',
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.9,
      })
      .addTo(map)
      .bindTooltip('${s.id.split("-")[1]}', {
        permanent: true,
        direction: 'center',
        className: 'marker-label',
      })
      .on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: '${s.id}' }));
      });`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    #map { width: 100%; height: 100vh; }
    .marker-label {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      color: #FFF;
      font-weight: bold;
      font-size: 10px;
      text-align: center;
    }
    .leaflet-control-attribution { font-size: 8px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: true,
      attributionControl: true,
    }).setView([44.08, -103.23], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    ${markers}

    window.flyTo = function(lat, lng) {
      map.flyTo([lat, lng], 15, { duration: 0.5 });
    };
  </script>
</body>
</html>`;
}

export default function MapDisplay({ samples, onMarkerPress, mapRef }: MapDisplayProps) {
  const webViewRef = useRef<WebView>(null);

  // Expose webViewRef through mapRef for external flyTo calls
  if (mapRef && typeof mapRef === "object") {
    (mapRef as React.MutableRefObject<any>).current = webViewRef.current;
  }

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "markerPress") {
          const sample = samples.find((s) => s.id === data.id);
          if (sample) onMarkerPress(sample);
        }
      } catch {
        // ignore parse errors
      }
    },
    [samples, onMarkerPress]
  );

  return (
    <WebView
      ref={webViewRef}
      style={StyleSheet.absoluteFillObject}
      source={{ html: buildMapHTML(samples) }}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      scrollEnabled={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
}

export function animateToSample(mapRef: React.RefObject<any>, sample: SamplePoint) {
  if (mapRef.current) {
    mapRef.current.injectJavaScript(
      `window.flyTo(${sample.latitude}, ${sample.longitude}); true;`
    );
  }
}
