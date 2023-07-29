var projectsData; // Variable pour stocker les projets
  
// Récupération des projets des travaux via API/works + réponse mise au format JSON
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((projects) => {
     projectsData = projects; // Stockage des projets dans la variable
     afficherProjets(projectsData); // Afficher tous les projets initialement
    });

// Récupération des catégories via API/categories + réponse mise au format JSON
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    const sectionFilter = document.querySelector("section .filters")
    // Création du bouton "Tous" et ajout de la classe "active"

      const buttonFilterTous = document.createElement("button");
      buttonFilterTous.setAttribute("id", "Tous");
      buttonFilterTous.innerText = "Tous";
      buttonFilterTous.classList.add("active"); // Ajout de la classe "active" pour pré-sélectionner le bouton "Tous"
      sectionFilter.appendChild(buttonFilterTous);


    // Création des boutons de filtre pour chaque catégorie
      categories.forEach((category) => {
        const buttonFilter = document.createElement("button");
        buttonFilter.innerText = category.name;
        buttonFilter.setAttribute("id", category.name.substr(0, 6));
        sectionFilter.appendChild(buttonFilter);

        // Gestion du clic sur les boutons de filtre
        buttonFilter.addEventListener("click", () => {
        const filterButtons = sectionFilter.querySelectorAll("button");
        filterButtons.forEach((btn) => btn.classList.remove("active")); // Supprimer la classe "active" de tous les boutons de filtre
        buttonFilter.classList.add("active"); // Ajouter la classe "active" au bouton de filtre cliqué

        const filteredProjects = filterProjectsByCategory(category.name); // Filtrer les projets par catégorie

        afficherProjets(filteredProjects); //afficher les projets filtrés
      });
    });
    // Gestion du clic sur le bouton "Tous"
    buttonFilterTous.addEventListener("click", () => {
      const filterButtons = sectionFilter.querySelectorAll("button");
        filterButtons.forEach((btn) => btn.classList.remove("active")); // Supprimer la classe "active" de tous les boutons de filtre
        buttonFilterTous.classList.add("active"); // Ajouter la classe "active" au bouton "Tous"
        afficherProjets(projectsData); // Afficher tous les projets
    });
  });


// Fonction pour filtrer les projets par catégorie
function filterProjectsByCategory(categoryName) {
  if (categoryName === "Tous") {
    return projectsData; // Retourne tous les projets si la catégorie est "Tous"
  } else {
    return projectsData.filter(
      (project) => project.category.name === categoryName // Retourne les projets correspondant à la catégorie spécifiée
    );
  }
}


// Fonction pour afficher les projets dans la galerie
function afficherProjets(projects) {
  const sectionGallery = document.querySelector("section .gallery"); // selection de la balise parent

    sectionGallery.innerHTML = ""; // Effacer les projets actuellement affichés
    // Parcourir les projets et créer les éléments HTML correspondants
    projects.forEach((project) => {
      const galleryFigure = document.createElement("figure");
      const imageProject = document.createElement("img");
      const titleProject = document.createElement("figcaption");

      imageProject.src = project.imageUrl; // Définir l'URL de l'image
      imageProject.alt = project.title; // Définir l'attribut alt de l'image
      titleProject.innerText = project.title; // Définir le texte du titre du projet

      // rattachement des elements créés au document HTML (ajout des enfants)
      sectionGallery.appendChild(galleryFigure);
      galleryFigure.appendChild(imageProject);
      galleryFigure.appendChild(titleProject);
    });
  }


  
  //


// Vérifier si l'utilisateur est connecté, si connecté :
if (localStorage.getItem("token")) {
  // remplacement du lien login par le lien logout
  const loginLink = document.querySelector("nav ul li:nth-child(3) a");
  loginLink.textContent = "Logout";

  // Ajout d'un gestionnaire d'événements pour le clic sur le lien Logout
  loginLink.addEventListener("click", function (event) {
    event.preventDefault(); // Bloquer le comportement de redirection par défaut

    // Supprimer les données du localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Rediriger vers la page de connexion ou une autre page
    window.location.href = "index.html";
  });

  // ne plus afficher les filtres
  const sectionFilter = document.querySelector("section .filters");
  sectionFilter.style.display = "none";

  // création du bouton pour modifier les projets pour ouvrir la modale
  const modifyProject = document.querySelector("#portfolio h2");
  const editButton = document.createElement("div");
  editButton.innerHTML = `
    <a href="#modal1" class="modifyProject modal-link">
      <i class="fa-regular fa-pen-to-square"></i>
      <span class="modifyText">modifier</span>
    </a>
  `;
  modifyProject.appendChild(editButton);

  // création du bouton pour modifier en dessous de l'image de profil
  const modifyProject1 = document.querySelector("#introduction figure");
  const editButton1 = document.createElement("div");
  editButton1.innerHTML = `
    <a href="#modal2" class="modifyProfil">
      <i class="fa-regular fa-pen-to-square"></i>
      <span class="modifyText">modifier</span>
    </a>
  `;
  modifyProject1.appendChild(editButton1);

  // création du mode édition et du bouton publier les changements
  const body = document.querySelector("body");
  const editButton2 = document.createElement("div");
  editButton2.classList.add("edit");
  editButton2.innerHTML = `
    <a href="#modal" class="edition">
    <span>  
    <i class="fa-regular fa-pen-to-square"></i>
      Mode édition
      </span>
      <span class="publish"> publier les changements </span>
    </a>
  `;
  body.insertBefore(editButton2, body.firstChild);
}


  ///modale

  let modal = null;
  const openModal = function(e) {
    e.preventDefault() // le clic sur le lien  ne fonctionne pas normalement
    const target = document.querySelector(this.getAttribute("href"))
    target.style.display = null //affichage de la modale
    target.removeAttribute("aria-hidden") // la modale redevient visible
    target.setAttribute("aria-modal", "true") // contenu consutable
    modal = target
    modal.addEventListener("click", closeModal)
    modal.querySelector(".close-modal").addEventListener("click", closeModal);
    modal.querySelector(".stop-modal").addEventListener("click", stopPropagation);
  }

