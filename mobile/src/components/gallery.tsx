import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { RemoteImage } from "@/components/layout";
import { Text } from "@/components/ui";
import { palette, space } from "@/theme";

interface GalleryImage {
  src: string;
  alt: string;
}

/** Swipeable full-width gallery with a counter; tap opens a full-screen lightbox. */
export function Gallery({ images, height }: { images: GalleryImage[]; height: number }) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

  if (images.length === 0) {
    return <View style={{ height, backgroundColor: palette.navy100 }} />;
  }

  return (
    <View style={{ height }}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(img, i) => `${img.src}-${i}`}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index: i }) => (
          <Pressable onPress={() => setLightbox(i)} accessibilityRole="imagebutton" accessibilityLabel={item.alt || `Photo ${i + 1}`}>
            <RemoteImage src={item.src} style={{ width, height }} />
          </Pressable>
        )}
      />
      <View style={styles.counter}>
        <Text variant="mono" color={palette.paper} style={{ fontSize: 12 }}>
          {index + 1} / {images.length}
        </Text>
      </View>

      <Modal visible={lightbox !== null} animationType="fade" onRequestClose={() => setLightbox(null)} statusBarTranslucent>
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            initialScrollIndex={lightbox ?? 0}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            keyExtractor={(img, i) => `lb-${img.src}-${i}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ width, flex: 1, justifyContent: "center" }}>
                <RemoteImage src={item.src} style={{ width, height: "80%", backgroundColor: "transparent" }} contentFit="contain" />
              </View>
            )}
          />
          <Pressable
            onPress={() => setLightbox(null)}
            accessibilityLabel="Close gallery"
            hitSlop={12}
            style={[styles.close, { top: insets.top + space.md }]}
          >
            <X size={24} color={palette.paper} />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(16,28,61,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  close: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});
