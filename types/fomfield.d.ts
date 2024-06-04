type FormType = {
    username?: string;
    email: string;
    password: string;
    confirm?: string;
}
  
type FormFieldType = {
    title: string;
    value: string;
    placeholder : string;
    keyboard: KeyboardTypeOptions;
    setter: React.Dispatch<React.SetStateAction<FormType>>
}