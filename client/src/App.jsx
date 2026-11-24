// Top-level page layout assembling background, header, flier, form card, and footer
import { Background } from "./components/Background.jsx";
import { Header } from "./components/Header.jsx";
import { FlierSpace } from "./components/FlierSpace.jsx";
import { Register } from "./pages/Register.jsx";
import { Footer } from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <Background />

      <div className="page-shell">
        <Header />
        <FlierSpace />

        <main className="glass form-card">
          <Register />
        </main>

        <Footer />
      </div>
    </>
  );
}