// main.js

// CONSTANTS
const RECIPE_URLS = [
    'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // B1
  if ('serviceWorker' in navigator) {
    // B2
    window.addEventListener('load', () => {
      // B3
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          // B4
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          // B5
          console.error('Service Worker registration failed:', error);
        });
    });
  } else {
    console.log('Service Workers not supported in this browser.');
  }
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
  //localStorage.removeItem('recipes');
  // A1
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    return JSON.parse(storedRecipes); 
  }

  // A2. recipes array 
  const recipes = [];

  // A3. Promise return
  return new Promise(async (resolve, reject) => {
    // A4. URL array iteration
    for (let i = 0; i < RECIPE_URLS.length; i++) {
      const url = RECIPE_URLS[i];
      try {
        // A5-A8. fetch, .json(), push inside try
        const response = await fetch(url);         // A6
        const data = await response.json();        // A7
        recipes.push(data);                        // A8
      } catch (err) {
        // A10. Error
        console.error(`Failed to fetch recipe from ${url}`, err);
        // A11. Reject
        reject(err);
        return;
      }
    }

    // A9
    saveRecipesToStorage(recipes);
    resolve(recipes);
  });
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}