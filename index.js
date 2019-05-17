'use strict';

const apiKey = 'aZkB41dozjxTjAngpTvAOSvGR0ztkAvqNgfqZMJq';

const searchUrl = 'https://developer.nps.gov/api/v1/parks';

function watchForm() {
    $("form").submit(function(event) {
        event.preventDefault();
        let stateSearch = $("#js-state-search").val();
        let maxResults = $("#js-max-results").val();

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
        limit: maxResults,
        //api_key: apiKey
    };

    let paramString = formatParameters(params);
    let url = searchUrl + '?' + paramString;

    const options = {
        headers: new Headers({
            "X-Api-Key": apiKey,
            'Access-Control-Allow-Headers': "*",
            'Access-Control-Allow-Origin': "*"})
    };

    fetch(url, options)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error();
        })
      //.then(console.log)
      .then(reponseJson => displayResults(responseJson))
      .catch(err => {
          $(".js-err-message").text(`Something went wrong`);
      });
}

function displayResults(responseJson) {
    console.log(responseJson);
}

watchForm();