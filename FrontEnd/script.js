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
  });

// Fonction pour supprimer un projet
function deleteProject(projectId) {

  const token = window.localStorage.getItem("token");

  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
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
            afficherProjets(projectsModal);
          });
      } else {
        console.log("Erreur lors de la suppression du projet");
      }
    })
    .catch((error) => console.log(error));
}



