import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import CredentialsSignInForm from "./credentials-signin-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
// import { searchParams } from "next/dist/server/request/search-params";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logoBath.svg"
              alt={`${APP_NAME} logo`}
              height={100}
              width={100}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            <CardContent className="space-y-4">
              <CredentialsSignInForm />
            </CardContent>
            <Link
              href="/forgot-password"
              className="text-sm text-center underline text-blue-500"
            >
              Forgot Password?
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SignInPage;
