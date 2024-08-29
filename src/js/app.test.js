import Trello from "./main";
const trello = new Trello();
test("jsdom", () => {
  const container = document.querySelector(".container");
  expect(container).toBeNull();
});
