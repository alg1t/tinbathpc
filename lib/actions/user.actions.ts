"use server";

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  updateUserSchema,
  // ResetPasswordSchema,
  // emailPasswordChangeSchema,
} from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
// import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
// import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import { z } from "zod";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import { SENDER_EMAIL, APP_NAME } from "../constants";
import { Resend } from "resend";
import { hashSync } from "bcrypt-ts-edge";
import { tokenButton } from "@/components/ui/tokenButton";
import dotenv from "dotenv";
dotenv.config();
import { toast } from "sonner";

// import { addMinutes } from "date-fns"
// import { lucide } from "lucide-react";
// import { getMyCart } from "./cart.actions";

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// get current users cart and delete it so it does not persist to next user
//   const currentCart = await getMyCart();

//   if (currentCart?.id) {
//     await prisma.cart.delete({ where: { id: currentCart.id } });
//   } else {
//     console.warn("No cart found for deletion.");
//   }

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}
//Sign up user
// export async function signUpUser(prevState: unknown, formData: FormData) {
//   try {
//     const user = signUpFormSchema.parse({
//       name: formData.get("name"),
//       email: formData.get("email"),
//       password: formData.get("password"),
//       confirmPassword: formData.get("confirmPassword"),
//     });

//     const plainPassword = user.password;
//     user.password = hashSync(user.password, 10);

//     await prisma.user.create({//       data: {
//         name: user.name,
//         email: user.email,
//         password: user.password,
//       },
//     });
//   }

//     export async function signIn("credentials", {
//       email: user.email,
//       password: plainPassword,
//     });
//     return { success: true, message: "user registered" };
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error;
//     }
//     return { success: false, message: "User not registered" };
//   }

// //     const plainPassword = user.password;

// //     user.password = await hash(user.password);

// //     });

// //     return { success: true, message: "User registered successfully" };
// //   } catch (error) {
// //     if (isRedirectError(error)) {
// //       throw error;
// //     }
// //     return { success: false, message: formatError(error) };
// //   }
// // }

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });
    // trigger cache revalidation so that fresh data appears on next visit
    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//****************************************************** */
export async function sendTokenToEmail(emailParam: string) {
  const email = emailParam;
  if (typeof email !== "string" || !email.includes("@")) {
    throw new Error("Invalid email input");
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new Error("User Not Found");
    }
    // 2. Generate a secure token
    const rawToken = crypto.randomBytes(64).toString("base64");
    // .replace(/\+/g, "-")
    // .replace(/\//g, "_")
    // .replace(/=+$/, "");

    const html = tokenButton({
      rawToken,
    });

    const token = crypto.createHash("sha256").update(rawToken).digest("base64");
    // const resetUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${rawToken}`;
    const resend = new Resend(process.env.RESEND_API_KEY);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 min expiry
      },
    });

    // 3. Send email via Resend
    await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: user.email,
      subject: "Password Reset",
      html,
    });

    // return {
    //   success: true,
    //   message: "User updated successfully",
    // };
  } catch (error) {
    throw error;
    // return { success: false, message: formatError(error) };
    //  return {
    //   success: false,
    //   message: `Failed to update password: ${(error as Error).message}`,
    // };
    // toast.error((error as Error).message);
    // return { success: false, message: formatError(error) };
    // return error;
  }
} // getValidUserIdFromToken.ts

// export async function getUserIdFromValidToken(rawToken: string): Promise<{ userId: string } | null> {
export async function getValidUserIdFromToken(rawToken: string) {
  if (!rawToken) throw new Error("Token is required");
  const token = crypto.createHash("sha256").update(rawToken).digest("base64");
  // console.log(token);
  try {
    const resetTokenData = await prisma.passwordResetToken.findUnique({
      where: { token },
      select: { userId: true, expiresAt: true },
    });

    if (!resetTokenData || resetTokenData.expiresAt < new Date()) {
      throw new Error("Invalid or expired token");
    }

    return resetTokenData.userId;
  } catch (error) {
    // return { success: false, message: formatError(${(error as Error)) };
    // return { success: false, message: `${formatError(error as Error)}` };
    throw error;

    // toast.error((error as Error).message);
    // return { success: false, message: formatError(error) };
    // return error;
  }
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const hashedPassword = hashSync(newPassword, 10);
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Optionally delete the token after use
    await prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
    // return { success: true };
  } catch (error) {
    toast.error("Password Failed To Reset");

    // return {
    //   success: false,
    //   message: `Failed to update password: ${(error as Error).message}`,
    // };
    // toast.error((error as Error).message);
    // throw error;
    // return { success: false, message: formatError(error) };
    // return error;
  }

  // return { success: true };
}
// <a href="${resetUrl}">${resetUrl}<br></a>

// html: `<div style="font-family: sans-serif;">
//        <p>Please click the link below to reset your password: <br></p>
//        <a href="${resetUrl}"
//         style="
//        display: inline-block;
//        padding: 12px 24px;
//        background-color: #0070f3;
//        color: white;
//        text-decoration: none;
//        border-radius: 6px;
//        font-weight: bold;
//       "> Reset Password
//      </div>
//              <p>This link will expire in 15 minutes.</p>
// `,
