$(document).ready(function() {
    $('#search-input').on('input', function() {
        var query = $(this).val();
        if (query.length > 0) {
            $.ajax({
                url: 'https://api.clippsly.com/endpoints/functions/search-suggestions',
                method: 'GET',
                data: { query: query },
                success: function(data) {
                    console.log(data);
                    var suggestions = data;
                    if (Array.isArray(suggestions)) {
                        var suggestionsHtml = suggestions.map(function(suggestion) {
                            return '<div class="suggestion-item">' + suggestion + '</div>';
                        }).join('');
                        $('#search-suggestions').html(suggestionsHtml).show();
                    } else {
                        console.error('Suggestions not found in the API response');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('API request failed', status, error);
                }
            });
        } else {
            $('#search-suggestions').hide();
        }
    });

    $(document).on('click', function(event) {
        if (!$(event.target).closest('#search-input, #search-suggestions').length) {
            $('#search-suggestions').hide();
        }
    });

    $(document).on('click', '.suggestion-item', function() {
        var text = $(this).text();
        $('#search-input').val(text);
        $('#search-suggestions').hide();
    });
});