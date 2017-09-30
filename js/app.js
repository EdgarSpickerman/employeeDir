!function () {
        $.ajax({
            url: 'https://randomuser.me/api/?results=12&exc=gender,id,registered,phone',
            dataType: 'json',
            success: function (data) {
                console.log(data);
            }
        });
}();
