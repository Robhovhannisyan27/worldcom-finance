$('.alert-danger').hide();
$('.places_form').submit(function(e) {
    e.preventDefault();
    var places = [],
        country = $('#select_country').val(),
        zip_code = $('#select_zip_code').val();

    if(!zip_code.length) {
    	$('.alert-danger').empty();
    	$('.alert-danger').append('<strong>Danger!</strong> Please enter zip code')
    } else {
    	$('.alert-danger').empty();
    	$('.alert-danger').append('<strong>Danger!</strong> Wrong zip code or country')
    }

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Access-Control-Allow-Origin': '*'
        }
    });
    $.ajax({
        type:'POST',
        url:'/places',
        data: {
            country,
            zip_code
        },
        success:function(data) {
            if(!data.length){
                var client = new XMLHttpRequest();
                client.open("GET", `http://api.zippopotam.us/${country}/${zip_code}`, true);
                client.onreadystatechange = function() {
                    if(client.status != 200) {
                        $('.alert-danger').show();
                        $('.table tbody').empty();
                    } else if(client.readyState == 4) {
                        let res = JSON.parse(client.response);
                        console.log(res.places);
                        $.ajax({
                            type:'POST',
                            url: '/',
                            data: { 
                                places: res.places,
                                zip_code: res["post code"],
                                country: res["country"] 
                            },
                            success: function(data) {
                                showTable(res.places);
                            }
                        })
                    };
                };
                client.send();
            } else {
                places = data;
                showTable(places);
            }
        }
    }); 
})

function showTable(places) {
    $('.table tbody').empty();
    $('.alert-danger').hide();
    places.forEach((place, index) => {
        place["name"] = place["name"] ? place["name"] : place["place name"]
        let data = '<tr><th scope="row">' + (index + 1) + '</th>';
        data += '<td>' + place["name"]  + '</td>';
        data += '<td>' + place["latitude"] + '</td>'
        data += '<td>' + place["longitude"] + '</td></tr>';
        $('.table tbody').append(data);
    })
}