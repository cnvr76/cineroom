import type {
  Path,
  FieldValues,
  UseFormRegister,
  FieldError,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  type?: string;
  placeholder: string;
  name: Path<T>;
  textArea?: boolean;
  register: UseFormRegister<T>;
  error?: FieldError;
}

const FormInputField = <T extends FieldValues>({
  type = "text",
  placeholder,
  name,
  register,
  error,
}: FormInputProps<T>) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        required
        {...register(name)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
      />
      {error && <span className="text-red-400 text-sm">{error.message}</span>}
    </>
  );
};

export default FormInputField;
