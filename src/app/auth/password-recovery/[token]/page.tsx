import ResetPasswordForm from "./_components/ResetPasswordForm";

export const metadata = {
  title: "Redefinir senha | EducAut",
};

export default async function PasswordRecoveryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <ResetPasswordForm token={token} />;
}
