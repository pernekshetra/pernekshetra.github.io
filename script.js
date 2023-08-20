
const imageInput = document.getElementById('imageInput');
const generateButton = document.getElementById('generateButton');
const resultContainer = document.getElementById('resultContainer');
const resultImage = document.getElementById('resultImage');
const downloadButton = document.getElementById('downloadButton');

generateButton.addEventListener('click', generateProfilePic);

function generateProfilePic() {
    const overlayRadioButtons = document.getElementsByName('overlay');
    let selectedOverlay;

    for (const radioButton of overlayRadioButtons) {
        if (radioButton.checked) {
            selectedOverlay = radioButton.value;
            break;
        }
    }

    if (!selectedOverlay) {
        alert('Please select an overlay.');
        return;
    }

    if (!imageInput.files || imageInput.files.length === 0) {
        alert('Please select your photo before generating a profile photo.');
        return;
    }

    const overlayImage = new Image();
    overlayImage.src = selectedOverlay;

    const reader = new FileReader();
    reader.onload = function(event) {
        const userImage = new Image();
        userImage.src = event.target.result;

        userImage.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = overlayImage.width;
            canvas.height = overlayImage.height;

            const context = canvas.getContext('2d');
            
            // Calculate the aspect fit dimensions for userImage within overlayImage
            var aspectRatio = userImage.width / userImage.height;
            let userWidth, userHeight, userX, userY;

            if (aspectRatio > overlayImage.width / overlayImage.height) {
                userWidth = overlayImage.width;
                userHeight = overlayImage.height
                userX = 0;
                userY = 0;
            } else {
                userWidth = overlayImage.width;
                userHeight = overlayImage.height
                userX = 0;
                userY = 0;
            }

            // Then draw userImage with aspect-fit
            context.drawImage(userImage, userX, userY, userWidth, userHeight);

             // Draw overlayImage first
            context.drawImage(overlayImage, 0, 0, overlayImage.width, overlayImage.height);

            resultImage.src = canvas.toDataURL('image/png');
            resultContainer.style.display = 'block';
            downloadButton.href = canvas.toDataURL('image/png');
        };
    };

    reader.readAsDataURL(imageInput.files[0]);
}
