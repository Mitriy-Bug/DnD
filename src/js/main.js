export default class Trello {
  constructor() {
    this.cardsTodo = document.querySelector(".card-todo");
    this.cardsProgress = document.querySelector(".card-progress");
    this.cardsDone = document.querySelector(".card-done");
    this.formAddCard = document.querySelector(".form-add");
    this.init(); //Инициализация
  }
  init() {
    this.allCards();
    this.buildCard();
    this.addBtnDeleteCard(); //Добавление кнопки удаления карточки
    this.deleteCard(); //Удаление карточки
    this.dragDrop(".container"); //Добавление drag and drop
    this.addForm();
    this.closeForm(); //Закрытие формы
  }
  closeForm() {
    if (this.formAddCard) {
      this.closeFormAddCard = this.formAddCard.querySelector(".btn-close");
      //закрытие формы ко клику
      this.closeFormAddCard.addEventListener("click", (e) => {
        this.formAddCard.classList.add("d-none");
        document.querySelectorAll(".add-card").forEach((item) => {
          item.classList.remove("d-none");
        });
      });
    }
  }
  buildCard() {
    let col = null;
    if(Object.keys(localStorage).length > 0){
      Object.keys(localStorage).forEach((key) => {
        let idCard = JSON.parse(localStorage.getItem(key)).parent;
        col = this.cardsTodo;
        if (idCard == "progress") {
          col = this.cardsProgress;
        } else if (idCard == "done") {
          col = this.cardsDone;
        }
        const cardBody = col.querySelector(".card-body");
        const newCard = document.createElement("div");
        newCard.classList.add("card-item", "border-r6");
        newCard.dataset.id = JSON.parse(localStorage.getItem(key)).id;
        newCard.textContent = JSON.parse(localStorage.getItem(key)).textCard;

        cardBody.insertAdjacentElement("afterbegin", newCard);
      });
    }
  }
  addBtnDeleteCard() {
    //Добавляем кнопку удаления карточки
    let allCardItems = document.querySelectorAll(".card-item");
    allCardItems.forEach((item) => {
      item.insertAdjacentHTML(
        "beforeend",
        '<button type="button" class="btn btn-remove border-r6">✖</button>',
      );
    });
  }
  deleteCard() {
    const allbtnCloseItem = document.querySelectorAll(".btn-remove");
    allbtnCloseItem.forEach((itemClose) => {
      itemClose.addEventListener("click", () => {
        itemClose.parentElement.insertAdjacentHTML(
          "afterEnd",
          '<div class="card-close card-item-success border-r6">Карточка удалена</div>',
        );
        itemClose.offsetParent.remove();
        window.localStorage.removeItem(itemClose.parentElement.dataset.id);
        setTimeout(() => {
          document.querySelector(".card-item-success").remove();
        }, 1000);
      });
    });
  }
  allCards() {
    if (this.formAddCard) {
      this.formAddCard.addEventListener("submit", (form) => {
        form.preventDefault();
        this.addCard(form, this.formAddCard.parentElement);
      });
    }
  }
  addForm() {
    let allBtnAddForm = document.querySelectorAll(".add-card");
    let razdel = "todo";
    allBtnAddForm.forEach((btnAdd) => {
      btnAdd.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-card-progress")) {
          razdel = "progress";
        } else if (e.target.classList.contains("add-card-done")) {
          razdel = "done";
        }
        const formInner = document.querySelector(".card-" + razdel);
        e.target.classList.add("d-none");
        this.formAddCard.classList.remove("d-none");
        this.formAddCard.reset();
        formInner.append(this.formAddCard);
      });
    });
  }
  parentRazdel(parent) {
    if (parent) {
      let razdel = 1;
      let parentId = "todo";
      if (parent.classList.contains("card-progress")) {
        parentId = "progress";
        razdel = 2;
      } else if (parent.classList.contains("card-done")) {
        parentId = "done";
        razdel = 3;
      }
      let arr = {
        razdel: razdel,
        parentId: parentId,
      };
      return arr;
    }
  }
  addCard(addForm, parent) {
    const parentRazdel = this.parentRazdel(parent);

    const textCard = addForm.target.textCard.value;
    let cardBody = parent.querySelector(".card-body");

    let newCard = document.createElement("div");
    const allLSCard =
      "" + parentRazdel.razdel + (window.localStorage.length + 1);
    newCard.classList.add("card-item", "border-r6");
    newCard.dataset.id = allLSCard;
    newCard.textContent = textCard;

    cardBody.insertAdjacentElement("beforeEnd", newCard);

    //Добавление в LocalStorage

    const arrValue = JSON.stringify({
      textCard: textCard,
      id: allLSCard,
      parent: parentRazdel.parentId,
    });
    window.localStorage.setItem(allLSCard, arrValue);
    addForm.target.reset();
    addForm.target.classList.add("d-none");
    cardBody.insertAdjacentHTML(
      "afterEnd",
      '<div class="card-close card-item-success border-r6">Карточка добавлена</div>',
    );
    setTimeout(() => {
      document.querySelector(".card-item-success").remove();
    }, 800);
    document.querySelectorAll(".add-card").forEach((item) => {
      item.classList.remove("d-none");
    });
    this.addBtnDeleteCard();
    this.deleteCard();
  }

  rebuildCard(oldItem, newItem) {
    if (oldItem && newItem) {
      const arrValue = JSON.stringify({
        textCard: oldItem.textCard,
        id: oldItem.id,
        parent: newItem.parent,
      });
      window.localStorage.setItem(oldItem.id, arrValue);
    }
  }
  dragDrop(col) {
    if (col) {
      const items = document.querySelector(col);

      let actualElement,shiftX,shiftY = null;
      let widthItem = null;
      let heightItem = null;
      const onMouseUp = (e) => {
        const mouseUpItem = e.target;

        let newItem = null;
        let newItemId = mouseUpItem.dataset.id;
        if(newItemId === undefined){
          if (mouseUpItem.classList.contains('shadow','card-body')){
            if(mouseUpItem.previousSibling){
              newItemId = mouseUpItem.previousSibling.dataset.id;
            } else if(mouseUpItem.nextSibling){
              newItemId = mouseUpItem.nextSibling.dataset.id;
            }
          }
        }

        if(mouseUpItem.classList.contains("card-item")) {
            mouseUpItem.insertAdjacentElement("beforebegin", actualElement);
        }
        if(mouseUpItem.classList.contains("shadow")) {
          if(mouseUpItem.previousSibling) {
            mouseUpItem.previousSibling.insertAdjacentElement("beforebegin", actualElement);
          } else{
            mouseUpItem.closest('.card-body').insertAdjacentElement("afterbegin", actualElement);
          }
        }

        const oldItem = JSON.parse(
          localStorage.getItem(actualElement.dataset.id),
        );
//console.log(newItemId);
        if (newItemId === undefined) {

          if (this.parentRazdel(mouseUpItem.parentElement)) {
            newItemId = this.parentRazdel(mouseUpItem.closest(".card")).razdel + "1";
            console.log(this.parentRazdel(mouseUpItem.closest(".card")).razdel);

            newItem = {
              id: newItemId,
              parent: this.parentRazdel(mouseUpItem.closest(".card")).parentId,
            };
          }
        } else {
          newItem = JSON.parse(localStorage.getItem(newItemId));
        }

        this.rebuildCard(oldItem, newItem);

        this.removeShadow();
        actualElement.classList.remove("dragged");
        actualElement.removeAttribute("style");
        document.body.removeAttribute("style");
        actualElement = undefined;
        document.documentElement.removeEventListener("mouseup", onMouseUp);
        document.documentElement.removeEventListener("mouseover", onMouseOver);
      };
      const onMouseOver = (event) => {
        const mouseOverItem = event.target;
        //mouseOverItem - элемент под передвигаемым блоком
        const shadow = document.createElement("div");
        shadow.classList.add("shadow", "bg-gray", "border-r6");
        shadow.style.width = widthItem + "px";
        shadow.style.height = heightItem + "px";

        if (mouseOverItem.classList.contains("card-item") === true) {
          this.removeShadow();
          mouseOverItem.insertAdjacentElement("beforebegin", shadow);
        } else if (mouseOverItem.classList.contains("card-body") === true && mouseOverItem.hasChildNodes() === false) {
          this.removeShadow();
          mouseOverItem.insertAdjacentElement("afterbegin", shadow);
        }
      };

      if(items){
        items.addEventListener("mousedown", (e) => {
          actualElement = e.target;
          widthItem = actualElement.offsetWidth;
          heightItem = actualElement.offsetHeight;
          if (actualElement.classList.contains("card-item")) {
            e.preventDefault();

            shiftX = e.clientX - actualElement.getBoundingClientRect().left;
            shiftY = e.clientY - actualElement.getBoundingClientRect().top;

            actualElement.classList.add("dragged");
            actualElement.style.width = widthItem + "px";
            actualElement.style.height = heightItem + "px";
            actualElement.style.left = e.pageX - shiftX + "px";
            actualElement.style.top = e.pageY - shiftY + "px";
            document.body.style.cursor = "move";

            document.documentElement.addEventListener("mouseup", onMouseUp);
            document.documentElement.addEventListener("mouseover", onMouseOver);
          }

        });
        document.addEventListener("mousemove", (e) => {
          if (actualElement) {
            if (actualElement.classList.contains("dragged")) {
              e.preventDefault();
              actualElement.style.left = e.pageX - shiftX + "px";
              actualElement.style.top = e.pageY - shiftY + "px";
              document.body.style.cursor = "move";
            }
          }
        })
      }
    }
  }
  removeShadow() {
    let allShadow = document.querySelectorAll(".shadow");
    if (allShadow) {
      allShadow.forEach((item) => {
        item.remove();
      });
    }
  }
}
