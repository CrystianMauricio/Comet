import React from 'react';
import { ImageBackground, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Markdown from 'react-native-markdown-display';
import MarkdownIt from 'markdown-it';

import { localStyles, markdownStyles } from './styles';

const messageText = ({item}) => (
    <BlurView
        style={[localStyles.messageContainer, item.sender === 'user' ? localStyles.messageContainerUser : {}]}
        intensity={item.sender === 'user' ? 29 : 10}
        tint={item.sender === 'user' ? 'dark' : 'light'} >
        <ImageBackground
            source={require('../../assets/white_noise_transparent.png')}
            style={[localStyles.noiseTexture, { opacity: 0.16, scale: 1.25, width: '110%' }]}
            resizeMode="repeat"
        />
        <Markdown
            style={markdownStyles}
            markdownit={
                MarkdownIt({ typographer: true }).disable(['list']) // list styling was breaking, so I disabled it for now
            }
        >
            {item.text ? item.text : ''}
        </Markdown>

        <View style={localStyles.messageBorder} />
    </BlurView >
);

export default messageText;