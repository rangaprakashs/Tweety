var UI = (function UI() {
    'use strict';
    let $submit_button = $('[rel*="js-input-submit"]');
    let $user_input_element = $('[rel*="js-input-text"]');
    let $loading = $('#loading').hide();
    let h2element = document.getElementById('u-name');
    let user_input_data = '';
    let formatted_data = [];
    let $sorted_data = [];

    let utility = {
        API_URL: 'http://localhost:3000/twitter',
        validateUserInput: function validateUserInput(user_input_data) {
            if (user_input_data.length > 0 && user_input_data.search(/^[a-zA-Z0-9_-]{1,30}$/) > -1) {
                h2element.innerHTML = "Hello! " + user_input_data;
                return true;
            } else {
                this.invalidate();
                $loading.hide();
                return false;
            }

        },
        invalidate: function invalidate(message) {
            $user_input_element.addClass('is-invalid');
            h2element.innerHTML = message + " Try Again!";
            $loading.hide();
            return false
        },
        validate : function validate(){
            $user_input_element.addClass('is-valid');
        }
    };

    var click_handler = $submit_button.on('click', function () {
        fetch_userinput();
        if (utility.validateUserInput(user_input_data)) {
            $loading.show();
            fetchDataFromAPI(user_input_data);
            utility.validate();
        } else {
            utility.invalidate("Invalid Input");
        }
    })

    function fetch_userinput() {
        user_input_data = $user_input_element.val();
        $submit_button.prop('disabled', true); 
        return;
    }


    function fetchDataFromAPI(user_input_data) {
        get_twitter_data(user_input_data, function (response) {
            if (response.statusText === 'error') {
                utility.invalidate(response.statusText);
                return;
            }
            $loading.hide();

            formatServerData(response, function (data) {
                formatted_data = data;
                console.log(formatted_data)
                sort_formatted_data(formatted_data, function (sorted_data) {
                    $sorted_data = sorted_data;
                    
                })
            });

            make_dataset($sorted_data, 10,function (result){
                console.log(result);
                loadCharts(result);
            });
        });
      
    }

    function get_twitter_data(user_input, response_callback) {
        //build the response...
        let user_input_obj = {
            screen_name: user_input
        };
        let url = utility.API_URL + JSON.stringify(user_input_obj);
        $.ajax({
            type: 'GET',
            url: url,
        }).done(function (response, err) {     
            $submit_button.prop('disabled', true);
            console.log(response); 
            if(response.error|| response.errors){
                utility.invalidate("Error :"+(response.error||response.errors[0].message) +" from twitter")    
                return;
            }      
            response_callback(response,err);
            $loading.hide();
          

        }).fail(function (err) {
            console.log(err);
            $submit_button.prop('disabled', false);
            response_callback(err);
            utility.invalidate("failed to make a call!!");
        }).always(function(){
            $submit_button.prop('disabled', false);
        })

    }

    function formatServerData(response_data, result_set) {
        if(!response_data.users){return;}
        let users = response_data.users;     

        let chart_data = [];

        if (response_data.users.length > 0) {
            for (let i = 0; i < users.length; i++) {
                chart_data.push({
                    followers_count: users[i].followers_count,
                    friends_count: users[i].friends_count,
                    favourites_count: users[i].favourites_count,
                    name: users[i].name,
                    screen_name: users[i].screen_name
                });
            }
        }
        result_set(chart_data)
    }

    function sort_formatted_data(chart_data, result_data) {
        let sorted_data = [];
        if (chart_data.length > 0) {
            for (let i = 0; i < chart_data.length; i++) {
                sorted_data = chart_data.sort(function (a, b) {
                    return b.followers_count - a.followers_count;
                })
            }
        }
        result_data(sorted_data);
    }

    function make_dataset(data_array, limit,response_callback) {
        let label = [];
        let data_value = [];
        let friend_data = [];
        for (let i = 0; i < limit; i++) {
            data_value.push(data_array[i].followers_count);
            label.push(data_array[i].screen_name);
            friend_data.push(data_array[i].friends_count);
        }
        let data_set = { label,data_value,friend_data };
        response_callback(data_set);
    }

})();