!function () {
    let overlayArray = [];
    let htmlData = [];

    //functions
    function attach(spot,content) {
        $(spot).append(content);
    }
    function createPagination(currentLink) {
        let filteredArray = [];
        for (var i = 0; i < $('.employee').length; i++) {
            filteredArray.push($('.employee')[i].classList[1])
        } //creates a new array housing the displayed employee numbers
        for (var j = 0; j < filteredArray.length; j++){
            if (filteredArray[j] === currentLink) {
                let currentPos = j;
                $('a.close').click(() => $('#overlay').css('display', 'none'));
                $('a.previous').click(() => previous(currentPos, filteredArray));
                $('a.next').click(() => next(currentPos, filteredArray));
            }
        }//locates the clicked employee's location in the new array housing created by the filter calls navigation
    }

    function previous(activeLink,arr) {
        activeLink - 1 < 0 ? newLink = arr.length - 1 : newLink = activeLink - 1;
        $('#overlay').html(overlayArray[arr[newLink]]);
        createPagination(arr[newLink])
    }//finds the previous employee resets if its the first employee,displays the overlay for that employee,creates navigation

    function next(activeLink,arr) {
        activeLink + 1 > arr.length-1 ? newLink = 0 : newLink = activeLink + 1;
        $('#overlay').html(overlayArray[arr[newLink]]);
        createPagination(arr[newLink])
    } //finds the next employee resets if its the last employee,displays the overlay for that employee,creates navigation

    function employeeOverlay() {
        let currentLink = this.classList[1];
        $('#overlay').html(overlayArray[this.classList[1]]);
        $('#overlay').css('display', 'block');
        $('#overlay').click((e) => e.target.id === 'overlay' ? $('#overlay').css('display', 'none') : '');
        createPagination(currentLink);
    } //gets which employee fired the event, finds his location,opens up the modual,closes when user clicks outside modual,creates navigation.

    //events
    $('.searchbtn').click(() => {
        let filterHtml = '';
        for (var i = 0; i < htmlData.length; i++) {
            if (htmlData[i].name.includes($('input.search').val()) || htmlData[i].username.includes($('input.search').val())) {
                filterHtml += htmlData[i].html
            } //searches thru the search object to find matching username/name strings
            $('#directory').html(filterHtml);
            $('.employee').click(employeeOverlay)
        } //replaces the current employee directory with the replaced one and applies navigation to overlay
    });

    $.ajax({
        url: 'https://randomuser.me/api/?results=12&exc=gender,id,registered,phone&nat=US',
        dataType: 'json',
        success: function (data) {
            for (var i = 0; i < 12; i++) {
                let searchResults = {};
                let overlay = '';
                let html = '';
                html += '<div class="employee ' + i + ' border"><img class="photo"src="' + data.results[i].picture.large + '"/>';
                html += '<div class="info"><p class="name">' + data.results[i].name.first + ' ' + data.results[i].name.last + '</p>';
                html += '<p class="email">' + data.results[i].email + '</li>';
                html += '<p class="location">' + data.results[i].location.city + ', ' + data.results[i].location.state + '</p></div></div>';
                overlay += '<div class="modual border"><img  class="overlay photo photo-lrg" src="' + data.results[i].picture.large + '">';
                overlay += '<p class="overlay name">' + data.results[i].name.first + ' ' + data.results[i].name.last + '</p>';
                overlay += '<p class="overlay username">' + data.results[i].login.username + '</p>';
                overlay += '<p class="overlay email btm-border">' + data.results[i].email + '</p>';
                overlay += '<p class="overlay cell">' + data.results[i].cell + '</p>';
                overlay += '<p class="overlay address">' + data.results[i].location.street +' '+ data.results[i].location.city + ', ';
                overlay += data.results[i].location.state + ' ' + data.results[i].location.postcode + '</p>';
                let year = data.results[i].dob.slice(0, 4);
                let month = data.results[i].dob.slice(5, 7);
                let day = data.results[i].dob.slice(8, 10);
                overlay += '<p class="overlay-dob">Birthday: ' + month + '/' + day + '/' + year + '</p><a class="close">X</a>';
                overlay += '<a class="previous"><</a><a class="next">></a></div>';
                searchResults.name = data.results[i].name.first + ' ' + data.results[i].name.last;
                searchResults.username = data.results[i].login.username;
                searchResults.html = html;
                htmlData.push(searchResults)
                overlayArray.push(overlay);
                attach('#directory', html);
            } //parses the ajax response into html to print to page and creates an object to be searched thru
            $('.employee').click(employeeOverlay);
        }
    });
}();