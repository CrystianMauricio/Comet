import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  border: {
    borderColor: 'rgba(255, 170, 170, 0.125)', // Adjusted to reddish tone
  },
  borderBlur: {
    borderColor: 'rgba(170, 170, 255, 0.125)',
    outlineWidth: 10,
  },
  borderFront: {
    borderColor: 'rgba(255, 80, 120, 0.2)', // Adjusted to reddish tone
  },
  todoIndexText: {
    color: 'rgba(255, 150, 180, 0.6)', // Adjusted to reddish tone
  },
  todoItemBarTop: {
    backgroundColor: 'rgba(235,245,255,0.9)',
  },
  todoItemTop: {
    padding: 12,
    //    backgroundColor: 'rgba(160, 115, 110, 1)', // looks oddly good even tho not intended
  },
  checkbox: {
    borderColor: 'rgba(255, 180, 180, 0.2)', // Adjusted to reddish tone
  },
  checkboxTop: {
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(160, 115, 110, 1)',
  },
  todoText: {
    color: '#fff',
  },
  todoTextTop: {
    color: '#2a1414',
    textShadowColor: 'rgba(225, 235, 255, 1)',
    textShadowRadius: 5,
  },
  borderTodo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    borderColor: 'rgba(255, 180, 180, 0.2)', // Adjusted to reddish tone
  },
  borderTodoBlur: {
    borderWidth: 6,
    borderColor: 'rgba(255, 170, 200, 0.1)', // Adjusted to reddish tone
  },
  borderTodoTopBlur: {
    borderWidth: 9, // Thicker border for the top item
    borderLeftWidth: 9.5,
    borderRightWidth: 10,
    borderBottomWidth: 12,
    borderColor: 'rgba(255, 120, 200, 1)', // Adjusted to reddish tone
  },
  borderTodoFront: {
    borderWidth: 1.25,
    zIndex: 1,
    borderColor: 'rgba(255, 80, 120, 0.2)', // Adjusted to reddish tone
  },
  borderTodoTopFront: {
    borderWidth: 1.75, // Thicker front border for the top item
    borderColor: 'rgba(255, 235, 235, 0.125)', // Adjusted to reddish tone
  },
  verticalDashedLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    borderLeftColor: '#fff',
    borderLeftWidth: 10,
    borderStyle: 'dashed',
  },
  textFieldContainer: {
    flex: 1,
    shadowColor: 'rgba(60, 0, 15, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6, // for Android
  },
  textInput: {
    flex: 1, // Take up all space except for the button
    height: 40,
    padding: 10,
    paddingBottom: 11,
    color: '#fff',
    paddingLeft: 17,
    paddingRight: 17, // 42 to accommodate the microphone button
    fontSize: 17,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 10,
  },
  textInputBlurView: {
    elevation: 6, // for Android
    flex: 1,
    flexDirection: 'row', // Align TextInput and Button in a row
    alignItems: 'center',
    borderRadius: 23,
    overflow: 'hidden',
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  textInputBorderBlur: {
    height: 40,
    position: 'absolute',
    borderRadius: 23,
    borderWidth: 1.5,
  },
  textInputBorderFront: {
    height: 40,
    position: 'absolute',
    borderRadius: 23,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 80, 120, 0.2)', // Adjusted to reddish tone
    pointerEvents: 'none',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 80, 120, 0)',
    borderRadius: 23,
  },
  sendButtonBlurView: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 80, 120, 0)',
    marginLeft: 6,
    borderRadius: 23,
    overflow: 'hidden',
  },
  sendButtonBorderFront: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 80, 120, 0.2)', // Adjusted to reddish tone
    borderRadius: 23,
    pointerEvents: 'none',
  },
  sendButtonIcon: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 23,
    right: -5,
    top: -8,
    pointerEvents: 'none',
  },
  microphoneButton: {
    visibility: 'hidden',
    position: 'absolute',
    width: 38,
    height: 38,
    right: 4,
    top: -6,
    zIndex: 5,
  },
  microphoneButtonIcon: {
    opacity: 0, // nonvisible for now, since this feature does not work
    position: 'absolute',
    width: 37,
    height: 37,
    right: 5,
    top: -5,
    zIndex: 5,
    tintColor: 'rgba(90, 52, 55, 1)',
  },
  chatBarControls: {
    position: 'absolute', // Position the container absolutely
    bottom: 306,
    flexDirection: 'row', // Align children in a row
    alignItems: 'center', // Center children vertically
    marginHorizontal: 16,
  },
  messageHistory: {
    overflow: 'visible',
  },
  messageHistoryFlatlist: {
    height: '56.4%',
    overflow: 'visible',
  },
  messageHistoryContent: {
    padding: 16,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start', // Aligns the list to the top left
    marginHorizontal: 0,
    width: '100%',
  },
  messageContainer: {
    padding: 0.5,
    paddingHorizontal: 17.5,
    paddingBottom: 2.5,
    borderRadius: 24,
    marginBottom: -6,
    maxWidth: '80%', // Limit the max width to 80% of the screen width
    alignSelf: 'flex-start', // Default alignment for comet messages
    backgroundColor: 'rgba(205, 225, 255, 0.18)',
    overflow: 'hidden',
  },
  messageContainerWaiting: {
    padding: 0,
    paddingHorizontal: 5,
    borderRadius: 24,
    marginBottom: -6,
    maxWidth: '80%', // Limit the max width to 80% of the screen width
    alignSelf: 'flex-start', // Default alignment for comet messages
    backgroundColor: 'rgba(205, 225, 255, 0.18)',
    overflow: 'hidden',
  },
  messageBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: '#c0ccff44',
    borderWidth: 1.5,
    borderRadius: 24,
    marginBottom: 0,
    overflow: 'hidden',
  },
  messageContainerUser: {
    alignSelf: 'flex-end', // Align user messages to the right
    backgroundColor: 'rgba(255, 80, 120, 0)',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Rubik_600Regular',
  },
  messageTextUser: {
    textAlign: 'left',
    alignSelf: 'right', // Align user messages to the right
    color: 'rgba(215, 245, 255, 0.8)',
  },
  stripeAnimation: {
    position: 'absolute',
    top: 0,
    left: -100,
    right: 0,
    bottom: 0,
    width: '240%',
    height: '240%',
    opacity: 0.14,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 130,
  },
  welcomeStateTitle: {
    color: 'rgba(255, 150, 180, 0.6)', // Adjusted to reddish tone
    fontSize: 30,
    fontFamily: 'Rubik_700Bold',
    marginBottom: 6,
  },
  welcomeStateText: {
    color: 'rgba(255, 150, 180, 0.6)', // Adjusted to reddish tone
    fontSize: 17,
    fontFamily: 'Rubik_400Light',
  }
});