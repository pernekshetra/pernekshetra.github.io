/**
 * Profile Picture Generator
 */

// Get references to HTML elements
const imageInput = document.getElementById('imageInput'); // Input element for user image
const generateButton = document.getElementById('generateButton'); // Button to generate profile picture
const resultContainer = document.getElementById('resultContainer'); // Container for displaying the result
const resultImage = document.getElementById('resultImage'); // Displayed profile picture
const downloadButton = document.getElementById('downloadButton'); // Button to download the generated image

// Add event listener to the "Generate" button
generateButton.addEventListener('click', generateProfilePic);

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
            const canvas = document.createElement('canvas');
            canvas.width = overlayImage.width;
            canvas.height = overlayImage.height;

            // Get the 2D context of the canvas
            const context = canvas.getContext('2d');
            trackTransforms(context);

            function redraw() {
                // Clear the entire canvas
                var p1 = context.transformedPoint(0, 0);
                var p2 = context.transformedPoint(canvas.width, canvas.height);
                context.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

                context.save();
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.restore();

                context.drawImage(userImage, 0, 0);
            }
            redraw();

            var lastX = canvas.width / 2,
                lastY = canvas.height / 2;

            var dragStart, dragged;

            canvas.addEventListener('mousedown', function(evt) {
                document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragStart = context.transformedPoint(lastX, lastY);
                dragged = false;
            }, false);

            canvas.addEventListener('mousemove', function(evt) {
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragged = true;
                if (dragStart) {
                    var pt = context.transformedPoint(lastX, lastY);
                    context.translate(pt.x - dragStart.x, pt.y - dragStart.y);
                    redraw();
                }
            }, false);

            canvas.addEventListener('mouseup', function(evt) {
                dragStart = null;
                if (!dragged) zoom(evt.shiftKey ? -1 : 1);
            }, false);

            var scaleFactor = 1.1;

            var zoom = function(clicks) {
                var pt = context.transformedPoint(lastX, lastY);
                context.translate(pt.x, pt.y);
                var factor = Math.pow(scaleFactor, clicks);
                context.scale(factor, factor);
                context.translate(-pt.x, -pt.y);
                redraw();
            }

            var handleScroll = function(evt) {
                var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
                if (delta) zoom(delta);
                return evt.preventDefault() && false;
            };

            canvas.addEventListener('DOMMouseScroll', handleScroll, false);
            canvas.addEventListener('mousewheel', handleScroll, false);
        };

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
        context.drawImage(userImage, userX, userY, userWidth, userHeight);

        // Draw overlayImage on top
        context.drawImage(overlayImage, 0, 0, overlayImage.width, overlayImage.height);

        // Set the generated image as the source of the displayed image
        resultImage.src = canvas.toDataURL('image/png');

        // Display the result container
        resultContainer.style.display = 'block';

        // Set the download button's link to the generated image
        downloadButton.href = canvas.toDataURL('image/png');
    };
};

function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function() {
        return xform;
    };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function() {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };

    var restore = ctx.restore;
    ctx.restore = function() {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };

    var rotate = ctx.rotate;
    ctx.rotate = function(radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
    };

    var translate = ctx.translate;
    ctx.translate = function(dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };

    var transform = ctx.transform;
    ctx.transform = function(a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };

    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };

    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function(x, y) {
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }


    // Read the user's image file as a data URL
    reader.readAsDataURL(imageInput.files[0]);
}