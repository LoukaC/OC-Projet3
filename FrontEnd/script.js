// Récupération des projets des travaux via API/works + réponse mise au format json
fetch("http://localhost:5678/api/works")
  .then((reponse) => reponse.json())
  //.then((reponse2) => console.log(reponse2))
  .then((projects) => {

    for (let i = 0; i < projects.length; i++) {
      // Création de la constante projet contenant la liste des projets
      const project = projects[i];

      // Création de la balise figure
      const galleryFigure = document.createElement("figure");

      // Création de la balise image + affectation du lien au src de la balise img
      const imageProject = document.createElement("img");
      imageProject.src = project.imageUrl;
      imageProject.alt = project.title;

      // Création de la balise p + affectation du titre des projets
      const titleProject = document.createElement("figcaption");
      titleProject.innerText = project.title;

      // rattachement des elements créés au document HTML (selection de la balise parent + ajout des enfants)
      const sectionGallery = document.querySelector("section .gallery");
      sectionGallery.appendChild(galleryFigure);
      galleryFigure.appendChild(imageProject);
      galleryFigure.appendChild(titleProject);
    }

})



// Récupération des catégories via API/works + réponse mise au format json
fetch("http://localhost:5678/api/categories")
  .then((reponse) => reponse.json())
  //.then((reponse2) => console.log(reponse2))
  .then((categories) => {

    // Création de la balise button Tous + affectation du nom du filtre
    const buttonFilterTous = document.createElement("button");
    buttonFilterTous.classList.add("buttonTous")
    buttonFilterTous.innerText = "Tous";

    // rattachement des elements créés au document HTML (selection de la balise parent + ajout des enfants)
    const sectionFilter = document.querySelector("section .filters");
    sectionFilter.appendChild(buttonFilterTous);

    for (let i = 0; i < categories.length; i++) {
      // Création de la constante categorie contenant la liste des catégories des projets
      const categorie = categories[i];

      // Création de la balise button + affectation du nom du filtre
      const buttonFilter = document.createElement("button");
      buttonFilter.innerText = categorie.name;
      buttonFilter.setAttribute("id", categorie.name)
      

      // rattachement des elements créés au document HTML (selection de la balise parent + ajout des enfants)
      const sectionFilter = document.querySelector("section .filters");
      sectionFilter.appendChild(buttonFilter);
      
      
      
      //selection de la balise avec Id + ajout evenement au clic du filtrage des projets
      
      const buttonFilterObjects = document.getElementsById(categorie.name);
      buttonFilterObjects.addEventListener("click", function () {
        const projetsfiltrees = projects.filter(function(project))
        return project.category.name === categorie.name // va comparer la valeur de category.name de chaque projet à la valeur categorie.name, si valeurs identique alors le projet est affiché
     })
    }
  })
