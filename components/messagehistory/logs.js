import React from 'react';
import {View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import MarkdownIt from 'markdown-it';

import { localStyles, markdownLogStyles } from './styles';

const Logs = ({item}) => (
    <View style={localStyles.applicationMessageContainer}>
    <Markdown style={markdownLogStyles}
        markdownit={
            MarkdownIt({ typographer: true }).disable(['list']) // list styling was breaking, so I disabled it for now
        }
    >
        {item.text ? item.text : ''}
    </Markdown>
</View>
);

export default Logs;