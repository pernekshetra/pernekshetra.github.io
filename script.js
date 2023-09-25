/**
 * Profile Picture Generator
 */

// Get references to HTML elements
const imageInput = document.getElementById('imageInput');           // Input element for user image
const generateButton = document.getElementById('generateButton');   // Button to generate profile picture
const resultContainer = document.getElementById('resultContainer'); // Container for displaying the result
const resultImage = document.getElementById('resultImage');         // Displayed profile picture
const downloadButton = document.getElementById('downloadButton');   // Button to download the generated image
const profileCanvas = document.getElementById('profileCanvas'); 

const zoomInButton = document.getElementById('zoomInButton'); 
const zoomOutButton = document.getElementById('zoomOutButton'); 
const panLeftButton = document.getElementById('panLeftButton'); 
const panRightButton = document.getElementById('panRightButton'); 
const panUpButton = document.getElementById('panUpButton'); 
const panDownButton = document.getElementById('panDownButton');

// Add event listener to the "Generate" button
generateButton.addEventListener('click', generateProfilePic);

  // Get the 2D context of the canvas
        const context = profileCanvas.getContext('2d');


// Variables for tracking zoom and pan
        let zoomLevel = 1;
        let panX = 0;
        let panY = 0;

   // Add event listeners for mouse and touch events
  zoomInButton.addEventListener('click', zoomIn);
  zoomOutButton.addEventListener('click', zoomOut);
  panLeftButton.addEventListener('click', panLeft);
  panRightButton.addEventListener('click', panRight);
    panUpButton.addEventListener('click', panUP);
  panDownButton.addEventListener('click', panDown);


        function zoomIn() {
    zoomLevel *= 1.05;
    if (zoomLevel > 2) {
    zoomLevel = 2;
}
    updateCanvas();
  }

  function zoomOut() {
    zoomLevel /= 1.05;
   if (zoomLevel < 0.5) {
    zoomLevel = 0.5;
}
    updateCanvas();
  }

  function panLeft() {
    panX -= 10; // Adjust the pan increment as needed
    updateCanvas();
  }

  function panRight() {
    panX += 10; // Adjust the pan increment as needed
    updateCanvas();
  }

  function panUP() {
    panY -= 10; // Adjust the pan increment as needed
    updateCanvas();
  }

  function panDown() {
    panY += 10; // Adjust the pan increment as needed
    updateCanvas();
  }

          // Function to update the canvas with current zoom and pan settings
        function updateCanvas() {
            if (imageInput.files && imageInput.files.length > 0) {
                generateProfilePic();
            }
        }

/**
 * Generates a profile picture based on user inputs.
 */
function generateProfilePic() {
    // Get all overlay radio buttons
    const overlayRadioButtons = document.getElementsByName('overlay');
    let selectedOverlay;

    // Find the selected overlay
    for (const radioButton of overlayRadioButtons) {
        if (radioButton.checked) {
            selectedOverlay = radioButton.value;
            break;
        }
    }

    // If no overlay is selected, show an alert
    if (!selectedOverlay) {
        alert('Please select an overlay.');
        return;
    }

    // If no image is selected, show an alert
    if (!imageInput.files || imageInput.files.length === 0) {
        alert('Please select your photo before generating a profile photo.');
        return;
    }

    // Create an Image object for the selected overlay
    const overlayImage = new Image();
    overlayImage.src = selectedOverlay;

    // Create a FileReader object to read the user's image file
    const reader = new FileReader();
    reader.onload = function(event) {


        // Create an Image object for the user's image
        const userImage = new Image();
        userImage.src = event.target.result;

        // After the user's image loads
        userImage.onload = function() {
            // Create a canvas element
       
            profileCanvas.width = overlayImage.width;
            profileCanvas.height = overlayImage.height;

            
            // Calculate aspect fit dimensions for userImage within overlayImage
            var aspectRatio = userImage.width / userImage.height;
            let userWidth, userHeight, userX, userY;

            if (aspectRatio > 0.95 && aspectRatio < 1.05) {
                userWidth = overlayImage.width;
                userHeight = overlayImage.height;
                userX = 0;
                userY = 0;
            } else if (aspectRatio > overlayImage.width / overlayImage.height) {
                userWidth = overlayImage.width;
                userHeight = overlayImage.width / aspectRatio;
                userX = 0;
                userY = (overlayImage.height - userHeight) / 2;
            } else {
                userWidth = overlayImage.height * aspectRatio;
                userHeight = overlayImage.height;
                userX = (overlayImage.width - userWidth) / 2;
                userY = 0;
            }

              // Draw userImage with aspect-fit
                    context.drawImage(
                        userImage,
                        userX + panX,
                        userY + panY,
                        userWidth * zoomLevel,
                        userHeight * zoomLevel
                    );

            // Draw overlayImage on top
            context.drawImage(overlayImage, 0, 0, overlayImage.width, overlayImage.height);

           
             // Set the generated image as the source of the displayed image
            resultImage.src = profileCanvas.toDataURL('image/png');

            // Display the result container
            resultContainer.style.display = 'block';

            // Set the download button's link to the generated image
            downloadButton.href = profileCanvas.toDataURL('image/png');
        };
    };

    // Read the user's image file as a data URL
    reader.readAsDataURL(imageInput.files[0]);
}
