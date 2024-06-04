import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

export default function CustomButton({title, handlePress, styles, loading}: ButtonPropsIndex) {
    return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.container}
    >
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}