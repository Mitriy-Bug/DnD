export default class Trello {
  constructor() {
    this.cardsTodo = document.querySelector(".card-todo");
    this.cardsProgress = document.querySelector(".card-progress");
    this.cardsDone = document.querySelector(".card-done");
    this.formAddCard = document.querySelector(".form-add-card");
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
    Object.keys(localStorage).forEach((key) => {
      let idCard = JSON.parse(localStorage.getItem(key)).parent;
      col = this.cardsTodo;
      if (idCard == "progress") {
        col = this.cardsProgress;
      } else if (idCard == "done") {
        col = this.cardsDone;
      }
      const cardBody = col.querySelector(".card-body");
      const newCardOuter = document.createElement("div");
      newCardOuter.classList.add("card-item-outer", 'border-r6');
      const newCard = document.createElement("div");
      newCard.classList.add("card-item", 'border-r6');
      newCard.dataset.id = JSON.parse(localStorage.getItem(key)).id;
      newCard.textContent = JSON.parse(localStorage.getItem(key)).textCard;
      newCardOuter.insertAdjacentElement("afterbegin", newCard);
      cardBody.insertAdjacentElement("afterbegin", newCardOuter);
    });
  }
  addBtnDeleteCard() {
    //Добавляем кнопку удаления карточки
    let allCardItems = document.querySelectorAll(".card-item");
    allCardItems.forEach((item) => {
      item.insertAdjacentHTML("beforeend", '<button type="button" class="btn btn-remove border-r6">✖</button>');
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
    allBtnAddForm.forEach((btnAdd) => {

      btnAdd.addEventListener("click", (e) => {
        let razdel = 'todo';
        if (e.target.classList.contains("add-card-progress")) {
          razdel = "progress";
        } else if (e.target.classList.contains("add-card-done")) {
          razdel = "done";
        }
        const formInner = document.querySelector(".card-"+razdel);
          e.target.classList.add("d-none");
          this.formAddCard.classList.remove("d-none");
          this.formAddCard.reset();
         formInner.append(this.formAddCard);
      });
    });
  }
  parentRazdel(parent) {
    if(parent){
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
        parentId: parentId
      }
      return arr;
    }
  }
  addCard(addForm, parent) {
    const parentRazdel = this.parentRazdel(parent);

    const textCard = addForm.target.textCard.value;
    let cardBody = parent.querySelector(".card-body");
    let newCardOuter = document.createElement("div");
    newCardOuter.classList.add("card-item-outer", 'border-r6');
    let newCard = document.createElement("div");
    const allLSCard = "" + parentRazdel.razdel + (window.localStorage.length + 1);
    newCard.classList.add("card-item", 'border-r6');
    newCard.dataset.id = allLSCard;
    newCard.textContent = textCard;

    newCardOuter.insertAdjacentElement("beforeEnd", newCard);

    cardBody.insertAdjacentElement("beforeEnd", newCardOuter);

    //Добавление в LocalStorage

    const arrValue = JSON.stringify({
      textCard: textCard,
      id: allLSCard,
      parent: parentRazdel.parentId,
    });
    window.localStorage.setItem(allLSCard, arrValue);
    addForm.target.reset();
    addForm.target.classList.add("d-none");
    addForm.target.insertAdjacentHTML(
      "afterEnd",
      '<div class="card-close card-item-success border-r6">Карточка добавлена</div>',
    );
    setTimeout(() => {
      document.querySelector(".card-item-success").remove();
    }, 1000);
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

      let actualElement = null;
      let widthItem = null;
      let heightItem = null;
      const onMouseUp = (e) => {
        const mouseUpItem = e.target;
        let newItem = null;
        let newItemId = mouseUpItem.dataset.id;

        const oldItem = JSON.parse(
          localStorage.getItem(actualElement.dataset.id),
        );

        if(newItemId == undefined){
          console.log(this.parentRazdel(mouseUpItem.parentElement));
          if(this.parentRazdel(mouseUpItem.parentElement)){
            newItemId = this.parentRazdel(mouseUpItem.parentElement).razdel+'1';
            newItem = {
              id:newItemId,
              parent:this.parentRazdel(mouseUpItem.parentElement).parentId
            }
          }

        } else {
          newItem = JSON.parse(
            localStorage.getItem(newItemId),
          );
        }
        this.rebuildCard(oldItem, newItem);

        const parent = mouseUpItem.closest(".card-body");
        const itemBuild = document.createElement("div");
        itemBuild.classList.add('card-item-outer', 'border-r6');
        itemBuild.insertAdjacentElement("beforeEnd", actualElement);

        let referenceElement = mouseUpItem.parentElement;

        if(referenceElement){
          if(referenceElement.classList.contains("card") === false){
            referenceElement.insertAdjacentElement("beforebegin", itemBuild);
          } else {
            if(parent){
              parent.insertAdjacentElement("beforeEnd", itemBuild);
            }
          }
        }

        const drag = document.querySelector(".drag");
        if (drag) {
          drag.remove();
        }
        this.removeShadow();
        actualElement.parentElement.classList.remove("drag");
        actualElement.classList.remove("dragged");
        actualElement.style = '';
        actualElement = undefined;

        document.documentElement.removeEventListener("mouseup", onMouseUp);
        document.documentElement.removeEventListener("mouseover", onMouseOver);
      };
      const onMouseOver = (event) => {
        const mouseOverItem = event.target;
        if(mouseOverItem.classList.contains("card-item") === true){
          this.removeShadow();
          const shadow = document.createElement("div");
          shadow.classList.add("shadow", 'bg-gray', 'border-r6');
          shadow.style.width= widthItem + "px";
          shadow.style.height= heightItem + "px";
          mouseOverItem.insertAdjacentElement("beforebegin", shadow);
        }
        actualElement.style.top = event.clientY + "px";
        actualElement.style.left = event.clientX + "px";

      };
        items.addEventListener("mousedown", (e) => {

          actualElement = e.target;

          widthItem = actualElement.offsetWidth;
          heightItem = actualElement.offsetHeight;

          if (actualElement.classList.contains("card-item")) {
            e.preventDefault();
            actualElement.parentElement.classList.add("drag");
            actualElement.classList.add("dragged");
            actualElement.style.width= widthItem + "px";
            actualElement.style.height= heightItem + "px";
            actualElement.style.grabbing = 'grabbing';

            actualElement.parentElement.style.width= widthItem + "px";
            actualElement.parentElement.style.height= heightItem + "px";

            document.documentElement.addEventListener("mouseup", onMouseUp);
            document.documentElement.addEventListener("mouseover", onMouseOver);
          }
        });
    }
  }
  removeShadow(){
    let allShadow = document.querySelectorAll(".shadow");
      if(allShadow){
        allShadow.forEach((item) => {
          item.remove();
        })
      }
  }
}
