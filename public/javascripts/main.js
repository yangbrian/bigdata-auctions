$(document).ready(function() {
    $('#submit-button').on('click', function () {
        console.warn("Submit!");
    });

    // hide the error if its visible when the modal opens
    $('#new-auction').on('shown.bs.modal', function () {
        $('#new-auction-error').hide();
    });

    // submit the new auction form and redirect if successful
    $('#new-auction-form').on('submit', function (e) {
        e.preventDefault();

        $.post('/auction/new', $(this).serialize(), function (data) {
            if (data.success) {
                window.location.href = '/auction/' + data.id + '?post=true';
            } else {
                $('#new-auction-error').fadeIn();
            }
        });
    });
});