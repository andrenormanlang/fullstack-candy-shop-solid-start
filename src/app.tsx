import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createEffect, createSignal, onMount } from "solid-js";
import "./app.scss";
import CartDropdown from "./components/CartDropdown";
import { CartProvider } from "./context/CartContext";
import { SearchProvider, useSearch } from "./context/SearchContext";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList"; // Import the ProductList component

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
      <SearchProvider>
        <div
          class={`w-full ${darkTheme() ? "bg-neutral-900 text-white" : "bg-white text-black"}`}
        >
          <header class="bg-red-600 sticky top-0 z-10 p-4 text-xl flex items-center justify-between h-20">
            <div class="flex items-center">
              <button
                onClick={toggleTheme}
                class="material-symbols-outlined cursor-pointer ml-4"
              >
                {darkTheme() ? "dark_mode" : "light_mode"}
              </button>
              <a class="navbar-brand ml-2" href="/">
                <img src="/logo.svg" class="max-h-9" alt="Pixie Pops Logo" />
              </a>
            </div>
            <div class="hidden sm:flex items-center flex-grow justify-center mt-4 mb-4">
              <SearchBar />
            </div>
            <div class="flex items-center relative mr-4 mt-4">
              <CartDropdown />
            </div>
          </header>
          <div class="sm:hidden p-4 mt-4">
            <SearchBar />
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

          {/* Add the ProductList component here */}
          {/* <ProductList /> */}

        </div>
      </SearchProvider>
    </CartProvider>
  );
}
