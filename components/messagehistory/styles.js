import { StyleSheet } from 'react-native';

const localStyles = StyleSheet.create({
    messageHistory: {
        overflow: 'visible',
    },
    messageHistoryFlatlist: {
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
    applicationMessageContainer: {
        marginBottom: -1,
        marginTop: 4,
        paddingLeft: 9,
        marginLeft: 9,
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
        backgroundColor: 'rgba(120, 80, 255, 0)',
    },
    noiseTexture: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.13, // Adjust opacity to get the desired effect
        transform: [{ scale: 1 }],
        zIndex: 0, // Ensure it is above the BlurView but below the content
        pointerEvents: 'none',
    },
    userName: {
        color: 'rgba(140, 115, 255, 0.35)',
        fontSize: 16,
    },
});
const markdownStyles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: '#fff',
    },
    body: {
        color: '#fff', // Ensuring body text is white
        fontSize: 16, // Ensuring font size is consistent
    },
    code_inline: {
        backgroundColor: 'rgba(0,0,0, 0.15)',
    },
});

const markdownLogStyles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: 'rgba(140, 115, 255, 0.35)',
    }
});
export { localStyles, markdownStyles, markdownLogStyles };