const closeModal= function(e){
  if (modal === null) return
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal)
  modal.querySelector(".close-modal").addEventListener("click", closeModal);
  modal.querySelector(".stop-modal").removeEventListener("click", stopPropagation);
  modal = null
}

const stopPropagation = function (e) { // empecher la propagation de l'evenement dans les elements parents, empeche le close modal lors du clic dans la modale
  e.stopPropagation()
}

document.querySelectorAll(".modal-link").forEach(a => { // pour chaque click appliquer la fonction openModal
  a.addEventListener("click", openModal)
})




// Récupération des projets des travaux via API/works + réponse mise au format JSON
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((projectsModal) => {
    // Stockage des projets dans la variable
    afficherProjetsModal(projectsModal); // Afficher tous les projets initialement
  });

// Fonction pour afficher les projets dans la galerie dans la modale
function afficherProjetsModal(projectsModal) {
  const divModal = document.querySelector("div.modal-wrapper .afficherProjetsModal"); // sélection de la balise parent

  divModal.innerHTML = ""; // Effacer les projets actuellement affichés
  // Parcourir les projets et créer les éléments HTML correspondants
  projectsModal.forEach((project) => {
    const divModalFigure = document.createElement("figure");
    const imageProject = document.createElement("img");
    const titleProject = document.createElement("p");
    const butonDelete = document.createElement("i");
    const editIcon = document.createElement("i");

    imageProject.src = project.imageUrl; // Définir l'URL de l'image
    imageProject.alt = project.title; // Définir l'attribut alt de l'image
    titleProject.innerText = "éditer";
    butonDelete.className = "fa-solid fa-trash-can";
    editIcon.className = "fa-solid fa-arrows-up-down-left-right";
    editIcon.style.display = "none"; // Masquer l'icône par défaut

    // rattachement des elements créés au document HTML (ajout des enfants)
    divModal.appendChild(divModalFigure);
    divModalFigure.appendChild(imageProject);
    divModalFigure.appendChild(titleProject);
    divModalFigure.appendChild(butonDelete);
    divModalFigure.appendChild(editIcon);

    divModalFigure.addEventListener("mouseover", function () {
      editIcon.style.display = "flex"; // Afficher l'icône lors du passage de la souris
      });

    divModalFigure.addEventListener("mouseout", function () {
      editIcon.style.display = "none"; // Masquer l'icône lorsque la souris quitte l'élément
      });

    // supprimer les travaux avec la requete delete
    butonDelete.addEventListener("click", () => {
      deleteProject(project.id);
      });
    });
  }


// Fonction pour supprimer un projet
function deleteProject(projectId) {

  const token = window.localStorage.getItem("token");

  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      accept: "*/*",
      Authorization: `bearer ${token}`,
    }
  })
    .then((response) => {
      if (response.ok) {
        console.log("Projet supprimé");
        // Mettre à jour la liste des projets dans la modale (appeler à nouveau la fonction afficherProjetsModal)
        fetch("http://localhost:5678/api/works")
          .then((response) => response.json())
          .then((projectsModal) => {
            afficherProjets(projectsModal)
            afficherProjetsModal(projectsModal);
          });
      } else {
        console.log("Erreur lors de la suppression du projet");
      }
    })
    .catch((error) => console.log(error));
}



// passer sur la modale ajouter un projet
const butonAddPicture = document.getElementById("add-picture")
butonAddPicture.addEventListener("click", (e) =>{
const modalAddPicture = document.querySelector(".js-modal-wrapper-add-picture");
modalAddPicture.style.display = "flex";
const modalWrapper = document.querySelector(".js-modal-wrapper")
modalWrapper.style.display = "none"
});



// Fonction pour revenir à la première modale
const returnToFirstModal = function () {
  const modalAddPicture = document.querySelector(".js-modal-wrapper-add-picture");
  modalAddPicture.style.display = "none"; // Cacher la deuxième modale
  const modalWrapper = document.querySelector(".js-modal-wrapper");
  modalWrapper.style.display = "flex"; // Afficher la première modale
};


