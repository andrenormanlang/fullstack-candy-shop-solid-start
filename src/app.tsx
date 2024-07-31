import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal } from "solid-js";
import { IoCartOutline } from "solid-icons/io";
import CartDropdown from "./components/CartDropdown";
import { IProduct } from "./types/types";
import "./app.scss";

export default function App() {
  const [darkTheme, setDarkTheme] = createSignal(false);
  const [cartItems, setCartItems] = createSignal<IProduct[]>([]);

  function toggleTheme() {
    setDarkTheme(!darkTheme());
  }

  function addToCart(item: IProduct) {
    setCartItems([...cartItems(), item]);
  }

  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <header class={`container-nav container m-auto ${darkTheme() ? "bg-neutral-900 text-white" : "bg-white text-black"}`}>
            <div class="bg-red-600 sticky top-0 z-10 my-4 p-2 text-xl flex items-center justify-between">
              <div>
                <div class="flex">
                  <button onClick={toggleTheme} class="material-symbols-outlined cursor-pointer ml-4">
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
                  <span class="mr-6 absolute top-0 right-0 rounded-full bg-blue-500 text-white px-2 text-xs">
                    {/* Cart count can be added here */}
                  </span>
                </div>
              </nav>
            </div>
          </header>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >

      <FileRoutes />
    </Router>
  );
}
