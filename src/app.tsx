import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createEffect, createSignal, onMount } from "solid-js";
import "./app.scss";
import { ThemeProvider } from "./context/ThemeContext";
import CartDropdown from "./components/CartDropdown";
import { CartProvider } from "./context/CartContext";

export default function App() {
  const [darkTheme, setDarkTheme] = createSignal(false);

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
      <div
        class={`container-nav container m-auto ${
          darkTheme() ? "bg-neutral-900 text-white" : "bg-white text-black"
        }`}
      >
        <header class="bg-red-600 sticky top-0 z-10 my-4 p-2 text-xl flex items-center justify-between">
          <div>
            <div class="flex">
              <button
                onClick={toggleTheme}
                class="material-symbols-outlined cursor-pointer ml-4"
              >
                {darkTheme() ? "dark_mode" : "light_mode"}
              </button>
              <a class="navbar-brand" href="/">
                <img src="/logo.svg" class="max-h-9 ml-2" alt="Pixie Pops Logo" />
              </a>
            </div>
          </div>
          <nav>
            <div class="mx-6 mt-5">
              <CartDropdown />
              <span class="mr-6 absolute top-0 right-0 rounded-full bg-blue-500 text-white px-2 text-xs"></span>
            </div>
          </nav>
        </header>

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
    </CartProvider>
  );
}
