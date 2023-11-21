var dropContainers = document.querySelectorAll(".dragDropFiles");
var isMultiple = false
var currentFilesBeforeClick = 0

dropContainers.forEach(dropContainer => {
  // Se inserta la información de las indicacionese
  var mainContainer = document.createElement("div")
  mainContainer.classList = "imagePreview__main" 
  mainContainer.appendChild(createPTag())

  // Se inserta un "input" para agregar las imagenes
  var inputFile = document.createElement("input")
  inputFile.type = "file"
  inputFile.name = dropContainer.getAttribute("name")
  dropContainer.removeAttribute("name")
  inputFile.id = dropContainer.getAttribute("id")
  inputFile.accept = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
  dropContainer.removeAttribute("id")
  inputFile.setAttribute("hidden", "")
  if (dropContainer.getAttribute("multiple") == "") {
    inputFile.setAttribute("multiple", "")
    isMultiple = true
  }
  mainContainer.appendChild(inputFile)
  dropContainer.appendChild(mainContainer)
  
  var files = dropContainer.getAttribute("files")
  
  if (files != null) {
    var path = dropContainer.getAttribute("path")
    console.log("Tiene data, hacer pull")
    obtenerBlob(files,path)
    .then(response => {
      var auxDataTransfer = new DataTransfer();
      var auxDataTransferVoid = new DataTransfer();
      auxDataTransfer.items.add(response)
      var input = dropContainer.querySelector("input[type=file]")
      addFiles(input, auxDataTransferVoid.files, auxDataTransfer.files)
      showFiles(auxDataTransfer.files, dropContainer);
      
    console.log(input.files)
    });
  }
  // 
});

async function obtenerBlob(files,path) {
  let blob = await fetch(path+files)
  .then(r => r.blob())
  .then(blobFile => {
      const file = new File([blobFile], files, { type: "image/png"})
      return file
    })
  return blob
}        

document.addEventListener('dragover', (e) => {
  e.preventDefault(); // Evitar el comportamiento predeterminado del navegador
  var dragDropElement = e.target.closest(".dragDropFiles");
  if (dragDropElement) {
    var files = dragDropElement.querySelector("input[type=file]").files
    if (files.length == 0) {
      var pTag = dragDropElement.querySelector("p")
      pTag.innerHTML = "<strong>Suelta el archivo</strong>";
    }
    dragDropElement.classList.add("active");

  }
});

document.addEventListener('dragleave', (e) => {
  var dragDropElement = e.target.closest(".dragDropFiles");
  if (dragDropElement) {
    var files = dragDropElement.querySelector("input[type=file]").files
    var pTag = dragDropElement.querySelector("p")
    if (files.length == 0) {
      pTag.innerHTML = "<strong>Arrastra y suelta <br> o <br>da click para subir los archivos</strong>";
    }
    dragDropElement.classList.remove("active");
  }
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  var dragDropElement = e.target.closest(".dragDropFiles");
  if (dragDropElement) {
    dragDropElement.classList.remove("active");

    var input = dragDropElement.querySelector("input[type=file]") 
    var currentFiles = e.dataTransfer.files
    addFiles(input, input.files, currentFiles, "drop")
    
    showFiles(input.files, dragDropElement);
  }
});

