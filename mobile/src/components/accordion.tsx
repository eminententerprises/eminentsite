import { useState } from "react";
import { LayoutAnimation, Pressable, StyleSheet, View } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { Text } from "@/components/ui";
import { colors, space } from "@/theme";

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <View>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <View key={item.question} style={[styles.item, i === items.length - 1 && { borderBottomWidth: 0 }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setOpen(isOpen ? null : i);
              }}
              style={styles.header}
            >
              <Text variant="headingSm" style={{ flex: 1 }}>
                {item.question}
              </Text>
              <ChevronDown size={18} color={colors.inkMuted} style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }} />
            </Pressable>
            {isOpen ? (
              <Text variant="bodyMd" color={colors.inkSecondary} style={{ paddingBottom: space.lg }}>
                {item.answer}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderHairline },
  header: { flexDirection: "row", alignItems: "center", gap: space.md, paddingVertical: space.lg },
});
