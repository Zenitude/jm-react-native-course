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
    page: string
}

type EmptyStateProps = {
    title: string;
    subtitle: string;
    button?: boolean;
}

type UserType = {
    username: string;
    email: string;
    avatar: string;
    accountId: string;
    role: string;
}

type VideoType = {
    title: string;
    thumbnail: ImageSourcePropType;
    prompt: string;
    video: AVPlaybackSource;
    creator: string;
    bookmarks: string[];
    likes: string[];
}

type FileType = {
    filename: string;
    type: string;
    size: string;
}