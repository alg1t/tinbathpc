"use client";
import { emailPasswordChangeSchema } from "@/lib/validators";
import { sendTokenToEmail } from "@/lib/actions/user.actions";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import { toast } from "sonner";

type FormSchema = z.infer<typeof emailPasswordChangeSchema>;

const EmailForm: React.FC = () => {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(emailPasswordChangeSchema) });

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const onSubmit = async (data: FormSchema) => {
    try {
      await sendTokenToEmail(data.email);
      setMessage("An email link has been sent.");
      reset();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {isSubmitting ? "Sending Email..." : "Send Email"}
      </Button>
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            // name="email"
            type="email"
            {...register("email")}
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <SignInButton />
        </div>

        {message && <div>{message}</div>}
      </div>
    </form>
  );
};

export default EmailForm;
