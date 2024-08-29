export default class Trello {
  constructor() {
    this.CardsTodo = document.querySelector(".card-todo");
    this.CardsProgress = document.querySelector(".card-progress");
    this.CardsDone = document.querySelector(".card-done");
    this.allCards();
    this.buildCard();
  }
  buildCard() {
    let col = null;
    Object.keys(localStorage).sort().forEach(key => {
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
       newCard.textContent = JSON.parse(localStorage.getItem(key)).textCard;
       cardBody.insertAdjacentElement("afterbegin", newCard);
    });

  }
  addBtnDeleteCard() {
    //Добавляем кнопку удаления карточки
    const allCardItems = document.querySelectorAll(".card-item");
    allCardItems.forEach((item) => {
      item.insertAdjacentHTML("beforeend",this.btnClose)
    });
  }
  deleteCard() {
    const allbtnCloseItem = document.querySelectorAll(".btn-remove");
    allbtnCloseItem.forEach((itemClose) => {
      itemClose.addEventListener("click", () => {
        itemClose.offsetParent.remove();
      })
    })
  }
  allCards() {
    this.formAddCard = document.querySelector('.form-add-card');
    window.addEventListener("DOMContentLoaded", (event) => {
      formAddCard.addEventListener('submit', (form) => {
        form.preventDefault();
        this.addCard(form, formAddCard.parentElement)
        this.closeFormAddCard = formAddCard.querySelector('.btn-close');
        this.btnClose = '<button type="button" class="btn btn-remove border-r6">✖</button>'
        //закрытие формы ко клику
        this.closeFormAddCard.addEventListener("click", () => {
          this.formAddCard.classList.add("d-none");
          e.target.classList.remove("d-none");
        })
      })
    })


    this.allItems(this.CardsTodo)
    this.allItems(this.CardsProgress)
    this.allItems(this.CardsDone)
    this.addBtnDeleteCard()//Добавление кнопки удаления карточки
    this.deleteCard()//Удаление карточки
  }
  allItems(nameCard) {
    window.addEventListener("DOMContentLoaded", (event) => {
    let mainCard = nameCard;
    let btnAddCard = mainCard.querySelector(".add-card");

    btnAddCard.addEventListener("click", (e) => {

      document.querySelectorAll(".add-card").forEach((item) => {
        item.classList.remove("d-none")
      })
      e.target.classList.add("d-none");
      this.formAddCard.classList.remove("d-none");
      this.formAddCard.reset()
      mainCard.append(this.formAddCard)

    })
  })
  }
  addCard(addForm, parent) {
    //console.log(parent)
    let parentId = 'todo';
    if(parent.classList.contains("card-progress")){
      parentId = 'progress';
    } else if(parent.classList.contains("card-done")){
      parentId = 'done';
    }
    const textCard = addForm.target.textCard.value
        const cardBody = parent.querySelector('.card-body')
        const newCard = document.createElement('div');
        newCard.classList.add("card-item");
        newCard.classList.add("border-r6");
        newCard.textContent = textCard;
        cardBody.insertAdjacentElement("beforeEnd", newCard);

        //Добавление в LocalStorage
        const allLSCard = window.localStorage.length;
        const arrValue = JSON.stringify({
          textCard: textCard,
          id: allLSCard,
          parent: parentId,
        });
        window.localStorage.setItem('card-' + allLSCard, arrValue)


        addForm.target.reset();
        addForm.target.classList.add("d-none");
        addForm.target.insertAdjacentHTML("afterEnd", '<div class="card-close card-item-success border-r6">Карточка добавлена</div>');
        setTimeout(() => {
          document.querySelector('.card-item-success').remove();
        }, 1000);
        document.querySelectorAll(".add-card").forEach((item) => {item.classList.remove("d-none")})

        this.addBtnDeleteCard()//Добавление кнопки удаления карточки
        this.deleteCard()//Удаление карточки
  }
}
