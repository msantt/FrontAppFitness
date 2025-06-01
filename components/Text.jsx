import { Text } from 'react-native';

export default function TextComponent({ children, style, ...props }) {
    return (
            <Text style={[defaultStyle, style]} {...props}>{children}</Text>
    );
}

const defaultStyle = {
    fontFamily: 'Rightous-Regular',
    color: '#FFFFFF',
    fontSize: 22,
    textAlign: "center",
}
