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