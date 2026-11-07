import { Alert, Linking, Platform, Share } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { CONTACT } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WEB_BASE_URL } from "@/lib/api";
import { palette } from "@/theme";

async function openExternal(url: string, fallbackMessage: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Couldn't open", fallbackMessage);
  }
}

export function openWhatsApp(message: string) {
  return openExternal(buildWhatsAppLink(message), `Message us on WhatsApp at ${CONTACT.mobileIntl}.`);
}

export function callNumber(number: string = CONTACT.mobileIntl) {
  return openExternal(`tel:${number.replace(/[^\d+]/g, "")}`, `Call us at ${number}.`);
}

export function callOffice() {
  return callNumber(CONTACT.phone);
}

export function sendEmail(address: string) {
  return openExternal(`mailto:${address}`, `Email us at ${address}.`);
}

/** Opens a page in an in-app browser tab styled with the brand colours. */
export function openInApp(url: string) {
  return WebBrowser.openBrowserAsync(url, {
    toolbarColor: palette.navy900,
    controlsColor: palette.iris300,
    enableBarCollapsing: true,
  }).catch(() => openExternal(url, url));
}

export function openWebPath(path: string) {
  return openInApp(`${WEB_BASE_URL}${path}`);
}

export function openSocial(url: string) {
  return openExternal(url, url);
}

export function openMaps(lat: number, lng: number, label: string) {
  const encoded = encodeURIComponent(label);
  const url = Platform.select({
    android: `geo:${lat},${lng}?q=${lat},${lng}(${encoded})`,
    ios: `maps:0,0?q=${encoded}@${lat},${lng}`,
    default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  })!;
  return Linking.openURL(url).catch(() =>
    openExternal(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, label),
  );
}

export function shareLink(title: string, path: string) {
  const url = `${WEB_BASE_URL}${path}`;
  return Share.share({ title, message: `${title}\n${url}`, url }).catch(() => undefined);
}
