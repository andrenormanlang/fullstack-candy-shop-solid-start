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
        <div class="relative w-full min-h-screen">
          {/* Background layer for dark theme */}
          <Motion.div
            class={`absolute top-0 left-0 w-full h-full transition-opacity duration-2000 ease-in-out ${
              darkTheme() ? "opacity-0" : "opacity-100"
            }`}
            style={{
              "background-color": "rgb(91, 91, 91)", // Custom background color
              "background-repeat": "no-repeat", // Ensure no repeat of the background
              "background-attachment": "fixed", // Makes the background fixed on scroll
              "background-size": "cover", // Cover the whole screen
              "background-image": "url('/bg-candy-dark.jpeg')", // Dark theme background
            }}
          ></Motion.div>

          {/* Background layer for light theme */}
          <Motion.div
            class={`absolute top-0 left-0 w-full h-full transition-opacity duration-2000 ease-in-out ${
              darkTheme() ? "opacity-100" : "opacity-0"
            }`}
            style={{
              "background-color": "rgb(91, 91, 91)", // Custom background color
              "background-repeat": "no-repeat", // Ensure no repeat of the background
              "background-attachment": "fixed", // Makes the background fixed on scroll
              "background-size": "cover", // Cover the whole screen
              "background-image": "url('/bg-candy.jpg')", // Light theme background
            }}
          ></Motion.div>

          {/* Your other content */}
          <div class="relative z-10">
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
                  <img
                    src="/logo-stephanie.svg"
                    class="max-h-16"
                    alt="Pixie Pops Logo"
                  />
                </Motion.a>
              </div>
              <div class="hidden sm:flex items-center flex-grow justify-center mt-4 mb-4"></div>
              <div class="flex items-center relative mr-4 mt-4">
                <CartDropdown />
              </div>
            </header>

            <div class="sm:hidden p-4 mt-4"></div>

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
          </div>
        </div>
      </SearchProvider>
    </CartProvider>
  );
}
