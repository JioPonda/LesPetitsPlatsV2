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

/** Initialisation des données des recipes pour la recherche */
async function initSearch() {
  const { recipes } =
    await getRecipes(); /** Récupére les données des récipes avant recherche*/
  searchAlgo(
    recipes
  ); /** Apelle de la fonction de rercherche des données des récipes */
}

initSearch();
