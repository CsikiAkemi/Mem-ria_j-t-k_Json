const gridContainer = document.querySelector("#grid-container");
let cards = [];
let firstCard = '';
let secondCard = '';
let lockBoard = false;
let score = 0;

document.querySelector("#score").textContent = score;



fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });



function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement('div');
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML =
            `
            <div class="front">
                <img class="card-img" src="${card.img}" alt="${card.name}"> <!-- Megj: hozzáadva az alt attribútum -->
            </div>
            <div class="back"></div>
            `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener('click', flipCard);
    }
}

function shuffleCards(){
    let currentIndex = cards.length;
       let randomIndex = '';
        let temporaryValue = '';

    while(currentIndex !== 0){
        randomIndex = Math.floor(Math.random()* currentIndex);
        currentIndex -=1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }

}

function flipCard() {
    if (lockBoard || this === firstCard) return;
    this.classList.add("flipped");
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    checkForMatch();
}

function checkForMatch() {
    if (!firstCard || !secondCard) return; // Hozzáadott ellenőrzés
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? handleMatch() : unflipCards();
}

function handleMatch() {
    score++;
    document.querySelector("#score").textContent = score;
    disabledCards();
}

function disabledCards(){
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();

}

function unflipCards(){
    setTimeout(()=>{
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    },1000);

}

function resetBoard(){
    firstCard = null;
    secondCard = null;
    lockBoard= false;
}


function restart(){
    resetBoard();
    shuffleCards()
    score = 0;
    document.querySelector("#score").textContent = score;
    gridContainer.innerHTML = '';
    generateCards();

}
