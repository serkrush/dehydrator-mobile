import React, {useMemo} from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {ViewProps} from './UpdatedHeader';

export enum ContextMenuPosition {
    TopLeft,
    TopRight,
}

interface IContextMenu {
    isVisible: boolean;
    handleClose: () => void;
    actions?: ViewProps[];
    displayPosition?: ContextMenuPosition;
}

export default function ContextMenu({
    isVisible,
    handleClose,
    actions,
    displayPosition = ContextMenuPosition.TopRight,
}: IContextMenu) {
    const position = useMemo(() => {
        if (displayPosition === ContextMenuPosition.TopLeft) {
            return {top: 10, left: 10};
        } else if (displayPosition === ContextMenuPosition.TopRight) {
            return {top: 10, right: 10};
        }
    }, [displayPosition]);

    return (
        <View style={styles.container}>
            <Modal
                transparent
                visible={isVisible}
                animationType="none"
                onRequestClose={handleClose}>
                <TouchableOpacity style={styles.overlay} onPress={handleClose}>
                    <View style={[styles.menu, position]}>
                        <ScrollView
                            nestedScrollEnabled // Allows nested scrolls
                        >
                            {actions.map(({type, value}: any, index) => {
                                const divide =
                                    actions.length - 1 === index
                                        ? {}
                                        : {
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#E5E5E5',
                                        };
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            handleClose();
                                            if (value?.onPress) {
                                                value?.onPress();
                                            }
                                        }}
                                        style={[styles.menuItem, divide]}>
                                        {value?.source && (
                                            <Image
                                                source={value.source}
                                                style={{
                                                    width:
                                                        value?.imageWidth ?? 24,
                                                    height:
                                                        value?.imageHeight ??
                                                        24,
                                                }}
                                            />
                                        )}
                                        <Text style={styles.menuText}>
                                            {value?.text ?? 'Action'}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menu: {
        position: 'absolute',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 4,
        width: '60%',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    menuText: {
        width: '80%',
        color: 'black',
        marginLeft: 8,
        fontSize: 16,
    },
});
