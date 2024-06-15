type FormType = {
    username?: string;
    email: string;
    password: string;
    confirm?: string;
}
  
type FormFieldProps = {
    title: string;
    value: string;
    placeholder : string;
    keyboard: KeyboardTypeOptions;
    setter: React.Dispatch<React.SetStateAction<FormType>>
}

type SearchInputProps = {
    initialQuery?: string;
    refetch?: () => Promise<void>
}