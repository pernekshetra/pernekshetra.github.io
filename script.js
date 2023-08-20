const imageInput = document.getElementById('imageInput');
const generateButton = document.getElementById('generateButton');
const resultContainer = document.getElementById('resultContainer');
const resultImage = document.getElementById('resultImage');
const downloadButton = document.getElementById('downloadButton');
const shareButton = document.getElementById('shareButton');

generateButton.addEventListener('click', generateProfilePic);
shareButton.addEventListener('click', shareOnWhatsApp);

function shareOnWhatsApp() {
    const generatedImageURL = resultImage.src;
    const message = encodeURIComponent('Check out my new profile picture!');
    const shareURL = `whatsapp://send?text=${message}%20${generatedImageURL}`;
    
    window.location.href = shareURL;
}

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
        alert('Please select your photo before generating profile photo.');
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
            context.drawImage(userImage, 0, 0, overlayImage.width, overlayImage.height);
            context.drawImage(overlayImage, 0, 0, overlayImage.width, overlayImage.height);

            resultImage.src = canvas.toDataURL('image/png');
            resultContainer.style.display = 'block';
            downloadButton.href = canvas.toDataURL('image/png');
        };
    };

    reader.readAsDataURL(imageInput.files[0]);
}
