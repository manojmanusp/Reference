 $(document).ready(function () {
        $('td').find('p').addClass("ptag");
        $('.cssload-container').show();
        setTimeout(function () {
            $('.cssload-container').hide();

        }, 5000);
    });