export default class Trello {
  constructor() {
    this.CardsTodo = document.querySelector(".card-todo");
    this.CardsProgress = document.querySelector(".card-progress");
    this.CardsDone = document.querySelector(".card-done");
    this.formAddCard = document.querySelector('.form-add-card');
    this.btnClose = '<button type="button" class="btn btn-remove border-r6">✖</button>'
    this.allCards();
    this.buildCard();
    this.addBtnDeleteCard();//Добавление кнопки удаления карточки
    this.deleteCard()//Удаление карточки
    this.drag_drop('.container'); //Добавление drag and drop
    if(this.formAddCard){
      this.closeFormAddCard = this.formAddCard.querySelector('.btn-close');
      //закрытие формы ко клику
      this.closeFormAddCard.addEventListener("click", (e) => {
        this.formAddCard.classList.add("d-none");
        document.querySelectorAll(".add-card").forEach((item) => {
          item.classList.remove("d-none")
        })
      })
    }
  }
  buildCard() {
    let col = null;
    Object.keys(localStorage).forEach(key => {
      let idCard = JSON.parse(localStorage.getItem(key)).parent;
      col = this.CardsTodo;
      if(idCard == 'progress'){
        col = this.CardsProgress;
      } else if(idCard == 'done'){
        col = this.CardsDone;
      }
      const cardBody = col.querySelector('.card-body')
       const newCard = document.createElement('div');
       newCard.classList.add("card-item");
       newCard.classList.add("border-r6");
       newCard.dataset.id = JSON.parse(localStorage.getItem(key)).id;
       newCard.textContent = JSON.parse(localStorage.getItem(key)).textCard;
       cardBody.insertAdjacentElement("afterbegin", newCard);
    });
  }
  addBtnDeleteCard() {
    //Добавляем кнопку удаления карточки
    let allCardItems = document.querySelectorAll(".card-item");
    allCardItems.forEach((item) => {
      item.insertAdjacentHTML("beforeend",this.btnClose)
    });
  }
  deleteCard() {
    const allbtnCloseItem = document.querySelectorAll(".btn-remove");
    allbtnCloseItem.forEach((itemClose) => {
      itemClose.addEventListener("click", () => {
        itemClose.parentElement.insertAdjacentHTML("afterEnd", '<div class="card-close card-item-success border-r6">Карточка удалена</div>');
        itemClose.offsetParent.remove();
        window.localStorage.removeItem(itemClose.parentElement.dataset.id);
        setTimeout(() => {
          document.querySelector('.card-item-success').remove();
        }, 1000);
      })
    })
  }
  allCards() {
    this.allItems(this.CardsTodo)
    this.allItems(this.CardsProgress)
    this.allItems(this.CardsDone)
    if(this.formAddCard){
      this.formAddCard.addEventListener('submit', (form) => {
        form.preventDefault();
        this.addCard(form, this.formAddCard.parentElement)
      })
    }
  }
  allItems(nameCard) {
    if(nameCard){
      nameCard.querySelector('.add-card').addEventListener("click", (e) => {
        e.target.classList.add("d-none");
        this.formAddCard.classList.remove("d-none");
        this.formAddCard.reset()
        nameCard.append(this.formAddCard)
      })
    }
  }
  addCard(addForm, parent) {
    let razdel = 1;
    let parentId = 'todo';
    if(parent.classList.contains("card-progress")){
      parentId = 'progress';
      razdel = 2;
    } else if(parent.classList.contains("card-done")){
      parentId = 'done';
      razdel = 3;
    }
    const textCard = addForm.target.textCard.value
        let cardBody = parent.querySelector('.card-body')
        let newCard = document.createElement('div');
        const allLSCard = '' + razdel + (window.localStorage.length+1);
        newCard.classList.add("card-item");
        newCard.classList.add("border-r6");
        newCard.dataset.id = allLSCard;
        newCard.textContent = textCard;

        cardBody.insertAdjacentElement("beforeEnd", newCard);

        //Добавление в LocalStorage

        const arrValue = JSON.stringify({
          textCard: textCard,
          id: allLSCard,
          parent: parentId,
        });
        window.localStorage.setItem(allLSCard, arrValue)
        addForm.target.reset();
        addForm.target.classList.add("d-none");
        addForm.target.insertAdjacentHTML("afterEnd", '<div class="card-close card-item-success border-r6">Карточка добавлена</div>');
        setTimeout(() => {
          document.querySelector('.card-item-success').remove();
        }, 1000);
        document.querySelectorAll(".add-card").forEach((item) => {item.classList.remove("d-none")})
    this.addBtnDeleteCard();
    this.deleteCard();
  }

  rebuildCard(oldItem, newItem){
    if(oldItem){
      const arrValue = JSON.stringify({
        textCard: oldItem.textCard,
        id: oldItem.id,
        parent: newItem.parent,
      });
      window.localStorage.setItem(oldItem.id, arrValue)
    }
  }
  drag_drop(col) {

    if(col){
      let actualElement;
      const onMouseUp = (e) => {
        const mouseUpItem = e.target;

        const oldItem = JSON.parse(localStorage.getItem(actualElement.dataset.id));
        const newItem = JSON.parse(localStorage.getItem(mouseUpItem.dataset.id));

        this.rebuildCard(oldItem, newItem);

        mouseUpItem.parentElement.insertBefore(actualElement,mouseUpItem);

        actualElement.classList.remove('dragged');
        actualElement = undefined;

        document.documentElement.removeEventListener('mouseup', onMouseUp);
        document.documentElement.removeEventListener('mouseover', onMouseOver);
      }
      const onMouseOver = (event) => {

        actualElement.style.top = event.clientY + 'px';
        actualElement.style.left = event.clientX + 'px';

      }
      let items = document.querySelectorAll(col+'.card-body');
        items.forEach((item) => {
          item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            actualElement = e.target;
            actualElement.classList.add('dragged');

            document.documentElement.addEventListener('mouseup', onMouseUp);
            document.documentElement.addEventListener('mouseover', onMouseOver);
          })
        })

    }

  }
}
