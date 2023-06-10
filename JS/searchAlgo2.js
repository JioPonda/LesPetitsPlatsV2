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
/*******  ALGORYTHME DE RECHERCHE V2 *************/
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
  const searchDish = searchBar.value.toLowerCase().trim();
  recipesContainer.style.display = "none";
  filteredCardContainer.style.display = "grid";
  getRecipes().then((data) => {
    const recipesList = data.recipes;
    const filteredRecipes = [];
    // Boucle pour parcourir toutes les recettes
    for (let i = 0; i < recipesList.length; i++) {
      const recipe = recipesList[i];
      const { name, ingredients, description } = recipe;
      let isMatching = false;
      // Vérification de la correspondance entre nom de la recette et la recherche
      if (name.toLowerCase().indexOf(searchDish) !== -1) {
        isMatching = true;
      } else {
        // Boucle pour parcourir tous les ingrédients de la recette
        for (let j = 0; j < ingredients.length; j++) {
          const ingredient = ingredients[j].ingredient;
          if (ingredient.toLowerCase().indexOf(searchDish) !== -1) {
            isMatching = true;
            break;
          }
        }
      }
      // Vérification de la correspondance entre entre la description et la recherche
      if (!isMatching && description.toLowerCase().indexOf(searchDish) !== -1) {
        isMatching = true;
      }

      if (isMatching) {
        filteredRecipes.push(recipe);
      }
    }

    filteredCardArray = filteredRecipes.map((recipe) =>
      filteredCardFactory(recipe)
    );

    // Suppression des anciennes cartes de la grille de cartes filtrées
    filteredCardContainer.innerHTML = "";

    // Création de nouvelles cartes pour chaque recette filtrée
    for (let k = 0; k < filteredRecipes.length; k++) {
      const recipe = filteredRecipes[k];
      const filteredCard = filteredCardFactory(recipe);
      const filteredCardDOM = filteredCard.getFilteredCardDOM();
      filteredCardContainer.appendChild(filteredCardDOM);
    }

    // Affichage du message d'erreur si aucune recette ne correspond à la recherche
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
  const searchDish = searchBar.value.toLowerCase().trim();
  const filteredCardContainer = document.querySelector(
    ".filtered-card-container"
  ); // Conteneur des cartes filtrées
  const errorMessage = document.querySelector("#error-search");
  const recipesContainer = document.querySelector(".all-card-container");
  const searchTags = tagArray.map((tag) => tag.toLowerCase());

  // Recherche par tag uniquement
  if (searchDish.length === 0) {
    getRecipes().then((data) => {
      const recipesList = data.recipes;
      const filteredRecipes = [];

      // Filtre des recettes en fonction des tags de recherche
      for (let i = 0; i < recipesList.length; i++) {
        const recipe = recipesList[i];
        const { ingredients, appliance, ustensils, description } = recipe;
        let isValidRecipe = true;

        // Vérification de la présence de chaque tag dans les ingrédients, l'appareil, les ustensiles ou la description
        for (let j = 0; j < searchTags.length; j++) {
          const tag = searchTags[j];

          if (
            !ingredients.some((ingredient) =>
              ingredient.ingredient.toLowerCase().includes(tag)
            ) &&
            !appliance.toLowerCase().includes(tag) &&
            !ustensils.some((ustensil) =>
              ustensil.toLowerCase().includes(tag)
            ) &&
            !description.toLowerCase().includes(tag)
          ) {
            isValidRecipe = false; // Si un tag n'est pas trouvé, la recette n'est pas valide
            break;
          }
        }

        if (isValidRecipe) {
          filteredRecipes.push(recipe); // Ajouter la recette filtrée à la liste des recettes filtrées
        }
      }

      // Affichage des cartes filtrées dans le conteneur
      filteredCardContainer.innerHTML = "";
      for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i];
        const filteredCard = filteredCardFactory(recipe);
        const filteredCardDOM = filteredCard.getFilteredCardDOM();
        filteredCardContainer.appendChild(filteredCardDOM);
      }

      // Affichage du message d'erreur si aucune recette filtrée n'est trouvée
      if (filteredRecipes.length === 0) {
        errorMessage.style.display = "block";
      } else {
        errorMessage.style.display = "none";
      }
    });

    // Affichage des conteneurs appropriés en fonction des tags de recherche
    if (searchTags.length >= 1) {
      recipesContainer.style.display = "none";
      filteredCardContainer.style.display = "grid";
    } else {
      recipesContainer.style.display = "grid";
      filteredCardContainer.style.display = "none";
      errorMessage.style.display = "none";
    }
  }

  // Recherche par tag en fonction de la recherche principale de la barre
  if (searchDish.length >= 3 && tagArray.length > 0) {
    filteredCardArray = filteredCardArray.filter((card) => {
      let isValidCard = true;

      // Vérification de la présence de chaque tag dans le nom, les ingrédients, l'appareil, les ustensiles ou la description de la carte
      for (let i = 0; i < searchTags.length; i++) {
        const tag = searchTags[i];

        if (
          !card.name.toLowerCase().includes(tag) &&
          !card.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(tag)
          ) &&
          !card.appliance.toLowerCase().includes(tag) &&
          !card.ustensils.some((ustensil) =>
            ustensil.toLowerCase().includes(tag)
          ) &&
          !card.description.toLowerCase().includes(tag)
        ) {
          isValidCard = false; // Si un tag n'est pas trouvé, la carte n'est pas valide
          break;
        }
      }

      return isValidCard;
    });

    // Affichage des cartes filtrées dans le conteneur
    filteredCardContainer.innerHTML = "";
    for (let i = 0; i < filteredCardArray.length; i++) {
      const card = filteredCardArray[i];
      const filteredCard = filteredCardFactory(card);
      const filteredCardDOM = filteredCard.getFilteredCardDOM();
      filteredCardContainer.appendChild(filteredCardDOM);
    }

    // Affichage du message d'erreur si aucune carte filtrée n'est trouvée
    if (filteredCardArray.length === 0) {
      errorMessage.style.display = "block";
      filteredCardContainer.innerHTML = "";
    } else {
      errorMessage.style.display = "none";
    }
  }

  // Affichage des conteneurs appropriés en fonction des tags de recherche
  if (searchTags.length >= 1) {
    recipesContainer.style.display = "none";
    filteredCardContainer.style.display = "grid";
  } else {
    recipesContainer.style.display = "grid";
    filteredCardContainer.style.display = "none";
    errorMessage.style.display = "none";
  }

  // Si aucun tag de recherche n'est présent, réinitialiser la recherche principale
  if (searchTags.length < 1) {
    filteredCardContainer.innerHTML = "";
    searchAlgo();
  }
}

