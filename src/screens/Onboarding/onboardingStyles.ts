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
    paddingHorizontal: 32,
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    width: 220,
    height: 220,
    marginTop: 84,
    alignSelf: 'center',
  },
  iconBlur: {
    position: 'absolute',
    width: 300,
    height: 300,
  },
  strokeContainer: {
    position: 'absolute',
    width: width,
    height: '100%',
    overflow: 'hidden',
  },
  backgroundStroke: {
    position: 'absolute',
    width: 1540,
    marginTop: 84,
    height: 350,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 72,
    height: 180,
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    fontStyle: 'normal',
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'YaldeviColombo-SemiBold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300',
    fontStyle: 'normal',
    color: 'rgba(129, 129, 129, 0.70)',
    textAlign: 'center',
    fontFamily: 'yaldeviColombo-Light',
  },
  dotsWrapper: {
    marginTop: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 12,
    position: 'relative',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDotInactive: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '#F7FEFF',
  },
  progressDotActive: {
    position: 'absolute',
    left: 0,
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '#000000',
    zIndex: 10,
    elevation: 3,
  },
  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 42,
  },
  bottomRowEnd: {
    justifyContent: 'flex-end',
  },
  skip: {
    color: 'rgba(129, 129, 129, 0.70)',
    fontSize: 18,
    fontFamily: 'yaldeviColombo-Light',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  nextText: {
    fontSize: 20,
    color: '#232323',
    marginRight: 8,
    fontFamily: 'YaldeviColombo-SemiBold',
  },
  nextArrow: {
    fontSize: 32,
    color: '#232323',
    alignSelf: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIconImage: {
    width: 8,
    height: 12,
    alignSelf: 'center',
  },
});

export default onboardingStyles;