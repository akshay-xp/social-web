import { AuthProvider } from "./providers/auth-provider";
import { Trunk } from "./trunk";

export function App() {
  return (
    <AuthProvider>
      <Trunk />
    </AuthProvider>
  );
}
