// question 3-FetchApproach.js

// Import necessary modules or components if needed
import * as Carousel from "./Carousel.js";
import axios from "axios";
/**
 * Function to fetch breed data using the fetch API
 */
async function fetchBreeds() {
  try {
    const response = await fetch("https://api.thecatapi.com/v1/breeds");
    if (!response.ok) {
      throw new Error("Failed to fetch breeds");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching breeds:", error);
    return [];
  }
}

/**
 * Function to fetch images of a selected breed using the fetch API
 * @param {string} breedId The ID of the selected breed
 */
async function fetchBreedImages(breedId) {
  try {
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=5`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch breed images");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching breed images:", error);
    return [];
  }
}

// Other necessary functions or handlers can be defined here

// Export necessary functions or components if needed
export { fetchBreeds, fetchBreedImages };
