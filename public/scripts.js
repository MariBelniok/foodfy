const cards = document.querySelectorAll(".card")
for(let card of cards){
    card.addEventListener("click", () => {
        const cardId = card.getAttribute("id")
        window.location.href = `info/${cardId}`
    })
}


toggleItems = document.querySelectorAll(".toggle-item"),
buttons = document.querySelectorAll(".toggle-btn"),
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

const AddButton = {
    addIngredient(){
        const ingredients = document.querySelector("#ingredients")
        const fieldContainer = document.querySelectorAll(".ingredient")

        const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

        if(newField.children[0].value == "") return false

        newField.children[0].value = ""
        ingredients.appendChild(newField)

    },
    addPrepare(){
        const prepare = document.querySelector("#prepares")
        const fieldContainer = document.querySelectorAll(".prepare")
    
        const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
    
        if(newField.children[0].value == "") return false
    
        newField.children[0].value = ""
        prepare.appendChild(newField)
    }
}


//PAGINATION
function paginate(selectedPage, totalPages) {
    let pages = []
    let oldPage
  
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const firstAndLastPage = currentPage == 1 || currentPage == totalPages
      const pagesAfterSelectedPage = currentPage <= selectedPage + 2
      const pagesBeforeSelectedPage = currentPage >= selectedPage - 2
  
        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {

        if (oldPage && currentPage - oldPage > 2) {
            pages.push("...")
        }

        if (oldPage && currentPage - oldPage == 2) {
            pages.push(oldPage + 1)
        }

        pages.push(currentPage)

        oldPage = currentPage
        }
    }
    return pages
}
  
function createPagination(pagination) {

    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const filter = pagination.dataset.filter

    const pages = paginate(page, total) 

    let elements = ""

    for(let page of pages){
        if(String(page).includes("...")){
            elements += `<span>${page}</span>`
        }else{
            if(filter){
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            }else{
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if(pagination){
    createPagination(pagination)
}



//IMAGES UPLOAD
const ImagesUpload = {
        input: "",
        preview: document.querySelector("#images-preview"),
        files: [],
    handleFileInput(event, limit){
        const { files: fileList } = event.target
        ImagesUpload.input = event.target

        if(ImagesUpload.hasLimit(event, limit)) return

        Array.from(fileList).forEach(file => {
            ImagesUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = ImagesUpload.getContainer(image)
                ImagesUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })
        ImagesUpload.input.files = ImagesUpload.getAllFiles()
    },
    hasLimit(event, limit){
        const { input, preview } = ImagesUpload
        const { files: fileList } = input

        if(fileList.length > limit){
            alert(`Envie no máximo ${limit} fotos`)
            event.preventDefault()
            return true
        }

        const imagesDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "image")
                imagesDiv.push(item)
        })

        const totalImages = fileList.length + imagesDiv.length
        if(totalImages > limit){
            alert(`Você atingiu o limite máximo de fotos`)
            event.preventDefault()
            return true
        }
        return false
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        ImagesUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image){
        const div = document.createElement('div')
        div.classList.add('image')

        div.onclick = ImagesUpload.removePhoto

        div.appendChild(image)

        div.appendChild(ImagesUpload.getRemoveButton())

        return div
    },
    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(ImagesUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        ImagesUpload.files.splice(index, 1)
        ImagesUpload.input.files = ImagesUpload.getAllFiles()
        photoDiv.remove()
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode

        if(photoDiv.id){
            const removeFiles = document.querySelector('input[name="removed_files"]')
            if(removeFiles){
                removeFiles.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()
    }
}