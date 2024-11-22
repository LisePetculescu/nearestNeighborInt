function pixelateImageWithVisualization(image, pixelSize) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to accommodate both images side by side
  const targetWidth = 400;
  const targetHeight = 500;
  canvas.width = targetWidth * 2;
  canvas.height = targetHeight;

  // Draw the original image on the left side of the canvas
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  // Draw the image onto the canvas, scaling it to 200x400
  ctx.drawImage(image, targetWidth, 0, targetWidth, targetHeight);

  // Get the image data from the resized canvas
  const imageData = ctx.getImageData(targetWidth, 0, targetWidth, targetHeight);
  const data = imageData.data;

  // Calculate the new dimensions for pixelation
  const newWidth = Math.floor(targetWidth / pixelSize);
  const newHeight = Math.floor(targetHeight / pixelSize);

  // Create a new canvas to store the pixelated image
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = newWidth;
  tempCanvas.height = newHeight;
  const tempCtx = tempCanvas.getContext("2d");

  // Draw the scaled-down image on the temporary canvas
  tempCtx.drawImage(canvas, targetWidth, 0, targetWidth, targetHeight, 0, 0, newWidth, newHeight);

  // Get the image data from the temporary canvas
  const tempImageData = tempCtx.getImageData(0, 0, newWidth, newHeight);
  const tempData = tempImageData.data;

  // Variables for visualization
  let x = 0;
  let y = 0;

  // Function to draw the pixelated image step-by-step
  function drawStep() {
    if (y >= newHeight) {
      return; // Done
    }

    // Calculate the corresponding pixel in the resized image
    const originalX = Math.round(x * pixelSize);
    const originalY = Math.round(y * pixelSize);

    // Get the position of the pixel in the resized image's data array
    const index = (y * newWidth + x) * 4;

    // Get the RGBA values of the nearest pixel
    const r = tempData[index];
    const g = tempData[index + 1];
    const b = tempData[index + 2];
    const a = tempData[index + 3];

    // Set the RGBA values for the pixelated image
    for (let dy = 0; dy < pixelSize; dy++) {
      for (let dx = 0; dx < pixelSize; dx++) {
        const px = originalX + dx;
        const py = originalY + dy;
        if (px < targetWidth && py < targetHeight) {
          const pixelIndex = (py * targetWidth + px) * 4;
          data[pixelIndex] = r;
          data[pixelIndex + 1] = g;
          data[pixelIndex + 2] = b;
          data[pixelIndex + 3] = a;
        }
      }
    }

    // Draw the updated image data back to the canvas
    ctx.putImageData(imageData, targetWidth, 0);

    // Move to the next pixel
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
