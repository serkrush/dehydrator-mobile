import React, {useRef, useState} from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    LayoutChangeEvent,
} from 'react-native';
import {colors} from 'src/theme';
import {images} from 'src/theme/images';

interface CollapsibleProps {
    title: string;
    content: React.ReactNode;
    isWork?: boolean;
}

export default function Accordion({
    title,
    content,
    isWork = true,
}: CollapsibleProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const [contentHeight, setContentHeight] = useState(0);

    const onContentLayout = (event: LayoutChangeEvent) => {
        const {height} = event.nativeEvent.layout;
        setContentHeight(height);
    };

    const toggleExpand = () => {
        if (!isWork) return;
        const finalHeight = isExpanded ? 0 : contentHeight;

        Animated.timing(animatedHeight, {
            toValue: finalHeight,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsExpanded(!isExpanded);
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleExpand} style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
                <Image
                    source={
                        isExpanded
                            ? images.arrows.chevronUp
                            : images.arrows.chevronDown
                    }
                    tintColor={'#1A1A1A80'}
                    style={styles.icon}
                />
            </TouchableOpacity>

            <Animated.View
                style={[styles.collapsibleContent, {height: animatedHeight}]}>
                <View
                    onLayout={onContentLayout}
                    style={styles.contentContainer}>
                    {content}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.checkboxText,
    },
    icon: {
        width: 12,
        height: 16,
        resizeMode: 'contain',
    },
    collapsibleContent: {
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    contentContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
});
