"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/lib/validators";
import {
  getValidUserIdFromToken,
  updateUserPassword,
} from "@/lib/actions/user.actions";
// import { formatError } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// import toast from "react-hot-toast";

export default function ResetPasswordForm() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  type PasswordFormData = z.infer<typeof ResetPasswordSchema>;

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(""); // Hide the message
      router.push("/sign-in"); // Redirect
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [message, router]);

  const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Submitting..." : "Submit"}
      </Button>
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    if (!token) {
      toast.error("Token Invalid");
      // toast.error((error as Error).message);
      return;
    }

    try {
      const userId = await getValidUserIdFromToken(token); // server action
      await updateUserPassword(userId, data.password); // server action
      setMessage("Password Successfully changed.");

      reset();
    } catch (error) {
      toast.error((error as Error).message);
      // toast.error("Invalid Token");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="space-y-6"></div> */}

      <div>
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          // name="email"
          type="password"
          {...register("password")}
          required
          autoComplete="password"
          defaultValue={signInDefaultValues.password}
        />

        {errors.password?.message && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          // name="email"
          type="password"
          {...register("confirmPassword")}
          required
          autoComplete="confirmPassword"
          // defaultValue={signInDefaultValues.password}
        />
        {errors.confirmPassword?.message && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <SubmitButton />
      </div>
      {message && <div>{message}</div>}
    </form>
  );
}
