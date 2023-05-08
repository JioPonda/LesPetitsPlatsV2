async function getRecipes() {
  const res = await fetch("JS/recipes.json");
  const data = await res.json();
  return { recipes: data.recipes };
}

// Factory pour la création de card

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

/****  ALGORYTHME DE RECHERCHE V1 ****/
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
        } else {
          errorMessage.style.display = "none";
        }
      });
    } else {
      recipesContainer.style.display = "grid";
      filteredCardContainer.style.display = "none";
      errorMessage.style.display = "none";
    }
  });
}

/**** RECHERCHE DANS LA BARRE DES INGREDIENTS ****/
function ingredientSearch() {
  /** BASE **/
  const divIngredient = document.getElementById("suggestions-ingredient");
  divIngredient.style.display = "grid";
  const chevronIngredient = document.querySelector(".chevron-ingredients");
  chevronIngredient.style.transform = "rotate(180deg)";

  const searchBarIngredient = document.getElementById("ingredient");
  const searchIngredient = searchBarIngredient.value.toLowerCase();

  const suggestionIngredients = document.getElementById(
    "suggestions-ingredient"
  );
  /** FILTRE ET AFFFICHAGE DES INGREDIENTS **/
  getRecipes().then((data) => {
    divIngredient.innerHTML = "";
    const ingredientsArray = [];
    const ingredientsArray2 = [];
    data.recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        ingredientsArray.push(ingredient);
      });
    });
    // console.log(ingredientsArray);
    ingredientsArray.forEach((ingredient) => {
      ingredientsArray2.push(ingredient.ingredient.toLowerCase());
    });
    // console.log(ingredientsArray2);
    const ingredientsList = ingredientsArray2.filter(
      (x, i) => ingredientsArray2.indexOf(x) === i
    );
    ingredientsList.forEach((ingredient) => {
      const pIngredient = document.createElement("p");
      pIngredient.setAttribute("id", "pIngredient");
      pIngredient.textContent = ingredient;
      suggestionIngredients.appendChild(pIngredient);
    });
    searchBarIngredient.addEventListener("keyup", function () {
      // console.log(ingredientsList);
      ingredientsList.forEach((ingredient) => {
        if (ingredient.toLowerCase().includes(searchIngredient)) {
          console.log("l'ingrédient est contenue");
        }
      });
    });
  });
}

/**** RECHERCHE DANS LA BARRE DES APPAREILS ****/
function applianceSearch() {
  /** BASE **/
  const divAppareils = document.getElementById("suggestions-appareils");
  divAppareils.style.display = "grid";
  const chevronAppareils = document.querySelector(".chevron-appareils");
  chevronAppareils.style.transform = "rotate(180deg)";

  const searchBarAppareils = document.getElementById("appareils");
  const searchAppliance = searchBarAppareils.value.toLowerCase();

  const suggestionAppareils = document.getElementById("suggestions-appareils");

  /** FILTRE ET AFFFICHAGE DES APPAREILS **/
  getRecipes().then((data) => {
    divAppareils.innerHTML = "";
    const applianceArray = [];
    data.recipes.forEach((recipe) => {
      applianceArray.push(recipe.appliance);
    });
    // console.log(applianceArray);
    const applianceList = applianceArray.filter(
      (x, i) => applianceArray.indexOf(x) === i
    );
    applianceList.forEach((appliance) => {
      const pAppareils = document.createElement("p");
      pAppareils.setAttribute("id", "pAppareils");
      pAppareils.textContent = appliance;
      suggestionAppareils.appendChild(pAppareils);
    });
    searchBarAppareils.addEventListener("keyup", function () {
      console.log(applianceList);
      applianceList.forEach((appliance) => {
        if (appliance.toLowerCase().includes(searchAppliance)) {
          console.log("l'appareil est contenue");
        }
      });
    });
  });
}

/**** RECHERCHE DANS LA BARRE DES USTENSILES ****/
function ustensilsSearch() {
  /** BASE **/
  const divUstensiles = document.getElementById("suggestions-ustensiles");
  divUstensiles.style.display = "grid";
  const chevronUstensiles = document.querySelector(".chevron-ustensiles");
  chevronUstensiles.style.transform = "rotate(180deg)";

  const searchBarUstensiles = document.getElementById("ustensiles");
  const searchUstensil = searchBarUstensiles.value.toLowerCase();

  const suggestionUstensils = document.getElementById("suggestions-ustensiles");
  /** FILTRE ET AFFFICHAGE DES USTENSILES **/
  getRecipes().then((data) => {
    divUstensiles.innerHTML = "";
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
    ustensilsList.forEach((ustensil) => {
      const pUstensils = document.createElement("p");
      pUstensils.setAttribute("id", "pUstensils");
      pUstensils.textContent = ustensil;
      suggestionUstensils.appendChild(pUstensils);
    });
    searchBarUstensiles.addEventListener("keyup", function () {
      // console.log(ustensilsList);
      ustensilsList.forEach((ingredient) => {
        if (ingredient.toLowerCase().includes(searchUstensil)) {
          console.log("l'ustensile est contenue");
        }
      });
    });
  });
}

/** Initialisation des données des recipes pour la recherche */
async function initSearch() {
  const { recipes } =
    await getRecipes(); /** Récupére les données des récipes avant recherche*/
  searchAlgo(
    recipes
  ); /** Apelle de la fonction de rercherche des données des récipes */
}

initSearch();

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
