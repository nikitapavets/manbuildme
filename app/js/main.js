$( document ).ready(function(){

    $(".dropdown-button").dropdown();

    $('.chips-placeholder').material_chip({
        placeholder: 'Enter a tag',
        secondaryPlaceholder: '+Tag',
    });

    $('input.input').autocomplete({
        data: {
            "Apple": null,
            "Microsoft": null,
            "Google": null
        }
    });
});

