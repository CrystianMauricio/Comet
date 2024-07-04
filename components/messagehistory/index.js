import React, { useState, useEffect } from 'react';
import { Keyboard, FlatList, View, Dimensions } from 'react-native';
import supabase from '../../utils/supabase';

import MessageText from './messageText';
import Logs from './logs';
import Loader from "./loader";
import { localStyles, markdownLogStyles, markdownStyles } from './styles';

const screenHeight = Dimensions.get('window').height;

export default function MessageHistory({ messageHistory, flatListRef, user }) {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            (e) => setKeyboardHeight(e.endCoordinates.height)
        );

        const keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            () => setKeyboardHeight(0)
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    return (
        <View style={localStyles.messageHistory}>
            <FlatList
                ref={flatListRef}
                style={[localStyles.messageHistoryFlatlist, { height: Math.min(screenHeight * 0.51, screenHeight - keyboardHeight - 125) }]}
                data={messageHistory}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    if (item.type === 'log') {
                        return (
                            <Logs item={item} />
                        );
                    } else if (item.loading) {
                        return (
                            <Loader />
                        );
                    } else if (item.text) {
                        return (
                            <MessageText item={item} />
                        );
                    }
                }}
                contentContainerStyle={localStyles.messageHistoryContent}
                onContentSizeChange={() => setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 5)}
            />
        </View>
    );
};
