declare module "*.png"

type ButtonPropsIndex = {
    title: string;
    handlePress: ((event: GestureResponderEvent) => void) | undefined
    styles: {
        container: {}
        text: {}
    }
}