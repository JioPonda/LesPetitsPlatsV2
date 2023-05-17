/*************************************************/
/********** RECUPERATION DES DONEES **************/
/*************************************************/

async function getRecipes() {
  const res = await fetch("JS/recipes.json");
  const data = await res.json();
  return { recipes: data.recipes };
}

/*************************************************/
/***** FACTORY POUR LA CREACTION DE LA CARD ******/
/*************************************************/

function filteredCardFactory(data) {
  const {
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
  } = data;
  const clock = "assets/clock.png";

  function getFilteredCardDOM() {
    /** Squelette de la card */
    const filteredCard = document.createElement("article");
    filteredCard.setAttribute("class", "filtered-card");
    const filteredGreyZone = document.createElement("div");
    filteredGreyZone.setAttribute("class", "filtered-grey-zone");
    const filteredCardInfos = document.createElement("div");
    filteredCardInfos.setAttribute("class", "filtered-card-infos");
    const filteredRecipes = document.createElement("div");
    filteredRecipes.setAttribute("class", "filtered-recipes");
    const filteredDescription = document.createElement("div");
    filteredDescription.setAttribute("class", "filtered-description");
    /** texte de la card */
    const filteredCardTitle = document.createElement("h2");
    filteredCardTitle.setAttribute("class", "filtered-card-title");
    filteredCardTitle.textContent = name;
    const filteredTime = document.createElement("div");
    filteredTime.setAttribute("class", "filtered-div-time");
    const filteredCardClock = document.createElement("img");
    filteredCardClock.setAttribute("class", "filtered-card-clock");
    filteredCardClock.setAttribute("src", clock);
    const filteredCardTime = document.createElement("p");
    filteredCardTime.setAttribute("class", "filtered-card-time");
    filteredCardTime.textContent = time + "min";
    const filteredCardSpan = document.createElement("span");
    filteredCardSpan.setAttribute("class", "filtered-span-ingredient");
    ingredients.forEach((ingredient) => {
      if (ingredient.unit === " " && ingredient.quantity === " ") {
        const filteredCardIngredient = document.createElement("p");
        filteredCardIngredient.setAttribute(
          "class",
          "filtered-card-ingredient"
        );
        filteredCardIngredient.innerHTML =
          filteredCardIngredient.textContent + ingredient.ingredient;
        filteredCardSpan.appendChild(filteredCardIngredient);
      } else {
        const filteredCardIngredient = document.createElement("p");
        filteredCardIngredient.setAttribute(
          "class",
          "filtered-card-ingredient"
        );
        filteredCardIngredient.innerHTML =
          filteredCardIngredient.textContent +
          ingredient.ingredient +
          " : " +
          ingredient.quantity +
          " " +
          ingredient.unit;
        filteredCardSpan.appendChild(filteredCardIngredient);
      }
    });
    const filteredcardDescription = document.createElement("p");
    filteredcardDescription.setAttribute("class", "filtered-card-description");
    filteredcardDescription.textContent = description;

    filteredCard.appendChild(filteredGreyZone);
    filteredCard.appendChild(filteredCardInfos);
    filteredCardInfos.appendChild(filteredRecipes);
    filteredRecipes.appendChild(filteredCardTitle);
    filteredRecipes.appendChild(filteredCardSpan);
    filteredCardInfos.appendChild(filteredDescription);
    filteredTime.appendChild(filteredCardClock);
    filteredTime.appendChild(filteredCardTime);
    filteredDescription.appendChild(filteredTime);
    filteredDescription.appendChild(filteredcardDescription);

    return filteredCard;
  }

  return {
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
    getFilteredCardDOM,
  };
}

/*************************************************/
/*******  ALGORYTHME DE RECHERCHE V1 *************/
/*************************************************/

// Tableau contenant les card crée après une cherche
let filteredCardArray = [];

// Tableau contenant les tags crée
let tagArray = [];

