import { useForm } from "react-hook-form";
import FormInputField from "../shared/FormInputField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "../../services/types/auth.types";
import useAsyncCall from "../../hooks/useAsyncCall";
import { api } from "../../services/api";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const { execute, error, isLoading } = useAsyncCall<{
    access_token: string;
  }>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await execute(() => api.auth.login(data));
    if (!result) return;
    authService.saveToken(result.access_token);
    navigate("/");
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
        {isLoading && <i className="fa-solid fa-spinner fa-spin"></i>} Login
      </button>
      {error && <span className="text-red-400 text-sm">{error.message}</span>}
    </form>
  );
};

export default LoginForm;
