import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal } from "solid-js";
import Nav from "./components/Nav";
import "./app.scss";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {

  return (
    <ThemeProvider>
    <Router
      root={props => (
        <MetaProvider>
          <Nav/>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >

      <FileRoutes />
    </Router>
    </ThemeProvider>
  );
}
