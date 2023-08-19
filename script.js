const imageInput = document.getElementById('imageInput');
const generateButton = document.getElementById('generateButton');
const resultContainer = document.getElementById('resultContainer');
const resultImage = document.getElementById('resultImage');
const downloadButton = document.getElementById('downloadButton');

generateButton.addEventListener('click', generateProfilePic);

function generateProfilePic() {
   const overlaySelect = document.getElementById('overlaySelect');
    const selectedOverlay = overlaySelect.value;

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
            context.drawImage(userImage, 0, 0, overlayImage.width, overlayImage.height);
            context.drawImage(overlayImage, 0, 0, overlayImage.width, overlayImage.height);

            resultImage.src = canvas.toDataURL('image/png');
            resultContainer.style.display = 'block';
            downloadButton.href = canvas.toDataURL('image/png');
        };
    };

    reader.readAsDataURL(imageInput.files[0]);
}
