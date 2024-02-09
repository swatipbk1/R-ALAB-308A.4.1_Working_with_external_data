import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_1Sg0muzRimblxaJbmq2PjPMrviYmNW86LeWbphbuw9oxnXR7Ivtpsx4CWvUdPUKM";

// Set up Axios default headers with your API key

axios.defaults.headers.common["x-api-key"] =
  "live_1Sg0muzRimblxaJbmq2PjPMrviYmNW86LeWbphbuw9oxnXR7Ivtpsx4CWvUdPUKM";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
async function initialLoad() {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");
    const breeds = response.data;

    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching breeds:", error);
  }
}
console.log(breedSelect);
initialLoad();
console.log(breedSelect);

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
function createCarouselItem(imgSrc, imgAlt, imgId) {
  const template = document.querySelector("#carouselItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);

  const img = clone.querySelector("img");
  img.src = imgSrc;
  img.alt = imgAlt;

  const favBtn = clone.querySelector(".favourite-button");
  favBtn.dataset.imgId = imgId;

  return clone;
}
// Function to append a carousel item to the carousel container
function appendCarousel(element) {
  const carousel = document.querySelector("#carouselInner");
  carousel.appendChild(element);
}
function clear() {
  const carouselInner = document.getElementById("carouselInner");
  while (carouselInner.firstChild) {
    carouselInner.removeChild(carouselInner.firstChild);
  }
}
document
  .getElementById("breedSelect")
  .addEventListener("change", async (event) => {
    try {
      // Retrieve the selected breed name from the dropdown
      const breedName = event.target.value;

      // Make a GET request to fetch information on the selected breed
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?breed_ids=${breedName}&limit=5`
      );
      const data = await response.json();

      console.log("Response from Cat API:", data); // Log the response data to inspect

      // Get a reference to the carousel inner container
      const carouselInner = document.getElementById("carouselInner");
      // Clear existing carousel items before appending new ones
      clear();

      // Iterate through each object in the response array
      data.forEach((imageData) => {
        // Extract relevant information from the response
        const imgSrc = imageData.url;
        const imgAlt = imageData.breeds?.[0]?.name || "Unknown Breed";
        const imgId = imageData.id;

        console.log("Image URL:", imgSrc); // Log the image URL

        // Create a new carousel item for each image
        const carouselItem = createCarouselItem(imgSrc, imgAlt, imgId);

        // Append the new carousel item to the carousel
        appendCarousel(carouselItem);

        // Create an informational section within the infoDump element
        const infoDump = document.getElementById("infoDump");
        const infoCard = document.createElement("div");
        infoCard.classList.add("card", "m-3");
        infoCard.innerHTML = `
              <div class="card-body">
                  <h5 class="card-title">${imgAlt}</h5>
                  <p class="card-text">This is a ${imgAlt}.</p>
                  <p class="card-text">Image ID: ${imgId}</p>
              </div>
          `;
        infoDump.appendChild(infoCard);
      });

      // Restart the carousel
      Carousel.start();
    } catch (error) {
      console.error("Error fetching breed information:", error);
    }
  });

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

// Example fetch function
fetch("https://api.thecatapi.com/v1/breeds")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error fetching data:", error));

// Equivalent Axios function
axios
  .get("https://api.thecatapi.com/v1/breeds")
  .then((response) => console.log(response.data))
  .catch((error) => console.error("Error fetching data:", error));

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Log when the request begins
    console.log(
      `Request started for ${config.url} at ${new Date().toLocaleTimeString()}`
    );
    // Don't forget to return the config object
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Log when the response is received
    console.log(
      `Response received for ${
        response.config.url
      } at ${new Date().toLocaleTimeString()}`
    );
    // Don't forget to return the response
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
// Set the initial width of the progress bar to 0%
progressBar.style.width = "0%";

// Create the updateProgress function
function updateProgress(progressEvent) {
  // Calculate the progress percentage
  const progress = (progressEvent.loaded / progressEvent.total) * 100;
  // Update the width of the progress bar
  progressBar.style.width = `${progress}%`;
}

// Attach updateProgress to Axios requests using onDownloadProgress
axios.interceptors.request.use((config) => {
  // Reset the progress bar width before each request
  progressBar.style.width = "0%";
  // Attach updateProgress to the request configuration
  config.onDownloadProgress = updateProgress;
  return config;
});

// Example Axios request
axios
  .get("https://api.thecatapi.com/v1/breeds")
  .then((response) => {
    console.log(response.data);
    // Do something with the response data
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    // Handle errors
  });

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */

// Request interceptor to set cursor style to "progress" when a request is made
axios.interceptors.request.use(
  (config) => {
    document.body.style.cursor = "progress";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to remove progress cursor style when a response is received
axios.interceptors.response.use(
  (response) => {
    document.body.style.cursor = "auto";
    return response;
  },
  (error) => {
    document.body.style.cursor = "auto";
    return Promise.reject(error);
  }
);
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */

// Function to toggle favorite status of an image
export async function favourite(imgId) {
  try {
    // Check if the image is already favorited
    const isFavorited = checkFavoriteStatus(imgId);

    if (isFavorited) {
      // If the image is already favorited, unfavorite it
      await axios.delete(`https://api.thecatapi.com/v1/favourites/${imgId}`);
      console.log("Successfully unfavorited image:", imgId);
    } else {
      // If the image is not favorited, favorite it
      await axios.post("https://api.thecatapi.com/v1/favourites", {
        image_id: imgId,
      });
      console.log("Successfully favorited image:", imgId);
    }

    // Update UI or perform any other necessary actions
  } catch (error) {
    console.error("Error toggling favorite status:", error);
  }
}

// Function to check if an image is favorited
async function checkFavoriteStatus(imgId) {
  try {
    // Fetch list of favorites
    const response = await axios.get("https://api.thecatapi.com/v1/favourites");
    const favorites = response.data;

    // Check if the image is present in the favorites list
    return favorites.some((favorite) => favorite.image_id === imgId);
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false; // Return false by default if there is an error
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 * */

// Function to clear the carousel by removing all carousel items
function clearCarousel() {
  const carouselInner = document.getElementById("carouselInner");
  while (carouselInner.firstChild) {
    carouselInner.removeChild(carouselInner.firstChild);
  }
}

async function getFavourites() {
  try {
    // Make a GET request to fetch all favorites from the Cat API
    const response = await axios.get("https://api.thecatapi.com/v1/favourites");
    const favourites = response.data;

    // Clear the carousel to remove any existing items
    clearCarousel();

    // Iterate through each favorite and display it in the carousel
    favourites.forEach(async (favorite) => {
      try {
        // Fetch the details of the favorite image
        const imageResponse = await axios.get(
          `https://api.thecatapi.com/v1/images/${favorite.image_id}`
        );
        const imageData = imageResponse.data;

        // Extract necessary information from the response
        const imgSrc = imageData.url;
        const imgAlt = imageData.breeds?.[0]?.name || "Unknown Breed";
        const imgId = imageData.id;

        // Create a new carousel item for the favorite image
        const carouselItem = createCarouselItem(imgSrc, imgAlt, imgId);

        // Append the new carousel item to the carousel
        appendCarousel(carouselItem);
      } catch (error) {
        console.error("Error fetching image details:", error);
      }
    });

    // Restart the carousel after adding new items
    start();
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}
/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
