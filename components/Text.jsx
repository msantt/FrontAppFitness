import { Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function TextComponent({ children, style, ...props }) {
    return (
        <Text
            style={[defaultStyle, { maxWidth: width * 0.9 }, style]}
            {...props}
        >
            {children}
        </Text>
    );
}

const defaultStyle = {
    fontFamily: 'Rightous-Regular',
    color: '#FFFFFF',
    fontSize: 22,
    textAlign: "center",
};
