import { ContentCard } from "../../../../components/content-card";
import { getCurrentUser } from "@/lib/session";
import { ProfileForm } from "./_components/ProfileForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  return (
    <ContentCard title="Meu perfil">
      <div className="col-span-12">
        {user ? (
          <ProfileForm
            initialName={user.name}
            initialEmail={user.email}
            initialAvatar={user.avatar ?? null}
          />
        ) : null}
      </div>
    </ContentCard>
  );
}
