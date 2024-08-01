import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal } from "solid-js";
import Nav from "./components/Nav";
import "./app.scss";
import { ThemeProvider } from "./context/ThemeContext";
import { IProduct } from "./types/types";
import CartDropdown from "./components/CartDropdown";

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
    <div
        class={` container-nav container m-auto ${
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
            {/* <NavLink href="/" end class="mx-2">Home</NavLink> */}

            <div class="mx-6 mt-5">
              <CartDropdown />
                <span class="mr-6 absolute  top-0 right-0 rounded-full bg-blue-500 text-white px-2 text-xs">
                </span>

            </div>

            {/* <NavLink href="/product" class="mx-2">Products</NavLink> */}
          </nav>
        </header>

        <div class="rounded-md text-center py-6">
        <Router
      root={props => (
        <MetaProvider>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >

      <FileRoutes />
    </Router>
        </div>
      </div>

  );
}


