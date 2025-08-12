import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';

export const globalStyles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: COLORS.background.app },
  centeredContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background.app },
  scrollContainer: { paddingBottom: 24 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text.primary },
  subtitle: { fontSize: 16, fontWeight: '600', color: COLORS.text.secondary },
  body: { fontSize: 15, color: COLORS.text.primary },
  caption: { fontSize: 13, color: COLORS.text.tertiary },
  label: { fontSize: 14, color: COLORS.text.secondary, marginBottom: 6 },
  input: { height: 46, paddingHorizontal: 12, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background.primary },
  textArea: { minHeight: 100, paddingHorizontal: 12, paddingVertical: 12, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background.primary },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, marginTop: 6 },
  buttonSecondary: { height: 44, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.background.primary },
  buttonTextSecondary: { color: COLORS.text.primary, fontWeight: '600' },
});
