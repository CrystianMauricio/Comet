import React from 'react';
import { View, ImageBackground, Image } from 'react-native';
import { BlurView } from 'expo-blur';

import { localStyles } from './styles';

const Loader = ({ }) => (

    <BlurView style={[localStyles.messageContainerWaiting]} intensity={14} tint="light">
        <ImageBackground
            source={require('../../assets/white_noise_transparent.png')}
            style={[localStyles.noiseTexture, { opacity: 0.16, scale: 1.25, width: '110%' }]}
            resizeMode="repeat"
        />
        <Image
            source={require('../../assets/system-regular-716-spinner-three-dots.gif')}
            style={{ marginTop: 9, marginBottom: 7, marginHorizontal: 14.5, height: 18, width: 18, zIndex: 120 }}
        />
        <View style={localStyles.messageBorder} />
    </BlurView>
);

export default Loader;