import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createEffect, createSignal, onMount } from "solid-js";
import { Motion } from "solid-motionone";
import "./app.scss";
import CartDropdown from "./components/CartDropdown";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import ProductList from "./components/ProductList"; // Import the ProductList component

export default function App() {
  const [darkTheme, setDarkTheme] = createSignal(false);
  const [clickScale, setClickScale] = createSignal(1);

  function toggleTheme() {
    setDarkTheme(!darkTheme());
  }

  onMount(() => {
    if (darkTheme()) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  });

  createEffect(() => {
    if (darkTheme()) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  });

  return (
    <CartProvider>
      <SearchProvider>
        <Motion.div
          class={`w-full min-h-screen ${darkTheme() ? "bg-neutral-900 text-white" : "bg-white text-black"}`}
          animate={{ backgroundImage: darkTheme() ? "url('/bg-candy-dark.jpeg')" : "url('/bg-candy.jpg')" }}
          transition={{ duration: 0.5, easing: "ease-in-out" }}
          style={{ 'background-repeat': "repeat-y", 'background-size': "contain" }}
        >
          <header class="bg-violet-700 sticky top-0 z-10 p-4 text-xl flex items-center justify-between h-32">
            <div class="flex items-center">
              <button
                onClick={toggleTheme}
                class="material-symbols-outlined cursor-pointer ml-4"
              >
                {darkTheme() ? "dark_mode" : "light_mode"}
              </button>
              <Motion.a
                class="navbar-brand ml-4"
                href="/"
                initial={{ scale: 1 }}
                animate={{ scale: clickScale() }}
                hover={{ scale: 1.2 }}
                onClick={() => {
                  setClickScale(1.2);
                  setTimeout(() => setClickScale(1), 200); // Reset scale after animation
                }}
              >
                <img src="/logo-stephanie.svg" class="max-h-16" alt="Pixie Pops Logo" />
              </Motion.a>
            </div>
            <div class="hidden sm:flex items-center flex-grow justify-center mt-4 mb-4">
            </div>
            <div class="flex items-center relative mr-4 mt-4">
              <CartDropdown />
            </div>
          </header>
          <div class="sm:hidden p-4 mt-4">
          </div>

          <div class="rounded-md text-center py-6">
            <Router
              root={(props) => (
                <MetaProvider>
                  <Suspense>{props.children}</Suspense>
                </MetaProvider>
              )}
            >
              <FileRoutes />
            </Router>
          </div>
        </Motion.div>
      </SearchProvider>
    </CartProvider>
  );
}

