import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
