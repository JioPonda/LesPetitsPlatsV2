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

// Base
const searchBar = document.querySelector("#searchbar");
const searchBarAppareils = document.getElementById("appareils");
const searchBarUstensiles = document.getElementById("ustensiles");
const recipesContainer = document.querySelector(".all-card-container");
const filteredCardContainer = document.querySelector(
  ".filtered-card-container"
);
const errorMessage = document.querySelector("#error-search");

/**** Recherche dans la barre de recherche principal ****/
function searchAlgo() {
  let filteredCardArray = [];
  const searchDish = searchBar.value.toLowerCase();
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
}

/**** Recherche par Tag ****/
function searchByTagAlgo() {
  const searchDish = searchBar.value.toLowerCase();
  const filteredCardContainer = document.querySelector(
    ".filtered-card-container"
  );
  const errorMessage = document.querySelector("#error-search");
  const recipesContainer = document.querySelector(".all-card-container");
  const searchTags = tagArray.map((tag) => tag.toLowerCase());
  // recherche par tag uniquement
  if (searchDish.length === 0) {
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
  // Recherche par tag en fonction de la recherche de la bar principal
  if (searchDish.length >= 3 && tagArray.length > 0) {
    filteredCardArray = filteredCardArray.filter((card) => {
      return searchTags.every((tag) => {
        return (
          card.name.toLowerCase().includes(tag) ||
          card.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(tag)
          ) ||
          card.appliance.toLowerCase().includes(tag) ||
          card.ustensils.some((ustensil) =>
            ustensil.toLowerCase().includes(tag)
          )
        );
      });
    });
    filteredCardContainer.innerHTML = "";
    filteredCardArray.forEach((recipe) => {
      const filteredCard = filteredCardFactory(recipe);
      const filteredCardDOM = filteredCard.getFilteredCardDOM();
      filteredCardContainer.appendChild(filteredCardDOM);
    });

    if (filteredCardArray.length === 0) {
      errorMessage.style.display = "block";
      filteredCardContainer.innerHTML = "";
    } else {
      errorMessage.style.display = "none";
    }
  }

  if (searchTags.length >= 1) {
    recipesContainer.style.display = "none";
    filteredCardContainer.style.display = "grid";
  } else {
    recipesContainer.style.display = "grid";
    filteredCardContainer.style.display = "none";
    errorMessage.style.display = "none";
  }
  if (searchTags.length < 1) {
    filteredCardContainer.innerHTML = "";
    searchAlgo();
    console.log("ici");
  }
}

