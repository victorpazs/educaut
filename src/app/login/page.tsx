import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | EducAut",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Bem-vindo de volta
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
