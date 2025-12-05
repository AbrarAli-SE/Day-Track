import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const onboardingStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingTop: 48,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },

  innerContainer: {
    paddingHorizontal: 24,
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  // Back Button
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Icons
  icon: {
    width: 240,
    height: 240,
    marginTop: 100,
    alignSelf: 'center',
  },

  iconBlur: {
    position: 'absolute',
    width: 320,
    height: 320,
    opacity: 0.6,
  },

  // Background Stroke
  strokeContainer: {
    position: 'absolute',
    width: width,
    height: '100%',
    overflow: 'hidden',
  },

  backgroundStroke: {
    position: 'absolute',
    width: 1540,
    marginTop: 100,
    height: 350,
    opacity: 0.8,
  },

  // Text Content
  textContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 42,
    fontWeight: '600',
    fontStyle: 'normal',
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'YaldeviColombo-SemiBold',
    lineHeight: 52,
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    fontStyle: 'normal',
    color: 'rgba(0, 0, 0, 0.65)',
    textAlign: 'center',
    fontFamily: 'YaldeviColombo-Light',
    lineHeight: 24,
    paddingHorizontal: 8,
  },

  // Progress Dots - FIXED POSITION
  dotsWrapper: {
    position: 'absolute',
    bottom: 140, // Fixed distance from bottom
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 12,
  },

  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5, // Half of width/height = perfect circle
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },

  progressDotActive: {
    backgroundColor: 'transparent',
  },

  progressDotIndicator: {
    position: 'absolute',
    left: 0,
    width: 10,
    height: 10,
    borderRadius: 5, // Half of width/height = perfect circle
    backgroundColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Bottom Row
  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 48,
  },

  bottomRowEnd: {
    justifyContent: 'flex-end',
  },

  // Skip Button
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  skipText: {
    color: 'rgba(0, 0, 0, 0.60)',
    fontSize: 16,
    fontFamily: 'YaldeviColombo-Medium',
    fontWeight: '500',
  },

  // Next Button
  nextButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
  },

  nextText: {
    fontSize: 17,
    color: '#000000',
    fontFamily: 'YaldeviColombo-SemiBold',
    fontWeight: '600',
  },
});
export default onboardingStyles;