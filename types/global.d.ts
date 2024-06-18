declare module "*.png"

type ButtonPropsIndex = {
    title: string;
    handlePress: ((event: GestureResponderEvent) => void) | undefined
    styles: {
        container: {}
        text: {}
    },
    loading?: boolean;
}

type InfoBoxProps = {
    title: string | number;
    subtitle?: string;
}