function searchAlgo() {
  // Base
  const searchBar = document.querySelector("#searchbar");
  const searchBarAppareils = document.getElementById("appareils");
  const searchBarUstensiles = document.getElementById("ustensiles");
  const recipesContainer = document.querySelector(".all-card-container");
  const filteredCardContainer = document.querySelector(
    ".filtered-card-container"
  );
  const errorMessage = document.querySelector("#error-search");

  // Event listner
  searchBar.addEventListener("keyup", function () {
    const searchDish = searchBar.value.toLowerCase().trim();
    if (searchDish.length >= 3) {
      recipesContainer.style.display = "none";
      filteredCardContainer.style.display = "grid";
      getRecipes().then((data) => {
        const recipesList = data.recipes;
        const filteredRecipes = recipesList.filter((recipe) => {
          // Rechercher le terme dans le nom de la recette, le nom de l'ingrédient,
          // le nom de l'appareil et le nom de l'ustensile
          return (
            recipe.name.toLowerCase().includes(searchDish) ||
            recipe.ingredients.some((ingredient) =>
              ingredient.ingredient.toLowerCase().includes(searchDish)
            ) ||
            recipe.appliance.toLowerCase().includes(searchDish) ||
            recipe.ustensils.some((ustensil) =>
              ustensil.toLowerCase().includes(searchDish)
            )
          );
        });
        filteredCardArray = filteredRecipes.map((recipe) =>
          filteredCardFactory(recipe)
        );
        console.log(filteredCardArray);
        // Supprimer les anciennes cartes de la grille de cartes filtrées
        filteredCardContainer.innerHTML = "";
        // Créer de nouvelles cartes pour chaque recette filtrée
        filteredRecipes.forEach((recipe) => {
          const filteredCard = filteredCardFactory(recipe);
          const filteredCardDOM = filteredCard.getFilteredCardDOM();
          filteredCardContainer.appendChild(filteredCardDOM);
        });
        // Afficher un message d'erreur si aucune recette ne correspond à la recherche
        if (filteredRecipes.length === 0) {
          errorMessage.style.display = "block";
          filteredCardArray = [];
        } else {
          errorMessage.style.display = "none";
        }
      });
    } else {
      recipesContainer.style.display = "grid";
      filteredCardContainer.style.display = "none";
      errorMessage.style.display = "none";
      filteredCardArray = [];
    }
  });
}

function searchByTagAlgo() {
  const filteredCardContainer = document.querySelector(
    ".filtered-card-container"
  );
  const errorMessage = document.querySelector("#error-search");
  const recipesContainer = document.querySelector(".all-card-container");
  const searchTags = tagArray.map((tag) => tag.toLowerCase().trim());

  getRecipes().then((data) => {
    const recipesList = data.recipes;
    const filteredRecipes = recipesList.filter((recipe) => {
      return searchTags.every((tag) => {
        return (
          recipe.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(tag)
          ) ||
          recipe.appliance.toLowerCase().includes(tag) ||
          recipe.ustensils.some((ustensil) =>
            ustensil.toLowerCase().includes(tag)
          )
        );
      });
    });

    filteredCardContainer.innerHTML = "";
    filteredRecipes.forEach((recipe) => {
      const filteredCard = filteredCardFactory(recipe);
      const filteredCardDOM = filteredCard.getFilteredCardDOM();
      filteredCardContainer.appendChild(filteredCardDOM);
    });

    if (filteredRecipes.length === 0) {
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
    }
  });

  if (searchTags.length >= 1) {
    recipesContainer.style.display = "none";
    filteredCardContainer.style.display = "grid";
  } else {
    recipesContainer.style.display = "grid";
    filteredCardContainer.style.display = "none";
    errorMessage.style.display = "none";
  }
}

/*************************************************/
/************** SUPRESSION DES TAGS  *************/
/*************************************************/

function removeTag(tagText) {
  const tag = document.getElementById("tag-liste");
  const tagIngredient = tag.getElementsByClassName("tag-ingredient");
  const tagAppareils = tag.getElementsByClassName("tag-appareil");
  const tagUstensiles = tag.getElementsByClassName("tag-ustensile");

  for (let i = 0; i < tagIngredient.length; i++) {
    const tagElement = tagIngredient[i].getElementsByTagName("p")[0];
    if (tagElement.textContent.toLowerCase() === tagText) {
      tag.removeChild(tagIngredient[i]);
      tagArray.splice(i, 1); // Supprimer le tag du tableau tagArray
      break;
    }
  }

  for (let i = 0; i < tagAppareils.length; i++) {
    const tagElement = tagAppareils[i].getElementsByTagName("p")[0];
    if (tagElement.textContent.toLowerCase() === tagText) {
      tag.removeChild(tagAppareils[i]);
      tagArray.splice(i, 1); // Supprimer le tag du tableau tagArray
      break;
    }
  }

  for (let i = 0; i < tagUstensiles.length; i++) {
    const tagElement = tagUstensiles[i].getElementsByTagName("p")[0];
    if (tagElement.textContent.toLowerCase() === tagText) {
      tag.removeChild(tagUstensiles[i]);
      tagArray.splice(i, 1); // Supprimer le tag du tableau tagArray
      break;
    }
  }
}

