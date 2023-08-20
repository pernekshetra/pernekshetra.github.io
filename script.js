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


const overlayWidth = overlayImage.width;
    const overlayHeight = overlayImage.height;
            const context = canvas.getContext('2d');

const scaleFactor = Math.min(
      overlayWidth / userImage.width,
      overlayHeight / userImage.height
    );

    const userImageWidth = userImage.width * scaleFactor;
    const userImageHeight = userImage.height * scaleFactor;

    const x = (overlayWidth - userImageWidth) / 2;
    const y = (overlayHeight - userImageHeight) / 2;

    ctx.clearRect(0, 0, overlayWidth, overlayHeight);
    ctx.drawImage(userImage, x, y, userImageWidth, userImageHeight);
            context.drawImage(overlayImage, 0, 0, overlayImage.width, overlayImage.height);

            resultImage.src = canvas.toDataURL('image/png');
            resultContainer.style.display = 'block';
            downloadButton.href = canvas.toDataURL('image/png');
        };
    };

    reader.readAsDataURL(imageInput.files[0]);
}
