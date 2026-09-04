import { useUser } from "@/context/UserContext";
import { Href, Redirect } from "expo-router";
export default function Index() {
  const { user, loading } = useUser();
  if (loading) return null;

  return user ? (
    <Redirect href={"/(tabs)" as Href} />
  ) : (
    // <Redirect href={"/onboarding/welcome" as Href} />
    <Redirect href={"/login" as Href} />
  );
}
