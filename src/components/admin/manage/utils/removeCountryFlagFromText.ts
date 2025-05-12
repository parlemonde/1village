export default function removeCountryFlagFromText(text: string) {
  return text.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '');
}
