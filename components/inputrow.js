import React, { useState, useRef, useEffect } from 'react';
import { ImageBackground, Dimensions, View, TextInput, Pressable, Image, StyleSheet, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';

const screenHeight = Dimensions.get('window').height;

export default function InputRow({ onSendMessage, message, setMessage, flatListRef }) {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
                setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 5);
            }
        );

        const keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    return (
        <View style={[localStyles.chatBarControls, { bottom: Math.max(keyboardHeight + 13, (screenHeight * 0.336) + 18) }]}>
            <View style={localStyles.textFieldContainer}>
                <BlurView
                    style={localStyles.textInputBlurView}
                    tint="dark"
                    intensity={40}
                >
                    <View style={localStyles.inputRow}>
                        <TextInput
                            style={localStyles.textInput}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Message @Comet..."
                            placeholderTextColor="#aa88dd99"
                            keyboardAppearance="dark"
                            keyboardType="twitter"
                        />
                    </View>
                </BlurView>
                <Pressable style={localStyles.microphoneButton}
                    onPress={() => {
                        console.log('Microphone button pressed');
                    }}
                ></Pressable>
                <Image
                    source={require('../assets/fluentui-emoji/assets/Studio microphone/3D/studio_microphone_3d.png')}
                    style={localStyles.microphoneButtonIcon}
                />
                <View style={localStyles.textInputBorderFront} />
            </View>
            <BlurView
                style={localStyles.sendButtonBlurView}
                tint="dark"
                intensity={60}
            >
                <ImageBackground
                    source={require('../assets/white_noise_transparent.png')}
                    style={[localStyles.noiseTexture, { opacity: 0.23 }]}
                    resizeMode="repeat"
                />
                <Pressable
                    title="Send"
                    onPress={onSendMessage}
                    color="#5e5ce6"
                    style={localStyles.sendButton}
                />
                <View style={localStyles.sendButtonBorderFront} />
            </BlurView>
            <Image
                source={require('../assets/lukalot_httpss.mj.runKUFdzRsB9JE_White_paper_airplane_emoji_Ico_e5396e54-54e9-4ae7-9c87-6a6b029515c5-removebg-preview.png')}
                style={localStyles.sendButtonIcon}
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    chatBarControls: {
        position: 'absolute', // Position the container absolutely
        flexDirection: 'row', // Align children in a row
        alignItems: 'center', // Center children vertically
        marginHorizontal: 16,
    },
    textFieldContainer: {
        flex: 1,
        shadowColor: 'rgba(15, 0, 60, 0.4)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 6, // for Android
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
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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
        tintColor: 'rgba(55, 52, 90, 1)',
    },
    sendButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(120, 80, 255, 0)',
        borderRadius: 23,
    },
    sendButtonBlurView: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(120, 80, 255, 0)',
        marginLeft: 6,
        borderRadius: 23,
        overflow: 'hidden',
    },
    sendButtonBorderFront: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderWidth: 1.5,
        borderColor: 'rgba(120, 80, 255, 0.2)',
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
        borderColor: 'rgba(120, 80, 255, 0.2)',
        pointerEvents: 'none',
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
});