/*************************************************/
/**** RECHERCHE DANS LA BARRE DES INGREDIENTS ****/
/*************************************************/

function getIngredients() {
  return getRecipes().then((data) => {
    const ingredientsArray = [];
    data.recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        ingredientsArray.push(ingredient);
      });
    });
    const ingredientsArray2 = ingredientsArray.map((ingredient) =>
      ingredient.ingredient.toLowerCase()
    );
    const ingredientsList = ingredientsArray2.filter(
      (x, i) => ingredientsArray2.indexOf(x) === i
    );
    return ingredientsList;
  });
}

function displayIngredients(ingredientsList) {
  const suggestionIngredients = document.getElementById(
    "suggestions-ingredient"
  );
  suggestionIngredients.innerHTML = "";
  const searchBarIngredient = document.getElementById("ingredient");
  let searchIngredient = searchBarIngredient.value.toLowerCase();

  // Créer une nouvelle liste d'ingrédients correspondant à la recherche
  let matchingIngredients = ingredientsList.filter((ingredient) => {
    return ingredient.includes(searchIngredient);
  });

  matchingIngredients.forEach((ingredient) => {
    const pIngredient = document.createElement("p");
    pIngredient.textContent = ingredient;
    pIngredient.setAttribute("id", "pIngredient");
    suggestionIngredients.appendChild(pIngredient);
    pIngredient.addEventListener("click", function () {
      const pIngredientsText = pIngredient.textContent;
      if (!tagArray.includes(pIngredientsText.toLowerCase())) {
        const tag = document.getElementById("tag-liste");
        const divTag = document.createElement("div");
        divTag.setAttribute("class", "tag-ingredient");
        const iTag = document.createElement("p");
        iTag.setAttribute("class", "text-ingredient-tag");
        iTag.textContent = pIngredientsText;
        const crossTag = document.createElement("i");
        crossTag.setAttribute("class", "fa-regular fa-circle-xmark");
        crossTag.addEventListener("click", function () {
          removeTag(pIngredientsText.toLowerCase());
          searchByTagAlgo();
        });
        divTag.appendChild(iTag);
        divTag.appendChild(crossTag);
        tag.appendChild(divTag);
        tagArray.push(pIngredientsText.toLowerCase());
        searchByTagAlgo();
        console.log(tagArray);
      }
    });
  });

  const pIngredients = suggestionIngredients.querySelectorAll("p");

  searchBarIngredient.addEventListener("keyup", function () {
    let searchIngredient = searchBarIngredient.value.toLowerCase();

    // Recréer la liste d'ingrédients correspondant à la recherche
    let matchingIngredients = ingredientsList.filter((ingredient) => {
      return ingredient.includes(searchIngredient);
    });

    // Afficher uniquement les éléments de la liste correspondant à la recherche
    pIngredients.forEach((p) => {
      if (matchingIngredients.includes(p.textContent)) {
        p.style.display = "block";
      } else {
        p.style.display = "none";
      }
    });
  });
}

function ingredientSearch() {
  const divIngredient = document.getElementById("suggestions-ingredient");
  divIngredient.style.display = "grid";
  const chevronIngredient = document.querySelector(".chevron-ingredients");
  chevronIngredient.style.transform = "rotate(180deg)";

  getIngredients().then((ingredientsList) => {
    displayIngredients(ingredientsList);
  });
}

/*************************************************/
/**** RECHERCHE DANS LA BARRE DES APPAREILS ****/
/*************************************************/

function getAppliance() {
  return getRecipes().then((data) => {
    const applianceArray = [];
    data.recipes.forEach((recipe) => {
      applianceArray.push(recipe.appliance.toLowerCase());
    });
    const applianceList = applianceArray.filter(
      (x, i) => applianceArray.indexOf(x) === i
    );
    return applianceList;
  });
}

