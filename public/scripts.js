const cards = document.querySelectorAll(".card");


let toggleItems = document.querySelectorAll(".toggle-item");
let buttons = document.querySelectorAll(".toggle-btn");


for(let card of cards){
    card.addEventListener("click", () => {
        const cardId = card.getAttribute("id")
        window.location.href = `info?id=${cardId}`
    })
}

buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        toggleItems[index].classList.toggle("active")
        if(toggleItems[index].classList.contains("active")){
            button.innerHTML = "ESCONDER"
        }else{
            button.innerHTML = "MOSTRAR"
        }
        
    })
})
