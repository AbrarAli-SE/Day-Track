import { TextStyle } from 'react-native';

const fontFamily = {
  light: 'YaldeviColombo-Light',
  regular: 'YaldeviColombo-Regular',
  semiBold: 'YaldeviColombo-SemiBold',
  bold: 'YaldeviColombo-Bold',
} as const;

export const typography = {
  // Headings
  heading1: {
    fontSize: 48,
    fontWeight: '800',
    fontFamily: fontFamily.bold,
  } as TextStyle,

  heading2: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    fontStyle: 'normal',
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    fontStyle: 'normal',
  } as TextStyle,

  bodyMedium: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    fontStyle: 'normal',
  } as TextStyle,

  bodySmall: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fontFamily.light,
    fontStyle: 'normal',
  } as TextStyle,

  // Card text
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    fontStyle: 'normal',
    textAlign: 'center',
  } as TextStyle,

  cardAmount: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    fontStyle: 'normal',
    textAlign: 'center',
  } as TextStyle,

  // Stats text
  statsAmount: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    fontStyle: 'normal',
  } as TextStyle,

  statsLabel: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    fontStyle: 'normal',
  } as TextStyle,

  // Transaction text
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
  } as TextStyle,

  transactionSubtitle: {
    fontSize: 12,
    fontWeight: 'normal',
  } as TextStyle,

  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  } as TextStyle,

  // Action text
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    fontStyle: 'normal',
  } as TextStyle,
} as const;

export default typography;