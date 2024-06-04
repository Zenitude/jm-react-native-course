type FormType = {
    email: string;
    password: string;
}
  
type FormFieldType = {
    title: string;
    value: string;
    placeholder : string;
    keyboard: KeyboardTypeOptions;
    setter: [
        FormType,
        React.Dispatch<React.SetStateAction<FormType>>
    ]
}