const buttonReturn = document.querySelector(".fa-arrow-left");
buttonReturn.addEventListener("click", (e) => {
  e.preventDefault();
  returnToFirstModal();
  stopPropagation(e);
});

// Gestionnaire d'événement pour le clic à l'intérieur de la deuxième modale
const modalAddPicture = document.querySelector(".js-modal-wrapper-add-picture");
modalAddPicture.addEventListener("click", stopPropagation);

// Gestionnaire d'événement pour le clic sur le bouton de fermeture de la deuxième modale
const closeButton = document.querySelector(".js-modal-wrapper-add-picture .close-modal");
closeButton.addEventListener("click", closeModal);





const input = document.getElementById("addpicture");
const imagePreview = document.getElementById("imagePreview");
const titleInput = document.getElementById("titre");
const categoryInput = document.getElementById("categorie");
const submitButton = document.querySelector("input[type='submit'][value='Valider']");

function checkFormValidity() {
  // Vérifiez si toutes les conditions sont remplies
  const isImageSelected = input.files.length > 0;
  const isTitleFilled = titleInput.value.trim() !== "";
  const isCategoryChosen = categoryInput.value !== "";

  // Activez le bouton "Valider" si toutes les conditions sont remplies, sinon désactivez-le
  if (isImageSelected && isTitleFilled && isCategoryChosen) {
    submitButton.removeAttribute("disabled");
    submitButton.style.backgroundColor = "#1D6154"; // Changez la couleur du background du bouton ici
  } else {
    submitButton.setAttribute("disabled", "disabled");
    submitButton.style.backgroundColor = ""; // Réinitialisez la couleur du background du bouton ici
  }
}

input.addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // Mettre à jour la source de l'image avec les données de l'image sélectionnée
      imagePreview.src = reader.result;
      imagePreview.style.display = "block"; // Affichez l'image prévisualisée

      // masquer le libellé après avoir choisi une image
      const label = input.previousElementSibling;
      label.style.display = "none";

      // Masquer l'icône et le paragraphe
      const icon = document.querySelector(".addpicture i.fa-image");
      const paragraph = document.querySelector(".addpicture p");
      icon.style.display = "none";
      paragraph.style.display = "none";

      checkFormValidity(); // Vérifiez la validité du formulaire après la sélection de l'image
    });

    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "#"; // Réinitialisez la source de l'image si aucun fichier n'est sélectionné
    imagePreview.style.display = "none"; // Cachez l'image prévisualisée si aucun fichier n'est sélectionné

    // Affichez à nouveau le libellé si aucun fichier n'est sélectionné
    const label = input.previousElementSibling;
    label.style.display = "block";

    // afficher à nouveau l'icône et le paragraphe
    const icon = document.querySelector(".addpicture i.fa-image");
    const paragraph = document.querySelector(".addpicture p");
    icon.style.display = "block";
    paragraph.style.display = "block";

    checkFormValidity(); // Vérifiez la validité du formulaire si l'image est désélectionnée
  }

  // Appelez la fonction checkFormValidity() après le chargement d'une image
  checkFormValidity();
});

titleInput.addEventListener("input", checkFormValidity);
categoryInput.addEventListener("input", checkFormValidity);





const submitButtonValider = document.querySelector("input[type='submit'][value='Valider']");

const form = document.querySelector(".bloc-add-pictures");
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Empêcher la soumission du formulaire par défaut
  addWork(); // Appeler la fonction addWork() ici
});




// ajouter un projet dans la modale
function addWork(){
  
    const formData = new FormData();

    const title = document.getElementById("titre").value;
    const categoryId = document.getElementById("categorie").value;

    formData.append("title", title);
    formData.append("image", document.getElementById("addpicture").files[0]);
    formData.append("category", categoryId);
    formData.append("userId", sessionStorage.getItem("userId"));

    console.log("Titre:", title);
    console.log("Catégorie:", categoryId);
    console.log("Image:", formData.get("image"));

    const token = window.localStorage.getItem("token");
    console.log("token:",token)

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        accept: "application/json",
        Authorization: `bearer ${token}`
      
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur de la requete");
        } else {
          return response.json();
        }
      })

      .then((newProject) => {
        console.log("Nouveau projet ajouté :", newProject);
        fetAndUpdateProjects();
      })

      .catch((error) => {
        console.error("Erreur", error);
      });
  }


  // fonction de mise à jour de la galerie et de la modale avec le nouveau projet ajouté
  function fetAndUpdateProjects(){

    fetch("http://localhost:5678/api/works") // Récupération de tous les projets
      .then((response) => response.json())
      .then((projectsModal) => {
        afficherProjets(projectsModal); // Afficher tous les projets dans la galerie principale
        afficherProjetsModal(projectsModal); // Afficher tous les projets dans la galerie modale
      });
  }
