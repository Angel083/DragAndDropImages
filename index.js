var dropContainersArray = document.getElementsByClassName("dragDropFiles");
var dropContainers = document.querySelectorAll(".dragDropFiles");

dropContainers.forEach(dropContainer => {
  // Se inserta la información de las indicacionese
  var pTag = document.createElement("p")
  pTag.innerHTML = "<strong>Arrastra y suelta <br> o <br>da click para subir los archivos</strong>"
  dropContainer.appendChild(pTag)

  // Se inserta un "input" para agregar las imagenes
  var inputFile = document.createElement("input")
  inputFile.type = "file"
  inputFile.name = dropContainer.getAttribute("name")
  dropContainer.removeAttribute("name")
  inputFile.id = dropContainer.getAttribute("id")
  inputFile.accept = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
  dropContainer.removeAttribute("id")
  inputFile.setAttribute("hidden", "")
  dropContainer.appendChild(inputFile)
});

document.addEventListener('click', (e) => {
  e.stopPropagation();
  var closePreview = e.target.matches(".closePreview")
  var dragDropElement = e.target.closest(".dragDropFiles")
  if (closePreview) {
    dragDropElement.innerHTML = ""
    var pTag = document.createElement("p")
    pTag.innerHTML = "<strong>Arrastra y suelta <br> o <br>da click para subir los archivos</strong>"
    dragDropElement.appendChild(pTag)

    // Se inserta un "input" para agregar las imagenes
    var inputFile = document.createElement("input")
    inputFile.type = "file"
    inputFile.name = dragDropElement.getAttribute("name")
    dragDropElement.removeAttribute("name")
    inputFile.id = dragDropElement.getAttribute("id")
    inputFile.accept = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
    dragDropElement.removeAttribute("id")
    inputFile.setAttribute("hidden", "")
    dragDropElement.appendChild(inputFile)
    return
  }
  if (dragDropElement) {
    
    var input = dragDropElement.querySelector("input[type=file]");
    input.click()
  }
})

document.addEventListener('dragover', (e) => {
  e.preventDefault(); // Evitar el comportamiento predeterminado del navegador
  var dragDropElement = e.target.closest(".dragDropFiles");
  if (dragDropElement) {
    var files = dragDropElement.querySelector("input[type=file]").files
    if (files.length == 0) {
      var pTag = dragDropElement.firstElementChild;
      pTag.innerHTML = "<strong>Suelta el archivo</strong>";
    }
    dragDropElement.classList.add("active");

  }
});

document.addEventListener('dragleave', (e) => {
  var dragDropElement = e.target.closest(".dragDropFiles");
  if (dragDropElement) {
    var files = dragDropElement.querySelector("input[type=file]").files
    if (files.length == 0) {
      var files = dragDropElement.querySelector("input[type=file]").files
      var pTag = dragDropElement.firstElementChild;
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
    files = e.dataTransfer.files
    dragDropElement.querySelector("input[type=file]").files = files
    showFiles(files, dragDropElement)
  }
});
document.addEventListener('change', (e) => {
  var dragDropElement = e.target.closest(".dragDropFiles");
  if (dragDropElement) {
    var files = dragDropElement.querySelector("input[type=file]").files
    showFiles(files, dragDropElement)
  }
});

function showFiles(files,dragDropElement) {
  if (files.length == 0) {
    return
  }
  if (files.length === undefined || files.length > 1) {
    alert("Solo se puede procesar una imagen")
    return
  }
  const file = files[0]
  processFile(file, dragDropElement)
}

function processFile(file, dragDropElement) {
  const fileExtension = file.type;
  const validExtensions = ['image/jpeg','image/jpg','image/png','image/gif','image/webp']
  if (!validExtensions.includes(fileExtension)) {
    alert('No es un archivo válido')
    return
  } 
  // Crear un objeto de tipo FileReader
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);

  fileReader.addEventListener('load', () => {
    const fileUrl = fileReader.result;
    //   `;
    const image = `
        <span class="closePreview"></span>
        <img src="${fileUrl}" alt="${file.name}">
        <span name="texto nombre">${file.name}</span>
      `;
    const input = dragDropElement.querySelector("input[type=file]")
    if (dragDropElement.querySelector('p') != undefined) {
      dragDropElement.querySelector('p').remove();
    }
    if (dragDropElement.querySelector('div') != undefined) {
      dragDropElement.querySelector('div').remove();
    }
    var preview = document.createElement("div")
    preview.innerHTML = image
    dragDropElement.insertBefore(preview, input);
  });
}