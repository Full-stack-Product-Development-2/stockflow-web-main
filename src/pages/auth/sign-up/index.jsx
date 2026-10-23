import { SignUp } from "@clerk/react";

import AuthLayout from "@/layouts/AuthLayout";
import AuthBrand from "../com/AuthBrand";

function SignUpPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md px-4 py-6">
        <AuthBrand />
        <div className="flex justify-center">
          <SignUp routing="path" path="/sign-up" />
        </div>
      </div>
    </AuthLayout>
  );
}

export default SignUpPage;
