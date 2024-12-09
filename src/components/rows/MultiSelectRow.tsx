import React, {useState} from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const items = [
    {
        name: 'Fruits',
        id: 0,
        children: [
            {name: 'Apple', id: 10},
            {name: 'Strawberry', id: 17},
            {name: 'Pineapple', id: 13},
            {name: 'Banana', id: 14},
            {name: 'Watermelon', id: 15},
            {name: 'Kiwi fruit', id: 16},
        ],
    },
    {
        name: 'Vegetables',
        id: 1,
        children: [
            {name: 'Carrot', id: 20},
            {name: 'Broccoli', id: 21},
            {name: 'Peas', id: 22},
        ],
    },
];

const MultiSelectRow = () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const onSelectedItemsChange = (selectedItems: string[]) => {
        setSelectedItems(selectedItems);
    };

    return (
        <View>
            <Text>MultiSelectRow</Text>
            {/* <SectionedMultiSelect
                items={items}
                IconRenderer={Icon}
                uniqueKey="id"
                subKey="children"
                selectText="Choose some things..."
                showDropDowns={true}
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selectedItems}
            /> */}
        </View>
    );
};

export default MultiSelectRow;
