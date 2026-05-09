import { useForm } from "react-hook-form";
import FormInputField from "../shared/FormInputField";
import {
  type SignupFormData,
  signupSchema,
} from "../../services/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import useAsyncCall from "../../hooks/useAsyncCall";
import type { IUser } from "../../services/types/user.types";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const { execute, error, isLoading } = useAsyncCall<IUser>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    const result = await execute(() => api.auth.signup(data));
    if (!result) return;
    navigate("/auth?type=login");
  };

  return (
    <form
      className="flex flex-col gap-3 mt-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInputField
        type="email"
        placeholder="Enter Email"
        name="email"
        register={register}
        error={errors.email}
      />

      <FormInputField
        placeholder="Enter Username"
        name="username"
        register={register}
        error={errors.username}
      />

      <FormInputField
        type="password"
        placeholder="Create Password"
        name="password"
        register={register}
        error={errors.password}
      />

      <button
        type="submit"
        className="w-full py-3 bg-white text-black rounded-md font-semibold mt-3 hover:bg-white/90 transition-colors cursor-pointer"
        disabled={isLoading}
      >
        {isLoading && <i className="fa-solid fa-spinner fa-spin"></i>} Create
        Account
      </button>
      {error && <span className="text-red-400 text-sm">{error.message}</span>}
    </form>
  );
};

export default SignupForm;
