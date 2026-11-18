import { useUiStore } from "./stores/useUiStore";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DeleteProfilePage } from "./pages/DeleteProfilePage";

export default function App() {
  const view = useUiStore((state) => state.view);

  if (view === "onboarding") {
    return <OnboardingPage />;
  }

  if (view === "delete-profile") {
    return <DeleteProfilePage />;
  }

  return <DashboardPage />;
}
