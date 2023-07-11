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