import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
const container = "_container_wisx9_1";
const css$1 = {
  container
};
const btn = "_btn_13zju_1";
const css = {
  btn
};
const Clicker = () => {
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ jsxs("button", { className: css.btn, onClick: () => setCount(count + 1), children: [
    "click ",
    count
  ] });
};
function Home() {
  return /* @__PURE__ */ jsxs("div", { className: css$1.container, children: [
    /* @__PURE__ */ jsx("h1", { children: "Home Page" }),
    /* @__PURE__ */ jsx(Clicker, {})
  ] });
}
export {
  Home as default
};
