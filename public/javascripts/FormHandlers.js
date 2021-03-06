'use strict';

// Handler for customized form submission
function submitInBackground(formSelector, submitURL, successCallback = () => null, extraData = []) {

    let formElem = $(formSelector);

    formElem.submit(function (e) {

        // Prevent the form from clearing
        e.preventDefault();

        // Get form data
        let formData = $(this).serializeArray();

        // Add extra data fields to the form
        extraData.forEach((item) => {
            formData.push(item);
        });

        // Submit the form asynchronously
        $.ajax({
            method: "post",
            url: submitURL,
            data: formData,
            dataType: "json",
            success: function (responseData, textStatus, jqXHR) {
                successCallback(responseData, formData, formElem);
            }
        });
    })
}

// Submit a form, after adding fields for the user's current latitude and longitude
function submitWithGeo(formSelector, submitURL, successCallback, method = "post") {

    let formElem = $(formSelector);

    formElem.on("submit", function (e) {

        // Prevent the form from clearing
        e.preventDefault();

        // Get form data
        let formData = $(this).serializeArray();

        // Post the form data to the server
        function sendForm(extraData = []) {

            extraData.forEach((item) => {
                formData.push(item);
            });

            $.ajax({
                method: method,
                url: submitURL,
                data: formData,
                dataType: "json",
                success: function (responseData, textStatus, jqXHR) {

                    successCallback(responseData, formData, formElem);
                }
            });
        }

        // Options for the GeoLocation lookup
        let options = {
            "maximumAge": 10 * 1000
        };

        // Callback when user position is obtained
        function geoSuccess(position) {

            const extraData = [
                {name: "longitude", value: position.coords.longitude},
                {name: "latitude", value: position.coords.latitude}
            ];

            sendForm(extraData);
        }

        // Callback when user position cannot be obtained
        function geoFailure(error) {

            console.log("Failed to acquire user position");

            sendForm();
        }

        // Get the user's location at time of submission
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure, options);
    });
}