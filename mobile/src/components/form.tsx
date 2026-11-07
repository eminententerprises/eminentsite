import { useState, type ReactNode } from "react";
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View, type KeyboardTypeOptions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, ChevronDown, X } from "lucide-react-native";
import { Text } from "@/components/ui";
import { colors, fonts, palette, radius, space } from "@/theme";

export function FieldLabel({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi, marginBottom: 6 }} color={colors.inkPrimary}>
      {children}
      {optional ? <Text variant="bodySm" color={colors.inkMuted}> (optional)</Text> : null}
    </Text>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text variant="bodySm" color={colors.danger} style={{ marginTop: 4 }} accessibilityLiveRegion="polite">
      {message}
    </Text>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  optional,
  keyboardType,
  multiline,
  autoCapitalize,
  autoComplete,
  suffix,
  maxLength,
}: {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  optional?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "name" | "tel" | "email" | "off";
  suffix?: string;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View>
      {label ? <FieldLabel optional={optional}>{label}</FieldLabel> : null}
      <View
        style={[
          styles.input,
          multiline && { height: 110, alignItems: "flex-start", paddingVertical: 12 },
          focused && { borderColor: palette.navy800, borderWidth: 1.5 },
          !!error && { borderColor: colors.danger },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inkMuted}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label ?? placeholder}
          style={[styles.inputText, multiline && { height: "100%" }]}
        />
        {suffix ? (
          <Text variant="bodySm" color={colors.inkMuted} style={{ fontFamily: fonts.bodySemi }}>
            {suffix}
          </Text>
        ) : null}
      </View>
      <FieldError message={error} />
    </View>
  );
}

export interface Option<T extends string> {
  value: T;
  label: string;
  group?: string;
}

/** A tap-to-open picker presented as a bottom sheet — the native-feeling stand-in for the website's Select. */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = "Select…",
  error,
  optional,
}: {
  label?: string;
  value: T | "" | undefined;
  options: Option<T>[];
  onChange: (v: T) => void;
  placeholder?: string;
  error?: string;
  optional?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      {label ? <FieldLabel optional={optional}>{label}</FieldLabel> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label ?? "Select"}: ${selected?.label ?? "not selected"}`}
        onPress={() => setOpen(true)}
        style={[styles.input, !!error && { borderColor: colors.danger }]}
      >
        <Text variant="bodyMd" color={selected ? colors.inkPrimary : colors.inkMuted} style={{ flex: 1 }} numberOfLines={1}>
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={18} color={colors.inkMuted} />
      </Pressable>
      <FieldError message={error} />

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)} statusBarTranslucent navigationBarTranslucent>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + space.md }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text variant="headingLg" color={palette.navy800}>
              {label ?? "Select"}
            </Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={12} accessibilityLabel="Close">
              <X size={22} color={colors.inkSecondary} />
            </Pressable>
          </View>
          <FlatList
            data={options}
            keyExtractor={(o) => o.value}
            renderItem={({ item, index }) => {
              const showGroup = item.group && item.group !== options[index - 1]?.group;
              const isSelected = item.value === value;
              return (
                <View>
                  {showGroup ? (
                    <Text variant="label" color={colors.inkMuted} style={styles.sheetGroup}>
                      {item.group}
                    </Text>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [styles.sheetRow, pressed && { backgroundColor: palette.cream100 }]}
                  >
                    <Text variant="bodyMd" style={{ flex: 1, fontFamily: isSelected ? fonts.bodySemi : fonts.body }}>
                      {item.label}
                    </Text>
                    {isSelected ? <Check size={18} color={colors.accent} /> : null}
                  </Pressable>
                </View>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

/** Segmented control — e.g. Buy / Rent, Grey Structure / Turnkey. */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  dark,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  dark?: boolean;
}) {
  return (
    <View style={[styles.segment, dark && { backgroundColor: "rgba(255,255,255,0.12)" }]} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[styles.segmentItem, active && (dark ? styles.segmentActiveDark : styles.segmentActive)]}
          >
            <Text
              variant="bodySm"
              style={{ fontFamily: fonts.bodySemi, textAlign: "center" }}
              color={active ? (dark ? palette.navy900 : palette.navy800) : dark ? palette.navy100 : colors.inkSecondary}
              numberOfLines={1}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={({ pressed }) => [styles.checkRow, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxOn]}>{checked ? <Check size={14} color={palette.paper} strokeWidth={3} /> : null}</View>
      <Text variant="bodyMd" style={{ flex: 1 }}>
        {label}
      </Text>
    </Pressable>
  );
}

/** − value + stepper for small integers (storeys, beds, years). */
export function Stepper({ label, value, onChange, min = 0, max = 99, suffix }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string }) {
  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <View style={styles.stepper}>
        <Pressable accessibilityLabel={`Decrease ${label}`} onPress={() => onChange(Math.max(min, value - 1))} style={styles.stepBtn} hitSlop={6}>
          <Text variant="headingMd" color={colors.accentStrong}>
            −
          </Text>
        </Pressable>
        <Text variant="price" style={{ minWidth: 70, textAlign: "center" }} accessibilityLiveRegion="polite">
          {value}
          {suffix ? ` ${suffix}` : ""}
        </Text>
        <Pressable accessibilityLabel={`Increase ${label}`} onPress={() => onChange(Math.min(max, value + 1))} style={styles.stepBtn} hitSlop={6}>
          <Text variant="headingMd" color={colors.accentStrong}>
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Parses a free-typed number ("2,50,000" → 250000). Returns undefined when empty/invalid. */
export function parseNumber(text: string): number | undefined {
  const cleaned = text.replace(/[^\d.]/g, "");
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

const styles = StyleSheet.create({
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    backgroundColor: palette.paper,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputText: { flex: 1, fontFamily: fonts.body, fontSize: 15.5, color: colors.inkPrimary, paddingVertical: 10 },
  backdrop: { flex: 1, backgroundColor: "rgba(8,15,36,0.5)" },
  sheet: {
    backgroundColor: palette.paper,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    maxHeight: "75%",
  },
  sheetHandle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderHairline, marginTop: 10 },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.xl, paddingVertical: space.lg },
  sheetGroup: { paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: 6 },
  sheetRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: space.xl, paddingVertical: 15 },
  segment: { flexDirection: "row", backgroundColor: palette.cream200, borderRadius: radius.pill, padding: 4 },
  segmentItem: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, borderRadius: radius.pill },
  segmentActive: { backgroundColor: palette.paper, shadowColor: palette.navy800, shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  segmentActiveDark: { backgroundColor: palette.paper },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  checkboxOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    height: 50,
    paddingHorizontal: 6,
    backgroundColor: palette.paper,
  },
  stepBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.iris50, alignItems: "center", justifyContent: "center" },
});
