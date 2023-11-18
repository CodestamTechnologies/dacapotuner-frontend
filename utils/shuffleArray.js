// Function to shuffle an array
export default function shuffleArray(originalArray) {
    let newArray = [];

    // Ensure the original array has items
    if (originalArray.length === 0) {
      console.log("The original array is empty.");
      return newArray;
    }
  
    for (let i = 0; i < 25; i++) {
      // Generate a random index within the range of the original array
      let randomIndex = Math.floor(Math.random() * originalArray.length);
  
      // Add the randomly selected item to the new array
      newArray.push(originalArray[randomIndex]);
    }
  
    return newArray;
}