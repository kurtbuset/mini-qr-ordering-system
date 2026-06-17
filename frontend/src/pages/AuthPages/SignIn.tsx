import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | QR Ordering System"
        description="Sign in to access the QR Ordering System admin dashboard"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
