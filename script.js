function pixelateImageWithVisualization(image, pixelSize) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to 200x400
  const targetWidth = 400;
  const targetHeight = 800;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Draw the image onto the canvas, scaling it to 200x400
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  // Get the image data from the resized canvas
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imageData.data;

  // Calculate the new dimensions for pixelation
  const newWidth = Math.floor(targetWidth / pixelSize);
  const newHeight = Math.floor(targetHeight / pixelSize);

  // Create a new canvas to store the pixelated image
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = newWidth;
  tempCanvas.height = newHeight;
  const tempCtx = tempCanvas.getContext("2d");

  // Create an array to store pixel data for the smaller (pixelated) image
  const tempImageData = tempCtx.createImageData(newWidth, newHeight);
  const tempData = tempImageData.data;

  // Variables for visualization
  let x = 0,
    y = 0;

  // Function to draw the pixelated image step-by-step
  function drawStep() {
    if (y >= newHeight) {
      return; // Done
    }

    // Calculate the corresponding pixel in the resized image
    const originalX = Math.floor(x * pixelSize);
    const originalY = Math.floor(y * pixelSize);

    // Get the position of the pixel in the resized image's data array
    const index = (originalY * targetWidth + originalX) * 4;

    // Get the RGBA values of the nearest pixel
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3];

    // Set the pixel in the pixelated image
    const tempIndex = (y * newWidth + x) * 4;
    tempData[tempIndex] = r;
    tempData[tempIndex + 1] = g;
    tempData[tempIndex + 2] = b;
    tempData[tempIndex + 3] = a;

    // Put the updated data onto the temporary canvas
    tempCtx.putImageData(tempImageData, 0, 0);

    // Scale and draw the temporary canvas onto the main canvas
    ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight, 0, 0, targetWidth, targetHeight);

    // Update coordinates
    x++;
    if (x >= newWidth) {
      x = 0;
      y++;
    }

    // Schedule the next step
    setTimeout(drawStep, 3); // Adjust the delay for faster/slower animation
  }

  // Start the visualization
  drawStep();
}

// Handle file input to load the image
document.getElementById("fileInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    img.onload = function () {
      // Call the pixelateImageWithVisualization function
      pixelateImageWithVisualization(img, 7); // Adjust the pixel size as needed
    };
    img.src = URL.createObjectURL(file);
  }
});
