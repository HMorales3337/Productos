var gBListo;

/*
    Funcion para validar el search,
    si es correcto llama al buscador,
    si no muestra los errores correpondientes
*/
function validarSearch() {
	gBListo = true;

    let strTipo = 'Invalido';
    let strSearch = document.getElementById('inputSearch').value.trim();
    let strQuery = '';

    if(strSearch == '') {
        marcarError('Porfavor ingrese un código o SKU');
        gBListo = false;
    }
    else {
        strTipo = clasificarCodig(strSearch);
        $('#smlSearch').hide();
        if(strTipo == 'Invalido') {
            marcarError('Porfavor ingrese un código o SKU valido');
            gBListo = false;
        }
    }
    
    if(gBListo) {
        strQuery = armarPeticion(strSearch, strTipo);
        enviarBuscar( strQuery );
    }
}

/*
    Funcion para detectar el <<enter>> en el search,
    para llamar a fun "validarSearch"
*/
function detectarEnter(t_event) {
    let tecla = event.which || event.keyCode;
    if( tecla == 13)
        validarSearch();
}

/*
    Funcion para mostrar los errores,
    en el elemnto marcado con su respectivo mensaje
*/
function marcarError(t_strMensaje ) {
    $('#smlSearch').text(t_strMensaje);
    $('#smlSearch').show();
    gBListo = false;
}

/*
    Funcion que devuelve si es "codigo" o "sku",
    en caso de no ser ninguno devuelve "Invalido"
*/

function clasificarCodig(t_strCodigo) {
    if(t_strCodigo.length == 5 && typeof t_strCodigo.substring(0,1) == 'string')
        return 'sku';
    else if( !isNaN(t_strCodigo)) {
        let auxNumber = parseInt(t_strCodigo, 10);
        if( auxNumber > 0 && auxNumber < 2147483647)
            return 'codigo';
    }
    return 'Invalido';
}

/*
    Funcion para armar la peticion,
    regresa la peticion lista para ser enviada
*/
function armarPeticion( t_strSearch, t_strTipo ) {
    return `localhost/consultarProductos?${t_strTipo}=${t_strSearch}`;
}

/*
    Funcion para enviar la peticion
*/
function enviarBuscar( t_strQuery) {
    $.ajax({
        type: 'GET',
        beforeSend: function(request) {
            request.setRequestHeader('token', '123');
        },
        dataType: 'json',
        url: t_strQuery,
        success: function( t_data ) {
            if( t_data.mensaje == 'Exito' )
                llenarFormulario();
            else
                marcarError(`Error ${t_data.mensaje}`);
        },
        error: function( t_e ) {
            marcarError( 'Error', 'No se pudo guardar, por favor intente más tarde' );
        }
    });
}

/*
    Funcion para llenar el formulario
*/
function llenarFormulario( t_data) {
    $('#smlSearch').hide();
    document.getElementById('inputSearch').value = t_data.codigo;
    document.getElementById('inputSearch').value = t_data.sku;
    document.getElementById('inputSearch').value = t_data.descripcion;
}
