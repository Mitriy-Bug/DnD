import Tooltip from "./main";
new Tooltip();
test("jsdom", () => {
  const container = document.querySelector(".container");
  expect(container).toBeNull();
});