function displayAppliance(applianceList) {
  const suggestionAppareils = document.getElementById("suggestions-appareils");
  suggestionAppareils.innerHTML = "";
  const searchBarAppareils = document.getElementById("appareils");
  let searchAppliance = searchBarAppareils.value.toLowerCase();

  // Créer une nouvelle liste d'appareils correspondant à la recherche
  let matchingAppareils = applianceList.filter((appliance) => {
    return appliance.includes(searchAppliance);
  });

  matchingAppareils.forEach((appliance) => {
    const pAppareils = document.createElement("p");
    pAppareils.textContent = appliance;
    pAppareils.setAttribute("id", "pAppareils");
    suggestionAppareils.appendChild(pAppareils);
    pAppareils.addEventListener("click", function () {
      const pApplianceText = pAppareils.textContent;
      if (!tagArray.includes(pApplianceText.toLowerCase())) {
        const tag = document.getElementById("tag-liste");
        const divTag = document.createElement("div");
        divTag.setAttribute("class", "tag-appareil");
        const aTag = document.createElement("p");
        aTag.setAttribute("class", "text-appareil-tag");
        aTag.textContent = pApplianceText;
        const crossTag = document.createElement("i");
        crossTag.setAttribute("class", "fa-regular fa-circle-xmark");
        crossTag.addEventListener("click", function () {
          removeTag(pApplianceText.toLowerCase());
          searchByTagAlgo();
        });
        divTag.appendChild(aTag);
        divTag.appendChild(crossTag);
        tag.appendChild(divTag);
        tagArray.push(pApplianceText.toLowerCase());
        searchByTagAlgo();
        console.log(tagArray);
      }
    });
  });

  const pAppareils = suggestionAppareils.querySelectorAll("p");

  searchBarAppareils.addEventListener("keyup", function () {
    let searchAppliance = searchBarAppareils.value.toLowerCase();

    // Recréer la liste d'appareils correspondant à la recherche
    let matchingAppareils = applianceList.filter((appliance) => {
      return appliance.includes(searchAppliance);
    });

    // Afficher uniquement les éléments de la liste correspondant à la recherche
    pAppareils.forEach((p) => {
      if (matchingAppareils.includes(p.textContent)) {
        p.style.display = "block";
      } else {
        p.style.display = "none";
      }
    });
  });
}

function applianceSearch() {
  const divAppareils = document.getElementById("suggestions-appareils");
  divAppareils.style.display = "grid";
  const chevronAppareils = document.querySelector(".chevron-appareils");
  chevronAppareils.style.transform = "rotate(180deg)";

  getAppliance().then((applianceList) => {
    displayAppliance(applianceList);
  });
}

/*************************************************/
/**** RECHERCHE DANS LA BARRE DES USTENSILES ****/
/*************************************************/

function getUstensils() {
  return getRecipes().then((data) => {
    const ustensilsArray = [];
    data.recipes.forEach((recipe) => {
      recipe.ustensils.forEach((ustensil) => {
        ustensilsArray.push(ustensil);
      });
    });
    // console.log(ustensilsArray);
    const ustensilsList = ustensilsArray.filter(
      (x, i) => ustensilsArray.indexOf(x) === i
    );
    return ustensilsList;
  });
}

function displayUstensiles() {
  const suggestionUstensils = document.getElementById("suggestions-ustensiles");
  suggestionUstensils.innerHTML = "";
  const searchBarUstensiles = document.getElementById("ustensiles");
  let searchUstensil = searchBarUstensiles.value.toLowerCase();

  getUstensils().then((ustensilsList) => {
    // Créer une nouvelle liste d'ustensiles correspondant à la recherche
    let matchingUstensils = ustensilsList.filter((ustensil) => {
      return ustensil.includes(searchUstensil);
    });

    matchingUstensils.forEach((ustensil) => {
      const pUstensils = document.createElement("p");
      pUstensils.textContent = ustensil;
      pUstensils.setAttribute("id", "pUstensils");
      suggestionUstensils.appendChild(pUstensils);
      pUstensils.addEventListener("click", function () {
        const pUstensilText = pUstensils.textContent;
        if (!tagArray.includes(pUstensilText.toLowerCase())) {
          const tag = document.getElementById("tag-liste");
          const divTag = document.createElement("div");
          divTag.setAttribute("class", "tag-ustensile");
          const uTag = document.createElement("p");
          uTag.setAttribute("class", "text-ustensile-tag");
          uTag.textContent = pUstensilText;
          const crossTag = document.createElement("i");
          crossTag.setAttribute("class", "fa-regular fa-circle-xmark");
          crossTag.addEventListener("click", function () {
            removeTag(pUstensilText.toLowerCase());
            searchByTagAlgo();
          });
          divTag.appendChild(uTag);
          divTag.appendChild(crossTag);
          tag.appendChild(divTag);
          tagArray.push(pUstensilText.toLowerCase());
          searchByTagAlgo();
          console.log(tagArray);
        }
      });
    });

    const pUstensils = suggestionUstensils.querySelectorAll("p");

    searchBarUstensiles.addEventListener("keyup", function () {
      let searchUstensil = searchBarUstensiles.value.toLowerCase();

      // Recréer la liste d'ustensils correspondant à la recherche
      let matchingUstensils = ustensilsList.filter((ustensil) => {
        return ustensil.includes(searchUstensil);
      });

      // Afficher uniquement les éléments de la liste correspondant à la recherche
      pUstensils.forEach((p) => {
        if (matchingUstensils.includes(p.textContent)) {
          p.style.display = "block";
        } else {
          p.style.display = "none";
        }
      });
    });
  });
}

