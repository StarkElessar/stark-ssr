import { join } from "node:path";
import { readFile } from "node:fs/promises";
import express from "express";
import { lazy, Suspense, createElement } from "react";
import { renderToString } from "react-dom/server";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import cn from "classnames";
import { Link, Routes, Route, StaticRouter } from "react-router";
const COMPONENTS_REGISTRY = {
  home: lazy(() => import("./chunk-CRcRWdi-.mjs")),
  about: lazy(() => import("./chunk-DKAXyuRV.mjs")),
  contact: lazy(() => import("./chunk-CZVRBNq9.mjs"))
};
const getComponent = (name) => {
  if (name in COMPONENTS_REGISTRY) {
    return COMPONENTS_REGISTRY[name];
  }
  console.warn(`Component "${name}" not found in registry`);
  return null;
};
const DynamicPage = ({ componentName, data }) => {
  const Component = getComponent(componentName);
  if (Component) {
    return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading..." }), children: /* @__PURE__ */ jsx(Component, { ...data }) });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Component Not Found" }),
    /* @__PURE__ */ jsxs("p", { children: [
      'The component "',
      componentName,
      '" is not registered.'
    ] })
  ] });
};
const header = "_header_ifpye_1";
const navList = "_navList_ifpye_5";
const css$1 = {
  header,
  navList
};
const container = "_container_b1xr9_1";
const css = {
  container
};
const Container = ({ children, className }) => {
  return /* @__PURE__ */ jsx("div", { className: cn(css.container, className), children });
};
const Header = () => {
  return /* @__PURE__ */ jsx("header", { className: css$1.header, children: /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsx("nav", { className: css$1.nav, children: /* @__PURE__ */ jsxs("ul", { className: css$1.navList, children: [
    /* @__PURE__ */ jsx("li", { className: css$1.navItem, children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }) }),
    /* @__PURE__ */ jsx("li", { className: css$1.navItem, children: /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }) }),
    /* @__PURE__ */ jsx("li", { className: css$1.navItem, children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Contact" }) })
  ] }) }) }) });
};
const App = ({ routerData }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(Routes, { children: routerData.map(([path, pageData]) => {
      return /* @__PURE__ */ jsx(
        Route,
        {
          path,
          element: /* @__PURE__ */ jsx(
            DynamicPage,
            {
              componentName: pageData.component,
              data: pageData.data
            }
          )
        },
        path
      );
    }) })
  ] });
};
function RootLayout({
  routerData,
  url,
  layoutAssets,
  currentPageAssets
}) {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
      /* @__PURE__ */ jsx("title", { children: "Dynamic Routing" }),
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("link", { rel: "stylesheet", href: layoutAssets.style }),
        currentPageAssets.style.map((path, index) => /* @__PURE__ */ jsx("link", { rel: "stylesheet", href: "/" + path }, index))
      ] }),
      false
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("div", { id: "__root", className: "wrapper", children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, { routerData }) }) }),
      /* @__PURE__ */ jsx("script", { type: "module", src: layoutAssets.script })
    ] })
  ] });
}
const createServer = async () => {
  const app = express();
  let manifest = {};
  try {
    const manifestContent = await readFile(
      join(process.cwd(), ".output/client/.vite/manifest.json"),
      "utf-8"
    );
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    console.warn("Manifest not found, using default paths ", error);
  }
  let viteServer = null;
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(express.static(join(process.cwd(), "public")));
  {
    app.use(express.static(join(process.cwd(), ".output/client")));
  }
  app.get("*all", async (req, res) => {
    const url = req.url;
    const data = await readFile(join(process.cwd(), "public", "data.json"), "utf-8");
    const parsedData = JSON.parse(data);
    const page = parsedData.pages[url];
    if (!page) {
      return res.status(404).send("Not Found");
    }
    const currentPageKey = `src/client/pages/${page.component}/page.tsx`;
    const html = renderToString(
      createElement(RootLayout, {
        routerData: Object.entries(parsedData.pages),
        layoutAssets: {
          script: `/${manifest["src/client/main.tsx"]?.file}`,
          style: `/${manifest["src/client/main.scss"]?.file}`
        },
        currentPageAssets: {
          style: manifest[currentPageKey].css ?? []
        },
        url
      })
    );
    res.send("<!DOCTYPE html>" + html);
  });
  return { app, viteServer };
};
createServer().then(({ app, viteServer }) => {
  app.listen(3e3, () => {
    console.log("Server running on port: http://localhost:3000");
  });
});
