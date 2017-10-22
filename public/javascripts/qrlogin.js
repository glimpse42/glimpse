var isValidating = false;
var intervalListener;

// retrieve QR code for new session
function getQRCode() {

    $.ajax({
        "method": "GET",
        "url": "/getQRCode"
    })
        .done(function(data) {
            if(data != null) { // successfully retrieved QR code
                toastr.warning("Please scan the QR code with your Usher app");
                data = JSON.parse(data);

                // display QR code
                $('#qr-image').attr('src', 'data:image/png;base64,' + data.code);

                // check if QR code has been scanned every 1 second
                intervalListener = setInterval(checkIfScanned, 1000);
            } else { // did not receive qr code from api call
                toastr.warning("Unexpected error; please refresh the image to try again");
                allowRefreshQR();
            }
        })
        .fail(function(response) {
            console.log("could not perform ajax call to retrieve qr code");
            allowRefreshQR();
        });

}

// check whether the code has been scanned
function checkIfScanned() {

    if(isValidating) return;
    isValidating = true;

    $.ajax({
        "method": "GET",
        "url": "/checkScanned"
    })
        .done(function(data) {
            if(data!= null) {
                if (data.status != "notReady") {
                    toastr.success('QR Code validated');
                    clearInterval(intervalListener);

                    // update & show badge w/ user info
                    updateBadgeInfo();
                    updateBadgePhoto();
                    $('#out-container').show();
                    $('#in-container').hide();
                }
            }
        })
        .fail(function(response) {
            console.log("could not perform ajax call to check if code has been scanned");
            clearInterval(intervalListener);
            allowRefreshQR();
        })
        .always(function() {
            isValidating = false; // allow another check to run
        });
}

// show refresh prompt image
function allowRefreshQR() {
    $('#qr-image').attr('src', '/images/image_refresh.png');
    $('#qr-image').bind('click', refreshQRCode);
}

// refresh QR Code
function refreshQRCode() {
    $('#qr-image').attr('src', '/images/loading_qrcode2.gif');
    $('#qr-image').unbind('click', refreshQRCode);

    getQRCode();
}

// retrieve user's badge photo
function updateBadgePhoto() {
    $.ajax({
        method: "GET",
        url: "/getUserPhoto"
    })
        .done(function(data)
        {
            if(data != null) {
                $('#user-photo').attr('src', 'data:image/*;base64,' + data); // convert encoded base64 string into image
            }
        })
        .fail(function(response) {
            console.log("could not perform ajax call to retrieve user badge photo");
        });
}

// retrieve user's badge info
function updateBadgeInfo() {
    $.ajax({
        method: "GET",
        url: "/getUserInfo"
    })
        .done(function(data)
        {
            $('#user-name').html(data.name);
            $('#user-title').html(data.title);

        })
        .fail(function(response) {
            console.log("could not perform ajax call to retrieve user badge info");
        });
}


$(document).ready(function() {
    $('#out-container').hide();
    getQRCode();
});