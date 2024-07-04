import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  statusbarGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100, // Adjust the height based on your needs
    zIndex: 4,
    pointerEvents: 'none',
  },
  backgroundImage: {
    flex: 1, // Ensure it covers the whole screen
    width: '100%', // Ensure width is 100%
    height: '100%', // Ensure height is 100%
  },
  safeAreaView: {
    overflow: 'visible',
    flex: 1,
    backgroundColor: 'transparent', // Make sure container is transparent to show the background image
  },
  borderContainer: {
    flex: 1,
    overflow: 'hidden', // Ensures that the border does not extend beyond the blur area
    borderRadius: 23, // Match the BlurView's borderRadius
  },
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
});