const cards = document.querySelectorAll(".card");

const toggleItems = document.querySelectorAll(".toggle-item");
const buttons = document.querySelectorAll(".toggle-btn");


for(let card of cards){
    card.addEventListener("click", () => {
        const cardId = card.getAttribute("id")
        window.location.href = `info/${cardId}`
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

function addIngredient(){
    const ingredients = document.querySelector("#ingredients")
    const fieldContainer = document.querySelectorAll(".ingredient")

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    if(newField.children[0].value == "") return false

    newField.children[0].value = ""
    ingredients.appendChild(newField)
}
function addPrepare(){
    const prepare = document.querySelector("#prepares")
    const fieldContainer = document.querySelectorAll(".prepare")

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    if(newField.children[0].value == "") return false

    newField.children[0].value = ""
    prepare.appendChild(newField)
}
document.querySelector(".add-ingredient").addEventListener("click", addIngredient)
document.querySelector(".add-prepare").addEventListener("click", addPrepare)