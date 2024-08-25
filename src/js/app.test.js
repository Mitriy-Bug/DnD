import Game from "./main";
const game = new Game();
test("jsdom", () => {
  const container = document.querySelector(".containerGame");
  expect(container).toBeNull();
});
