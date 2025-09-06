import { Toaster } from "sonner";
import UserSearch from "./components/UserSearch";

const App = () => {
  return (
    <div className="container">
      <h1>GitHub Finder</h1>
      <UserSearch />
      <Toaster />
    </div>
  );
}

export default App;