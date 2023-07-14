$(document).ready(function () {
    $(".btn-ajaxform").click(function(e){
        if($(this).closest('form')[0].checkValidity()){
        e.preventDefault();
        var ajaxform = $(this).closest("form");
        var formurl = ajaxform.attr("action");
        $(".btn-ajaxform").attr("disabled", true);

          var data = ajaxform.serialize();
          
          ajaxform.find('input[type="checkbox"]').each( function () {
                var checkbox = $(this);
                if(!checkbox.is(':checked')) {
                    data += '&'+ checkbox.attr("name") +'='+'0';
                }
        })

        $.ajax({
            url: formurl,
            type:'POST',
            data: data,
        success: function(data) {
            if($.isEmptyObject(data.error)){
                if(data.redirect) {
                    window.location.href = data.redirect; 
                }
                if(data.success) {
                      Swal.fire({
                        icon: 'success',
                        html: data.success,
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-light btn-block'
                      })
                }
            }else{ 
                var errormodal = '';
                $.each(data.error, function(index, value) {
                   errormodal += value +'<br>';
                   $(".btn-ajaxform").removeAttr( "disabled" );
                });

                Swal.fire({
                    icon: 'error',
                    html: errormodal,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-danger btn-block'
                  })

            }
        },
        statusCode: {
            // 404, 500
            401: function() { 
                location.reload();
            }, 
            419: function() { 
                location.reload();
            },
            302: function() { 
                location.reload(); 
            }
        },
        error: function(xhr, textStatus, error){

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: xhr.statusText,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger btn-block'
              })

            //toastr.error(xhr.statusText);
            $(".btn-ajaxform").removeAttr( "disabled" );
            if (xhr.statusText == 'Session timeout. please login!' || xhr.statusText == 'Unauthorized') {
                location.reload();
            }
          }
        });
    }
    });

});