import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Registro | EducAut",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Crie sua conta
          </h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