/**** Fonction pour mettre à jour les résultats de recherche après la suppression d'un tag ****/
function updateFilteredResults() {
  filteredCardArray = [];
  const searchDish = searchBar.value.toLowerCase();
  const filteredCardContainer = document.querySelector(
    ".filtered-card-container"
  );
  const errorMessage = document.querySelector("#error-search");

  getRecipes().then((data) => {
    const recipesList = data.recipes;
    let filteredRecipes = recipesList;

    if (tagArray.length > 0) {
      // Filtrer les recettes en fonction des tags restants
      filteredRecipes = recipesList.filter((recipe) => {
        return tagArray.every((tag) => {
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
    }

    if (searchDish.length >= 3) {
      // Filtrer les recettes en fonction du terme de recherche principal
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return recipe.name.toLowerCase().includes(searchDish);
      });
    }

    filteredCardArray = filteredRecipes.map((recipe) =>
      filteredCardFactory(recipe)
    );

    // Mise à jour de la liste des cartes filtrées
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
}

/**** Event listner pour la barre de recherche principale ****/
searchBar.addEventListener("keyup", function () {
  const searchDish = searchBar.value.toLowerCase();
  if (searchDish.length >= 3) {
    filteredCardContainer.innerHTML = "";
    searchAlgo();
    console.log("ici");
  } else {
    recipesContainer.style.display = "grid";
    filteredCardContainer.style.display = "none";
    errorMessage.style.display = "none";
    filteredCardArray = [];
  }
});

/*************************************************/
/************** SUPRESSION DES TAGS  *************/
/*************************************************/

function removeTag(tagText) {
  const searchBar = document.querySelector("#searchbar");
  const searchDish = searchBar.value.toLowerCase();
  const tag = document.getElementById("tag-liste");
  const tagIngredient = tag.getElementsByClassName("tag-ingredient");
  const tagAppareils = tag.getElementsByClassName("tag-appareil");
  const tagUstensiles = tag.getElementsByClassName("tag-ustensile");

  for (let i = 0; i < tagIngredient.length; i++) {
    const tagElement = tagIngredient[i].getElementsByTagName("p")[0];
    if (tagElement.textContent.toLowerCase() === tagText) {
      tag.removeChild(tagIngredient[i]);
      tagArray = tagArray.filter((tag) => tag !== tagText);
    }
  }

  for (let i = 0; i < tagAppareils.length; i++) {
    const tagElement = tagAppareils[i].getElementsByTagName("p")[0];
    if (tagElement.textContent.toLowerCase() === tagText) {
      tag.removeChild(tagAppareils[i]);
      tagArray = tagArray.filter((tag) => tag !== tagText);
    }
  }

  for (let i = 0; i < tagUstensiles.length; i++) {
    const tagElement = tagUstensiles[i].getElementsByTagName("p")[0];
    if (tagElement.textContent.toLowerCase() === tagText) {
      tag.removeChild(tagUstensiles[i]);
      tagArray = tagArray.filter((tag) => tag !== tagText);
    }
  }

  if (searchDish.length >= 3) {
    filteredCardContainer.innerHTML = "";
    searchByTagAlgo();
  } else {
    filteredCardContainer.innerHTML = "";
    searchAlgo();
  }

  // Mise à jour des résultats de recherche après la suppression d'un tag
  updateFilteredResults();
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
  const searchBarIngredient = document.getElementById("ingredient");
  const suggestionIngredients = document.getElementById(
    "suggestions-ingredient"
  );
  suggestionIngredients.innerHTML = "";

  let searchIngredient = searchBarIngredient.value.toLowerCase();

  if (searchIngredient === "") {
    matchingIngredients = ingredientsList;
  } else {
    matchingIngredients = ingredientsList.filter((ingredient) => {
      return ingredient.includes(searchIngredient);
    });
  }

  matchingIngredients.forEach((ingredient) => {
    const pIngredient = document.createElement("p");
    pIngredient.textContent = ingredient;
    pIngredient.setAttribute("id", "pIngredient");
    suggestionIngredients.appendChild(pIngredient);
    // Reste du code pour ajouter les tags et les événements click
  });

  const pIngredients = suggestionIngredients.querySelectorAll("p");

  searchBarIngredient.addEventListener("keyup", function () {
    let searchIngredient = searchBarIngredient.value.toLowerCase();

    if (searchIngredient === "") {
      displayIngredients(ingredientsList);
    } else {
      matchingIngredients = ingredientsList.filter((ingredient) => {
        return ingredient.includes(searchIngredient);
      });

      pIngredients.forEach((p) => {
        if (matchingIngredients.includes(p.textContent)) {
          p.style.display = "block";
        } else {
          p.style.display = "none";
        }
      });
    }
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
  const searchBarAppareils = document.getElementById("appareils");
  const suggestionAppareils = document.getElementById("suggestions-appareils");
  suggestionAppareils.innerHTML = "";

  let searchAppliance = searchBarAppareils.value.toLowerCase();

  if (searchAppliance === "") {
    matchingAppareils = applianceList;
  } else {
    matchingAppareils = applianceList.filter((appliance) => {
      return appliance.includes(searchAppliance);
    });
  }

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

    if (searchAppliance === "") {
      displayAppliance(applianceList);
    } else {
      matchingAppareils = applianceList.filter((appliance) => {
        return appliance.includes(searchAppliance);
      });

      pAppareils.forEach((p) => {
        if (matchingAppareils.includes(p.textContent)) {
          p.style.display = "block";
        } else {
          p.style.display = "none";
        }
      });
    }
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
    let matchingUstensils;

    if (searchUstensil === "") {
      matchingUstensils = ustensilsList;
    } else {
      matchingUstensils = ustensilsList.filter((ustensil) => {
        return ustensil.includes(searchUstensil);
      });
    }

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

      if (searchUstensil === "") {
        displayUstensiles();
      } else {
        matchingUstensils = ustensilsList.filter((ustensil) => {
          return ustensil.includes(searchUstensil);
        });

        pUstensils.forEach((p) => {
          if (matchingUstensils.includes(p.textContent)) {
            p.style.display = "block";
          } else {
            p.style.display = "none";
          }
        });
      }
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
