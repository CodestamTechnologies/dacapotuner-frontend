// Function to shuffle an array and ensure each item appears at least once
export default function shuffleArray(originalArray) {
  let newArray = [];

  // Ensure the original array has items
  if (originalArray.length === 0) {
    console.log("The original array is empty.");
    return newArray;
  }

  // Shuffle the original array
  let shuffledArray = originalArray.slice(); // Create a copy to avoid modifying the original array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Add each item at least once to the new array
  for (let i = 0; i < 25; i++) {
    newArray.push(shuffledArray[i % originalArray.length]);
  }

  return newArray;
}
