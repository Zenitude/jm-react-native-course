import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import SelectDropdown from "react-native-select-dropdown";
import { colors, icons } from "../constants";

type SelectFieldProps = {
    data : {title: string}[];
    setter: React.Dispatch<React.SetStateAction<FormFieldSetter>>
}

export default function SelectField({data, setter}: SelectFieldProps) {

    const selectChoice = (selectedItem: {title: string}, index: number) => {
        setter((prev) => {
            const previous = {...prev};
            (previous as SignType).role = selectedItem.title;
            return previous;
        })
    }

    return (
        <>
            <Text style={styles.label}>Role</Text>
            <SelectDropdown
                data={data}
                onSelect={selectChoice}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                                {(selectedItem && selectedItem.title) || 'Select role'}
                            </Text>
                            <Image 
                                source={isOpened ? icons.chevronUp : icons.chevronDown} 
                                resizeMode="contain"
                                style={styles.dropdownButtonArrowStyle} 
                            />
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                return (
                    <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: colors.white})}}>
                    <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                );
                }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
                defaultValue={"member"}
            />
        </>
    )
}

const styles = StyleSheet.create({
    label: {
        color: colors.white,
        marginBottom: 10
    },
    dropdownButtonStyle: {
        width: '100%',
        minWidth: 280,
        height: 45,
        backgroundColor: colors.primary,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderColor: colors.grey[100],
        borderWidth: 1
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: colors.grey[100],
    },
    dropdownButtonArrowStyle: {
        width: 25,
        height: 25
    },
    dropdownButtonIconStyle: {
        width: 25,
        height: 25,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.grey[100]
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: colors.grey[100],
        borderTopWidth: 2,
        borderTopColor: colors.grey[100]
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: colors.white,
    },
    dropdownItemIconStyle: {
        width: 25,
        height: 25,
        marginRight: 8,
    },
  });