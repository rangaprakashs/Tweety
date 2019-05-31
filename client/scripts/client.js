'use strict';
var UI = (function UI() {
    //helper methods.
    var helper = {
        validateUserInput: function validateUserInput(user_input) {
            if (/^[a-zA-Z0-9_]{1,50}/.test(user_input) &&
                user_input.length > 0 &&
                user_input !== '') {
                return true;
            }
            return false;
        },
        invalidate: function invalidate() {
            $loading.hide();

        },
        api_url: 'http://localhost:3000/twitter',

        invalidate: function invalidate(message) {
            console.log(message);
            h2element.innerHTML = "Error! " + message;
            $user_input_element.addClass('is-invalid');

        }
    }

    var $submit_button = $('[rel*="js-input-submit"]');
    var $user_input_element = $('[rel*="js-input-text"]');
    var $loading = $('#loading').hide();
    var h2element = document.getElementById('u-name');

    $submit_button.on('click', clickHandler);

    function clickHandler() {
        var user_input = $user_input_element.val()
        if (!helper.validateUserInput(user_input)) {
            helper.invalidate("Invalid Twitter Handle");
            return;
        }
        $loading.show();
        $user_input_element.addClass('is-valid');
        h2element.innerHTML = user_input;
        fetchUserHandle(user_input);
    }

    function fetchUserHandle(user_input) {
        getData(user_input);
    }

    function getData(user_input) {
        var user_data = {
            screen_name: user_input
        };
        var url = helper.api_url + JSON.stringify(user_data);
        $.ajax({
            type: 'GET',
            url: url,
        }).done(function (response) {
            validate_response(response);
        }).fail(function (err) {
            validate_response(err);
        }).always(function () {
            $loading.hide();
        });
    };

    function validate_response(response) {

        console.log(response);
        if (response.error) {
            helper.invalidate("Failed Twitter Call!")
            return;
        }
        if (response.users === 'undefined') {
            helper.invalidate("Incorrect Response from Twitter");
            return;
        }
        if (response.errors) {
            helper.invalidate("Invalid Response " + response.errors[0].message);
            return;
        }

        if (response.users <= 0) {
            return false;
        }
        if (response.statusText === "error") {
            helper.invalidate("Connection Error! to Server")
            return false;
        }
        if (response.users.length < 10) {
            helper.invalidate("The User has too few  Data to Chartify")
            return false;
        }
        console.log('Response Validated!' + JSON.stringify(response));
        loadData(response.users);

    }

    function loadData(users) {

        let relevant_data = [];
        for (let i = 0; i < users.length; i++) {
            relevant_data.push({
                followers_count: users[i].followers_count,
                friends_count: users[i].friends_count,
                favourites_count: users[i].favourites_count,
                name: users[i].name,
                screen_name: users[i].screen_name
            });
        }

        sort_data(relevant_data, function (data) {
            relevant_data = data;
        });

        make_chart_data(relevant_data, 10, function (data) {
            console.log(data);
            console.log("Now just load the charts");

            loadCharts(data);
        }); // return the response after sorting the dataset        
    }


    function sort_data(relevant_data, callback) {
        var sorted_data = [];
        sorted_data = relevant_data.sort(function (a, b) {
            return b.followers_count - a.followers_count;
        });

        callback(sorted_data);
    }

    function make_chart_data(relevant_data, limit, callback) {
        let label = [];
        let data = [];
        let friends_count = [];

        for (let i = 0; i < limit; i++) {
            label.push(relevant_data[i].name);
            data.push(relevant_data[i].followers_count);
            friends_count.push(relevant_data[i].friends_count);
        }
        let dataset = {
            label: label,
            data: data,
            friends_count: friends_count
        };
        callback(dataset);
    }

})();