/**** Fonction pour mettre à jour les résultats de recherche après la suppression ou l'ajout d'un tag ****/
function updateFilteredResults() {
  filteredCardArray = [];
  const searchDish = searchBar.value.toLowerCase();
  const filteredCardContainer = document.querySelector(
    ".filtered-card-container"
  );
  const errorMessage = document.querySelector("#error-search");

  getRecipes().then((data) => {
    const recipesList = data.recipes;
    let filteredRecipes = [];

    if (tagArray.length > 0) {
      // Filtre des recettes en fonction des tags restants
      for (let i = 0; i < recipesList.length; i++) {
        const recipe = recipesList[i];
        const { ingredients, appliance, ustensils } = recipe;

        // Vérification de la présence de tous les tags dans la recette
        if (
          tagArray.every((tag) => {
            return (
              // Vérification de la présence des tag dans les ingrédients, l'appareil ou les ustensiles
              ingredients.some((ingredient) =>
                ingredient.ingredient.toLowerCase().includes(tag)
              ) ||
              appliance.toLowerCase().includes(tag) ||
              ustensils.some((ustensil) => ustensil.toLowerCase().includes(tag))
            );
          })
        ) {
          filteredRecipes.push(recipe);
        }
      }
    } else {
      // Si aucun tag n'est sélectionné, toutes les recettes sont considérées comme filtrées
      filteredRecipes = recipesList;
    }

    if (searchDish.length >= 3) {
      // Filtre des recettes en fonction du terme de recherche principal
      const searchResults = [];
      for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i];
        // Vérification de la présence des termes de recherche dans le nom, l'appareil, les ustensiles ou la description de la recette
        if (
          recipe.name.toLowerCase().includes(searchDish) ||
          recipe.appliance.toLowerCase().includes(searchDish) ||
          recipe.ustensils.some((ustensil) =>
            ustensil.toLowerCase().includes(searchDish)
          ) ||
          recipe.description.toLowerCase().includes(searchDish)
        ) {
          searchResults.push(recipe);
        }
      }
      filteredRecipes = searchResults;
    }

    // Création d'un tableau de cartes filtrées à partir des recettes filtrées
    filteredCardArray = filteredRecipes.map((recipe) =>
      filteredCardFactory(recipe)
    );

    // Mise à jour de la liste des cartes filtrées dans le DOM
    filteredCardContainer.innerHTML = "";
    filteredCardArray.forEach((recipe) => {
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

// Fonction de débouncing pour rendre la recherche plus fluide visuelement
function debounce(func, delay) {
  let timerId;

  return function () {
    const context = this;
    const args = arguments;
    // Réinitialise le timer à chaque appel de la fonction
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

const searchDelay = 280; // Temps de temporisation en ms

const debouncedSearchBar = debounce(function () {
  const searchDish = searchBar.value.toLowerCase();
  if (searchDish.length >= 3) {
    filteredCardContainer.innerHTML = "";
    searchAlgo();
  } else {
    recipesContainer.style.display = "grid";
    filteredCardContainer.style.display = "none";
    errorMessage.style.display = "none";
    filteredCardArray = [];
  }
  updateFilteredResults();
}, searchDelay);

searchBar.addEventListener("keyup", debouncedSearchBar);

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

  let removed = false; // Variable pour vérifier si un tag a été supprimé

  for (let i = 0; i < tagIngredient.length; i++) {
    const tagElement = tagIngredient[i].getElementsByTagName("p")[0];
    if (
      tagElement.textContent.toLowerCase() === tagText &&
      !tagIngredient[i].removed
    ) {
      tag.removeChild(tagIngredient[i]);
      tagArray = tagArray.filter((tag) => tag !== tagText);
      removed = true;
      break; // Sortie de la boucle après la suppression du tag
    }
    updateFilteredResults();
  }

  if (!removed) {
    // Si le tag n'a pas été supprimé des ingrédients, vérifier les appareils
    for (let i = 0; i < tagAppareils.length; i++) {
      const tagElement = tagAppareils[i].getElementsByTagName("p")[0];
      if (
        tagElement.textContent.toLowerCase() === tagText &&
        !tagAppareils[i].removed
      ) {
        tag.removeChild(tagAppareils[i]);
        tagArray = tagArray.filter((tag) => tag !== tagText);
        removed = true;
        break;
      }
      updateFilteredResults();
    }
  }

  if (!removed) {
    // Si le tag n'a pas été supprimé des ingrédients et des appareils, vérifier les ustensiles
    for (let i = 0; i < tagUstensiles.length; i++) {
      const tagElement = tagUstensiles[i].getElementsByTagName("p")[0];
      if (
        tagElement.textContent.toLowerCase() === tagText &&
        !tagUstensiles[i].removed
      ) {
        tag.removeChild(tagUstensiles[i]);
        tagArray = tagArray.filter((tag) => tag !== tagText);
        break;
      }
      updateFilteredResults();
    }
  }

  if (searchDish.length >= 3) {
    filteredCardContainer.innerHTML = "";
    searchByTagAlgo();
  } else {
    filteredCardContainer.innerHTML = "";
    searchAlgo();
  }

  if (tagArray.length === 0) {
    updateFilteredResults();
  }

  // Mettre à jour les résultats de recherche après la suppression d'un tag
  updateFilteredResults();
  searchByTagAlgo();
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
  const searchBar = document.querySelector("#searchbar");
  const searchDish = searchBar.value.toLowerCase();
  const suggestionIngredients = document.getElementById(
    "suggestions-ingredient"
  );
  suggestionIngredients.innerHTML = "";
  const searchBarIngredient = document.getElementById("ingredient");
  let searchIngredient = searchBarIngredient.value.toLowerCase();

  // Obtenir la liste des ingrédients présents dans les recettes filtrées
  let filteredIngredients = [];
  filteredCardArray.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const ingredientText = ingredient.ingredient.toLowerCase();
      if (!filteredIngredients.includes(ingredientText)) {
        filteredIngredients.push(ingredientText);
      }
    });
  });

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
          displayIngredients(ingredientsList);
        });
        divTag.appendChild(iTag);
        divTag.appendChild(crossTag);
        tag.appendChild(divTag);
        tagArray.push(pIngredientsText.toLowerCase());
        searchByTagAlgo();
      }
      updateFilteredResults();
      displayIngredients(ingredientsList);
    });
  });

  const pIngredients = suggestionIngredients.querySelectorAll("p");

  // Filtrer les ingrédients en fonction des recettes filtrées et de la recherche d'ingrédients
  pIngredients.forEach((p) => {
    const ingredientText = p.textContent.toLowerCase();
    const isIngredientInFilteredRecipes =
      filteredIngredients.includes(ingredientText);
    const isIngredientMatchingSearch =
      matchingIngredients.includes(ingredientText);

    if (isIngredientInFilteredRecipes && isIngredientMatchingSearch) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });

  searchBarIngredient.addEventListener("keyup", function () {
    searchIngredient = searchBarIngredient.value.toLowerCase();

    // Recréer la liste d'ingrédients correspondant à la recherche
    matchingIngredients = ingredientsList.filter((ingredient) => {
      return ingredient.includes(searchIngredient);
    });

    // Filtrer les ingrédients en fonction des recettes filtrées et de la nouvelle recherche d'ingrédients
    pIngredients.forEach((p) => {
      const ingredientText = p.textContent.toLowerCase();
      const isIngredientInFilteredRecipes =
        filteredIngredients.includes(ingredientText);
      const isIngredientMatchingSearch =
        matchingIngredients.includes(ingredientText);

      if (isIngredientInFilteredRecipes && isIngredientMatchingSearch) {
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
  const searchBar = document.querySelector("#searchbar");
  const searchDish = searchBar.value.toLowerCase();
  const suggestionAppareils = document.getElementById("suggestions-appareils");
  suggestionAppareils.innerHTML = "";
  const searchBarAppareils = document.getElementById("appareils");
  let searchAppliance = searchBarAppareils.value.toLowerCase();

  // Obtenir la liste des appareils présents dans les recettes filtrées
  let filteredAppliances = [];
  filteredCardArray.forEach((recipe) => {
    const appliance = recipe.appliance.toLowerCase();
    if (!filteredAppliances.includes(appliance)) {
      filteredAppliances.push(appliance);
    }
  });

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
          displayAppliance(applianceList);
        });
        divTag.appendChild(aTag);
        divTag.appendChild(crossTag);
        tag.appendChild(divTag);
        tagArray.push(pApplianceText.toLowerCase());
        searchByTagAlgo();
      }
      updateFilteredResults();
      displayAppliance(applianceList);
    });
  });

  const pAppareils = suggestionAppareils.querySelectorAll("p");

  // Filtrer les ingrédients en fonction des recettes filtrées et de la recherche d'ingrédients
  pAppareils.forEach((p) => {
    const applianceText = p.textContent.toLowerCase();
    const isApplianceInFilteredRecipes =
      filteredAppliances.includes(applianceText);
    const isApplianceMatchingSearch = matchingAppareils.includes(applianceText);

    if (
      !searchDish === "" ||
      (isApplianceInFilteredRecipes && isApplianceMatchingSearch)
    ) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });

  searchBarAppareils.addEventListener("keyup", function () {
    searchAppliance = searchBarAppareils.value.toLowerCase();

    // Recréer la liste d'appareils correspondant à la recherche
    matchingAppareils = applianceList.filter((appliance) => {
      return appliance.includes(searchAppliance);
    });

    // Filtrer les appareils en fonction des recettes filtrées et de la recherche d'appareils
    pAppareils.forEach((p) => {
      const applianceText = p.textContent.toLowerCase();
      const isApplianceInFilteredRecipes =
        filteredAppliances.includes(applianceText);
      const isApplianceMatchingSearch =
        matchingAppareils.includes(applianceText);

      if (
        !searchDish === "" ||
        (isApplianceInFilteredRecipes && isApplianceMatchingSearch)
      ) {
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
    const ustensilsList = ustensilsArray.filter(
      (x, i) => ustensilsArray.indexOf(x) === i
    );
    return ustensilsList;
  });
}

function displayUstensiles(ustensilsList) {
  const searchBar = document.querySelector("#searchbar");
  const searchDish = searchBar.value.toLowerCase();
  const suggestionUstensils = document.getElementById("suggestions-ustensiles");
  suggestionUstensils.innerHTML = "";
  const searchBarUstensiles = document.getElementById("ustensiles");
  let searchUstensil = searchBarUstensiles.value.toLowerCase();

  // Obtenir la liste des ustensiles présents dans les recettes filtrées
  let filteredUstensils = [];
  filteredCardArray.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      const lowerCaseUstensil = ustensil.toLowerCase();
      if (!filteredUstensils.includes(lowerCaseUstensil)) {
        filteredUstensils.push(lowerCaseUstensil);
      }
    });
  });

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
          displayUstensiles(ustensilsList);
        });
        divTag.appendChild(uTag);
        divTag.appendChild(crossTag);
        tag.appendChild(divTag);
        tagArray.push(pUstensilText.toLowerCase());
        searchByTagAlgo();
      }
      updateFilteredResults();
      displayUstensiles(ustensilsList);
    });
  });

  const pUstensils = suggestionUstensils.querySelectorAll("p");

  // Filtrer les ingrédients en fonction des recettes filtrées et de la recherche d'ingrédients
  pUstensils.forEach((p) => {
    const ustensilText = p.textContent.toLowerCase();
    const isUstensilInFilteredRecipes =
      filteredUstensils.includes(ustensilText);
    const isUstensilMatchingSearch = matchingUstensils.includes(ustensilText);

    if (
      !searchDish === "" ||
      (isUstensilInFilteredRecipes && isUstensilMatchingSearch)
    ) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });

  searchBarUstensiles.addEventListener("keyup", function () {
    searchUstensil = searchBarUstensiles.value.toLowerCase();

    // Recréer la liste d'ustensiles correspondant à la recherche
    matchingUstensils = ustensilsList.filter((ustensil) => {
      return ustensil.includes(searchUstensil);
    });

    // Filtrer les ustensiles en fonction des recettes filtrées et de la recherche d'ustensiles
    pUstensils.forEach((p) => {
      const ustensilText = p.textContent.toLowerCase();
      const isUstensilInFilteredRecipes =
        filteredUstensils.includes(ustensilText);
      const isUstensilMatchingSearch = matchingUstensils.includes(ustensilText);

      if (
        !searchDish === "" ||
        (isUstensilInFilteredRecipes && isUstensilMatchingSearch)
      ) {
        p.style.display = "block";
      } else {
        p.style.display = "none";
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
