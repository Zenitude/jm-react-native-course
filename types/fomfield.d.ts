type SignType = {
    username?: string;
    email: string;
    role?: string;
    password: string;
    confirm?: string;
}

type CreateVideoType = {
    title: string;
    video: AVPlaybackSource | null;
    thumbnail: ImageSourcePropType | null,
    prompt: string;
    userId: string;
    marks: string[];
    addLikes: string[];
}

type FormFieldSetter = SignType | CreateVideoType;

type FormFieldProps = {
    title: string;
    value: string;
    placeholder : string;
    keyboard: KeyboardTypeOptions;
    setter: React.Dispatch<React.SetStateAction<FormFieldSetter>>
}

type SearchInputProps = {
    initialQuery?: string;
    refetch?: () => Promise<void>
}

type AssetType = { 
    name: string; 
    type: string; 
    size: number; 
    uri: string;
}