declare module "*.png"

type ButtonPropsIndex = {
    title: string;
    handlePress: ((event: GestureResponderEvent) => void) | undefined
    loading?: boolean;
}

type InfoBoxProps = {
    title: string | number;
    subtitle?: string;
}

type VideoCardProps = {
    video: Models.Document
}

type EmptyStateProps = {
    title: string;
    subtitle: string;
    button?: boolean;
}