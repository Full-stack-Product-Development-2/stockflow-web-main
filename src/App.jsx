import { ClerkAuthProvider } from "./providers";
import AppRoutes from "./routing/AppRoutes";

function App() {
  return (
    <ClerkAuthProvider>
      <AppRoutes />
    </ClerkAuthProvider>
  );
}

export default App;
