import { TextInput, TextInputProps } from "@mantine/core";

export default function CustomTextInput({ ...rest }: TextInputProps) {
  return (
    <TextInput
      {...rest}
      variant="unstyled"
      classNames={{
        label: "text-contrast",
        unstyledVariant:
          "bg-darklight p-2 focus:bg-modalbg placeholder:text-slate-500 sm:text-lg font-light focus:ring-indigo-400 focus:ring-2 text-white pl-6 px-2 h-10 transition-all rounded-lg hover:ring-1 ring-darksquare",
      }}
    />
  );
}
