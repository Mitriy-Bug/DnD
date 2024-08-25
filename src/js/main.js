export default class Game {
  constructor() {
    this.score = 0; // Счёт игрока
    this.goblinsMissed = 0; // Количество пропущенных гоблинов
    this.pointsToLose = 5; // Количество пропусков до проигрыша
    this.hit = document.querySelector(".hit");
    this.miss = document.querySelector(".miss");
    this.containerGame = document.querySelector(".containerGame");
    this.containerCount = document.querySelector(".containerCount");
    this.count = document.querySelector(".count");
    this.UserClick();
    this.Countdown(() => {
      this.setupGoblins();
    });
    this.startCount();
  }
  startCount() {
    setInterval(() => this.activeItem(), 2000);
  }
  removeGoblins() {
    if (document.querySelector(".active")) {
      return document.querySelector(".active").classList.remove("active");
    }
  }
  RandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  activeItem() {
    this.items = document.querySelectorAll(".item:not(.active)");
    this.removeGoblins(); // Удаление гоблинов
    if (this.items.length > 0) {
      this.items[this.RandomNumber(0, this.items.length)].classList.add(
        "active",
      );
    }
  }
  setupGoblins() {
    if (this.containerGame) {
      this.containerGame.innerHTML = "";
      for (let i = 0; i < 16; i++) {
        const newDiv = document.createElement("div");
        if (i === 0) {
          newDiv.classList.add("active", "item");
        } else {
          newDiv.classList.add("item");
        }
        this.containerGame.insertBefore(newDiv, this.containerGame.firstChild);
      }
    }
  }
  UserClick() {
    // Логика для обработки ввода пользователя
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("active")) {
        this.score++;
        this.hit.innerHTML = this.score;
      } else {
        this.goblinsMissed++;
        this.miss.innerHTML = this.goblinsMissed;
        if (this.pointsToLose === this.goblinsMissed) {
          this.hit.innerHTML = "0";
          this.miss.innerHTML = "0";
          this.score = 0;
          this.goblinsMissed = 0;
          alert("Вы проиграли!");
          this.count.innerHTML = "5...";
          this.containerCount.classList.toggle("d-none");
          this.containerGame.classList.add("d-none");
          this.Countdown(() => {
            this.setupGoblins();
          });
        }
      }
    });
  }
  Countdown(callback) {
    if(this.containerGame){
      this.containerGame.classList.add("d-none");
    }
    let counter = 5; // Количество секунд для отсчета
    let intervalId = setInterval(() => {
      counter--;
      if (counter === 0) {
        clearInterval(intervalId);
        this.containerCount.classList.toggle("d-none");
        this.containerGame.classList.toggle("d-none");
        callback(); // Вызываем callback
      } else {
        this.count.insertAdjacentHTML("beforeEnd", counter + "...");
      }
    }, 1000); // Интервал в миллисекундах (1 секунда)
  }
}