function ustensilsSearch() {
  const divUstensiles = document.getElementById("suggestions-ustensiles");
  divUstensiles.style.display = "grid";
  const chevronUstensiles = document.querySelector(".chevron-ustensiles");
  chevronUstensiles.style.transform = "rotate(180deg)";

  getUstensils().then((ustensilsList) => {
    displayUstensiles(ustensilsList);
  });
}

/*************************************************/

/** Initialisation des données des recipes pour la recherche */
async function initSearch() {
  const { recipes } =
    await getRecipes(); /** Récupére les données des récipes avant recherche*/
  /** Apelle des fonctions de rercherche des données des récipes */
  searchAlgo(recipes);
  searchByTagAlgo(recipes);
}

initSearch();

/*************************************************/

/*************************************************/
/** Masquer la liste d'ingrédient */
function hideIngredientList() {
  const divIngredient = document.getElementById("suggestions-ingredient");
  divIngredient.style.display = "none";
  const chevronIngredient = document.querySelector(".chevron-ingredients");
  chevronIngredient.style.transform = "rotate(0)";
  divIngredient.innerHTML = "";
}

/** Masquer la liste d'appareils */
function hideAppareilsList() {
  const divAppareils = document.getElementById("suggestions-appareils");
  divAppareils.style.display = "none";
  const chevronAppareils = document.querySelector(".chevron-appareils");
  chevronAppareils.style.transform = "rotate(0)";
  divAppareils.innerHTML = "";
}

/** Masquer la liste d'ustensiles */
function hideUstensilesList() {
  const divUstensiles = document.getElementById("suggestions-ustensiles");
  divUstensiles.style.display = "none";
  const chevronUstensiles = document.querySelector(".chevron-ustensiles");
  chevronUstensiles.style.transform = "rotate(0)";
  divUstensiles.innerHTML = "";
}

/** Suppression des tags */
function hideTag() {
  let crossedIngredient = document.querySelectorAll("#crossed-ingredient");
  let tagIngredientListe = [];
  let crossedAppareils = document.querySelectorAll("#crossed-appareils");
  let tagAppareilsListe = [];
  let crossedUstensiles = document.querySelectorAll("#crossed-ustensiles");
  let tagUstensilesListe = [];

  for (let crossI = 0; crossI < crossedIngredient.length; crossI++) {
    const tagIngredient = document.querySelectorAll(".tag-ingredient");
    for (let tI = 0; tI < tagIngredient.length; tI++)
      crossedIngredient[crossI].addEventListener("click", function () {
        tagIngredient[tI].remove();
        tagIngredientListe.push(tagIngredient[tI].textContent);
      });
  }

  for (let crossA = 0; crossA < crossedAppareils.length; crossA++) {
    const tagAppareils = document.querySelectorAll(".tag-appareil");
    for (let tA = 0; tA < tagAppareils.length; tA++)
      crossedAppareils[crossA].addEventListener("click", function () {
        tagAppareils[tA].remove();
        tagAppareilsListe.push(tagAppareils[tA].textContent);
      });
  }

  for (let crossU = 0; crossU < crossedUstensiles.length; crossU++) {
    const tagUstensiles = document.querySelectorAll(".tag-ustensile");
    for (let tU = 0; tU < tagUstensiles.length; tU++)
      crossedUstensiles[crossU].addEventListener("click", function () {
        tagUstensiles[tU].remove();
        tagUstensilesListe.push(tagUstensiles[tU].textContent);
      });
  }
}
/*************************************************/
