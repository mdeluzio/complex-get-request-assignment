'use strict';

const apiKey = 'aZkB41dozjxTjAngpTvAOSvGR0ztkAvqNgfqZMJq';

const searchUrl = 'https://developer.nps.gov/api/v1/parks';

function watchForm() {
    $("form").submit(function(event) {
        event.preventDefault();
        let stateSearch = $("#js-state-search").val().replace(/\s/g, "");
        let maxResults = $("#js-max-results").val();

        $(".js-err-message").empty();

        getParks(stateSearch, maxResults);
    });
}

function formatParameters(params) {
    let searchItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    return searchItems.join('&');
}

function getParks(stateSearch, maxResults) {
    const params = {
        stateCode: stateSearch,
        limit: maxResults-1,
        api_key: apiKey,
        fields: 'addresses'
    };

    let paramString = formatParameters(params);
    let url = searchUrl + '?' + paramString;


    fetch(url)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error();
        })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
          console.log(err)
          $(".js-err-message").text(`Something went wrong`);
      });
}

function displayResults(responseJson) {
    console.log(responseJson);

    $('.js-results-list').empty();

    if (responseJson.data.length === 0) {
        $(".js-err-message").text(`Invalid State Code, try again`);
        $('.result-container').addClass('hidden');
    } else {
        $('.result-container').removeClass('hidden');
    };

    for (let i = 0; i < responseJson.data.length; i++) {
        $(".js-results-list").append(`
            <li>
                <h3>${responseJson.data[i].fullName}</h3> 
                <p>${responseJson.data[i].description}</p>
                <p>Address:<br>
                    ${responseJson.data[i].addresses.length > 1 && responseJson.data[i].addresses[1].line1}<br>
                    ${responseJson.data[i].addresses.length > 1 && responseJson.data[i].addresses[1].city}, 
                    ${responseJson.data[i].addresses.length > 1 && responseJson.data[i].addresses[1].stateCode} 
                    ${responseJson.data[i].addresses.length > 1 && responseJson.data[i].addresses[1].postalCode}</p> 
                <p><a href="${responseJson.data[i].url}" target="_blank">Go to site</a></p>
            </li>
        `)

    }

    
} 

watchForm();
