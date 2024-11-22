function pixelateImageWithVisualization(image, pixelSize) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to 400x800
  const targetWidth = 400;
  const targetHeight = 800;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Draw the image onto the canvas, scaling it to 400x800
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

  // Visualization variables
  let x = 0,
    y = 0;

  // Step 1: Draw the downscaled (smaller) version
  function drawDownscaledStep() {
    if (y >= newHeight) {
      // Proceed to upscaling visualization after downscaling is complete
      y = 0;
      x = 0;
      setTimeout(drawUpscaledStep, 500); // Pause for a moment to visualize the smaller image
      return;
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

    // Set the pixel in the downscaled image
    const tempIndex = (y * newWidth + x) * 4;
    tempData[tempIndex] = r;
    tempData[tempIndex + 1] = g;
    tempData[tempIndex + 2] = b;
    tempData[tempIndex + 3] = a;

    // Put the updated data onto the temporary canvas
    tempCtx.putImageData(tempImageData, 0, 0);

    // Visualize the downscaled image on the main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the main canvas
    ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight, 0, 0, targetWidth, targetHeight);

    // Update coordinates
    x++;
    if (x >= newWidth) {
      x = 0;
      y++;
    }

    // Schedule the next step
    setTimeout(drawDownscaledStep, 10); // Adjust speed for downscaling visualization
  }

  // Step 2: Draw the upscaled (pixelated) version
  function drawUpscaledStep() {
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

    // Visualize the upscaled image on the main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the main canvas
    ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight, 0, 0, targetWidth, targetHeight);

    // Update coordinates
    x++;
    if (x >= newWidth) {
      x = 0;
      y++;
    }

    // Schedule the next step
    setTimeout(drawUpscaledStep, 10); // Adjust speed for upscaling visualization
  }

  // Start with the downscaled visualization
  drawDownscaledStep();
}

// Handle file input to load the image
document.getElementById("fileInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    img.onload = function () {
      // Call the pixelateImageWithVisualization function
      pixelateImageWithVisualization(img, 10); // Adjust the pixel size as needed
    };
    img.src = URL.createObjectURL(file);
  }
});