document.addEventListener('click', (e) => {
  e.stopPropagation();
  
  var closePreview = e.target.matches(".closePreview")
  var dragDropElement = e.target.closest(".dragDropFiles")

  if (closePreview) {
    var currentItemsArray = Array.from(dragDropElement.querySelectorAll("div.imagePreview__item"))
    const child = e.target.closest("div.imagePreview__item")

    if (currentItemsArray.length == 1) {
      var mainPreview = e.target.closest("div.imagePreview__main")
      mainPreview.appendChild(createPTag())
    }
    
    child.remove()
    
    var input = dragDropElement.querySelector("input[type=file]")
    var currentItemsInput = Array.from(input.files)    
    var currentItemsArray = Array.from(dragDropElement.querySelectorAll("div.imagePreview__item"))
    let itemsTitle = []
    let itemsInput = []
    
    currentItemsInput.map((file)=> { itemsInput.push(file.name) })
    currentItemsArray.map((item)=> { itemsTitle.push(item.children[2].title) })
    for (let i = 0; i < itemsInput.length; i++) {
      if (itemsInput[i] != itemsTitle[i] || itemsTitle[i] === undefined) {
        currentItemsInput.splice(i,1)
        break;
      }
    }
    var dataTransfer = new DataTransfer();
    currentItemsInput.map((file) => {dataTransfer.items.add(file)})
    input.files = dataTransfer.files
    return 
  }
  if (dragDropElement) {
    e.stopPropagation();
    currentFilesBeforeClick = dragDropElement.querySelector("input[type=file]").files
    dragDropElement.querySelector("input[type=file]").click()
  }
});

document.addEventListener('change', (e) => {
  var dragDropElement = e.target.closest(".dragDropFiles");
  if (dragDropElement) {
    var auxDataTransfer = new DataTransfer();
    var input = dragDropElement.querySelector("input[type=file]");
    var newFiles = e.target.files

    if (newFiles.length == 0) {
      input.files = currentFilesBeforeClick
      return
    }
    for (const file of currentFilesBeforeClick) {
      auxDataTransfer.items.add(file)
    }
    addFiles(input, auxDataTransfer.files, newFiles)

    showFiles(input.files, dragDropElement)
  }
});

function showFiles(files ,dragDropElement) {
  if (files.length == 0) {
    return
  }
  if (!isMultiple && files.length > 1) {
    alert("Solo se acepta un archivo a la vez")
    return
  }
  var mainPreview = dragDropElement.querySelector('div.imagePreview__main')
  var itemsPreview = mainPreview.querySelectorAll('div.imagePreview__item')
  if (itemsPreview.length > 0) {
    for (const itemPreview of itemsPreview) {
      itemPreview.remove()
    }
  }
  for (const file of files) {
    processFile( file, dragDropElement, mainPreview)
  }
}

function processFile(file, dragDropElement, mainPreview) {
  const fileExtension = file.type;
  const validExtensions = ['image/jpeg','image/jpg','image/png','image/gif','image/webp']
  if (!validExtensions.includes(fileExtension)) {
    alert('No es un archivo válido')
    return
  }
  if (dragDropElement.querySelector('p') != undefined) {
    dragDropElement.querySelector('p').remove();
  }
  // Crear un objeto de tipo FileReader
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.addEventListener('load', () => {
    const shotName = cutName(file)
    
    const fileUrl = fileReader.result;
    const image = `
        <span class="closePreview"></span>
          <img src="${fileUrl}" alt="${file.name}">
        <span title="${file.name}">${shotName}</span>
    `;
    var itemPreview = document.createElement("div")
    itemPreview.classList = "imagePreview__item"
    itemPreview.innerHTML += image;
    mainPreview.appendChild(itemPreview)
  });
}


function addFiles(input, previousFiles, currentFiles) {
  if (!isMultiple || previousFiles.length == 0) {
    input.files = currentFiles
    return
  }
  var dataTransfer = new DataTransfer();
  for (const file of previousFiles) {
    dataTransfer.items.add(file)
  }
  for (const currentFile of currentFiles) {
    dataTransfer.items.add(currentFile)
  }
  input.files = dataTransfer.files
}

function cutName(file) {
  const splitCurrentFileName = file.name.split('.')
  const extension = splitCurrentFileName[splitCurrentFileName.length - 1]
  var fileName = ""
  for (let i = 0; i < splitCurrentFileName.length-1; i++) {
    const word = splitCurrentFileName[i];
    fileName += word
  }
  return fileName.length > 14 ? `${fileName.substring(0,14)}... .${extension}`: file.name;
}

function createPTag() {
  var pTag = document.createElement("p")
  pTag.innerHTML = "<strong>Arrastra y suelta <br> o <br>da click para subir los archivos</strong>"
  return pTag
}