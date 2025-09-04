import Image from "next/image";
import { redirect } from "next/navigation";

export function AppLogo() {
  return (
    <Image
      onClick={() => redirect("/home")}
      className="cursor-pointer md:h-12 md:w-12"
      src="/app-logo.png"
      width={52}
      height={52}
      alt="App Logo"
    />
  );
}
