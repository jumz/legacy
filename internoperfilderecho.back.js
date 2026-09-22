/* Copyright (C) 2021 Aware, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
if (!window.Promise) {
    var req = new XMLHttpRequest();
    req.open('GET', '../Common/lib/es6-promise/es6-promise.js', false);
    req.send();
    eval(req.responseText);
}

var profile = '<?xml version="1.0" encoding="utf-8"?>\
<profile version="6000000">\
<face_characteristics>\
    <pose_angle_yaw                     units="degrees" min="-10"   pref="0"    max="10"                            qWeight="2.0"/>\
    <smile_likelihood                   units="%"       min="0"     pref="0"    max="100" />    \
    <facial_dynamic_range               units="bits"    min="7"     pref="8"    max="8"     cMin="6.8"  cMax="8.0"  qWeight="3.0"/>\
    <percent_facial_brightness          units="%"       min="25"    pref="70"   max="90"    cMin="20"   cMax="90" />\
    <percent_facial_saturation          units="%"       min="0"     pref="0"    max="90"                            qWeight="4.0"/>\
    <brightness_score                   units="%"       min="0"     pref="100"  max="100" />\
</face_characteristics>\
<eye_characteristics>\
    <eye_contrast                                       min="20"    pref="100"  max="100"   cMin="15"   cMax="100" />\
    <left_eye_closed_likelihood         units="%"       min="0"     pref="0"    max="75" />\
    <right_eye_closed_likelihood        units="%"       min="0"     pref="0"    max="75" />\
    <off_angle_gaze_likelihood          units="%"       min="0"     pref="0"    max="90" />\
    <left_eye_valid_likelihood          units="%"       min="10"    pref="100"  max="100"                           qWeight="2.0"/>\
    <right_eye_valid_likelihood         units="%"       min="10"    pref="100"  max="100"                           qWeight="2.0"/>\
</eye_characteristics>\
<image_characteristics>\
    <number_channels                                    min="1"     pref="3"    max="3" />\
    <background_pad_type                                min="2"     pref="2"    max="2" />\
</image_characteristics>\
<anomalies>\
    <focus_likelihood                   units="%"       min="50"    pref="100"  max="100"                           qWeight="2.0"/>\
    <sharpness_likelihood               units="%"       min="50"    pref="100"  max="100"                           qWeight="2.0"/>\
    <glasses_likelihood                 units="%"       min="0"     pref="0"    max="100"/>\
    <dark_glasses_likelihood            units="%"       min="0"     pref="0"    max="50"/>\
    <glare_likelihood                   units="%"       min="0"     pref="0"    max="50"/>\
    <forehead_covering_likelihood       units="%"       min="0"     pref="0"    max="100"/>\
</anomalies>\
<image_geometry>\
    <eye_separation                     units="pixels"  min="90" />\
    <eye_axis_location_ratio                            min="0.5"   pref="0.6"  max="0.7" />\
    <centerline_location_ratio                          min="0.5"   pref="0.5"  max="0.5" />\
    <height_to_width_ratio                              min="1.25"  pref="1.3"  max="1.34" />\
    <image_width_to_head_width_ratio                    min="1.395" pref="1.7"  max="2.004" />\
    <head_height_to_image_height_ratio                  min="0.4"   pref="0.7"  max="0.8" />\
    <eye_axis_angle                     units="degrees" min="-5"    pref="0"    max="5" />\
</image_geometry>\
<image_storage>\
    <jpeg_quality_level                                 min="80"    pref="100"  max="100" />\
    <j2k_compression_ratio                              min="1"     pref="60"   max="60" />\
    <j2k_roi_foreground_compression_ratio               min="1"     pref="50"   max="50" />\
    <j2k_roi_background_compression_ratio               min="1"     pref="100"  max="200" />\
    <image_format                                       min="4"     pref="4"    max="4" />\
</image_storage>\
</profile>';

var photoCapture;
var photoSet;

function showMessage( message )
{
    var p = document.getElementById('display');
    p.innerHTML = message;
}

function onError( error )
{
    var message = '';
    message += error+'<br>';
    if ( error.fileName != undefined ) {
        message += '  File: '+error.fileName+'<br>'
    }
    if ( error.lineNumber != undefined ) {
        message += '  Line: '+error.lineNumber+'<br>'
    }
    if ( error.errorCode != undefined ) {
        message += '  Code: '+error.errorCode+'<br>'
    }
    var p = document.getElementById('error');
    p.innerHTML = message;
}

function onWsError( message )
{
    showMessage( 'Could not connect to server, or lost connection to server' )
}
function previewImageUpdated( base64Image )
{
    var img = new Image();
    img.onload = function()
    {
        var c = document.getElementById('canvas');
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0 );
        photoCapture.requestNextPreviewImage()
    };
    img.src = 'data:image/jpg;base64,'+ base64Image
}

// Called when an image has been captured by photoCapture.
function capturedImageUpdated( args )
{
    var analyzeResults = '';
    // Get the final image
    photoCapture.getCapturedImage( PhotoCaptureApi.ImageFormat.JPG )
    // Display the image
    .then( function(image) {        
        var finalImage = document.getElementById('finalImage');
        finalImage.src = 'data:image/jpg;base64,'+image;
        $('#foto_tomada').val('si');
    // Any exceptions are sent to the onError function.
    } ).catch(onError)
}
// End capturedImageUpdated

function autocaptureFeedbackUpdated( args )
{
    feedback_array = args[0];
    var results = '';
    for ( var i=0; i<feedback_array.length; i++ )
    {
        var code = feedback_array[i];
        results += PhotoCaptureApi.AutocaptureFeedback[code]+'<br>'
    }
    showMessage( results )
}

function initialize()
{
    // Start camera initialization.
    var results = '';
    photoCapture.openCameraType( PhotoCaptureApi.CameraType.ANY ).then( function() {
        results += 'Opened camera<br>';
        showMessage( results );
        return photoCapture.getCameraName()
    } ).then( function( name ) {
        results += 'Camera name: '+name+'<br>';
        showMessage( results );
        return photoCapture.getCameraPropertyValues( PhotoCaptureApi.CameraProperty.CAPTURE_HEIGHT )
    } ).then( function( values ) {
        results += 'Got capture sizes: '+values+'<br>';
        showMessage( results );
        var capture_index = 0;
        for ( var index=0; index<values.length; index++ )
        {
            // Select the highest resolution that isn't too high.
            // Resolutions too high (above 1080p) cause performance issues.
            if ( values[index] >= 1090 )
                continue
            capture_index = index
        }
        return photoCapture.setCameraPropertyIndex(
            PhotoCaptureApi.CameraProperty.CAPTURE_HEIGHT, capture_index )
    } ).then( function( values ) {
        results += 'Set capture size<br>';
        showMessage( results );
        return photoCapture.getCameraPropertyValues( PhotoCaptureApi.CameraProperty.PREVIEW_HEIGHT )
    } ).then( function( values ) {
        results += 'Got preview sizes: '+values+'<br>';
        showMessage( results );
        var preview_index = 0;
        for ( var index=values.length-1; index>=0; index-- )
        {
            // Select the lowest resolution that isn't too low.
            if ( values[index] < 400 )
                continue;
            preview_index = index
        }
        return photoCapture.setCameraPropertyIndex(
            PhotoCaptureApi.CameraProperty.PREVIEW_HEIGHT, preview_index )
    } ).then( function() {
        results += 'Set Preview size<br>';
        return photoCapture.setAutocaptureProfile( profile )
    } ).then( function() {
        results += 'Set autocapture profile<br>';
        return photoCapture.setAutocaptureMode( PhotoCaptureApi.AutocaptureMode.ON )
    } ).then( function() {
        results += 'Set autocapture mode<br>';
        showMessage( results );
        return photoCapture.getCameraPropertyIndex( PhotoCaptureApi.CameraProperty.EXPOSURE )
    } ).then( function( value ) {
        results += 'Got exposure value: '+value+'<br>';
        showMessage( results );
        // Increasing value increases exposure, reducing value decreases exposure.
        exposureAdjustment = 1;
        return photoCapture.setCameraPropertyIndex(
            PhotoCaptureApi.CameraProperty.EXPOSURE, value+exposureAdjustment )
    } ).then( function() {
        results += 'Finished initializing the camera'+'<br>';
        showMessage( results )
    } ).catch( onError );
    // Finish camera initialization.
}

function startAutoCapture()
{
    // 
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);

    // Start the preview.
    photoCapture.startPreview( PhotoCaptureApi.ImageFormat.JPG ).then( function() {
        showMessage( 'Started preview' )
        ocultarMensaje();
    } ).catch(onError);
    // Preview images will now be sent to previewImageUpdated as they become
    // available.
}

function stopAutoCapture()
{
    photoCapture.endPreview().then( function() {
        showMessage( 'Ended preview' )
    } ).catch(onError)
}

function captureImage()
{
    photoCapture.captureImage().then( function() {
        showMessage( 'Started capture' )
    } ).catch(onError)
}




$('#btnGuardar').click(function(){
    var id_interno = $('#id_interno').val();
    var imagen = $('#finalImage').attr('src');
    var foto_tomada = $('#foto_tomada').val();
    if(foto_tomada=='no'){
        mostrarError("No se encontró rosto capturado");
        return false;
    }     
    mostrarEspera();
    xajax_guardarPerfil(id_interno, imagen); 
});

$('#btnGuardarContinuar').click(function(){
    var id_interno = $('#id_interno').val();
    var imagen = $('#finalImage').attr('src');
    var foto_tomada = $('#foto_tomada').val();
    var siguiente_paso = $('#siguiente_paso').val();
    if(foto_tomada=='no'){
        mostrarError("No se encontró rosto capturado");
        return false;
    }   
    mostrarEspera();
    xajax_guardarPerfilContinuar(id_interno, imagen, siguiente_paso); 
});

$(document).ready(function(){
    mostrarEspera();
    $('#startAutoCapture').click(function(){
        location.reload();
    });



    /*var eliminar_aware={
        'text':'eliminar_aware'
    };
    

    var activar_aware={
        'text':'activar_aware'
    }
  */
});

    var webSocket2 = $.simpleWebSocket({ url: 'ws://127.0.0.1:2012/' });

    webSocket2.listen(function(message) {
        console.log('listen '+message.text);


       // $('#content').prepend(message.text+'\n');
    });

    webSocket2.send({ 'text': 'eliminar_aware' }).done(function() {
        console.log('message send 1');
        $('#aware_desactivado').val('si');

    }).fail(function(e) {
        // your error handling e. g.
        console.log(e);
    });    

    setInterval(function(){
        if($('#aware_desactivado').val()=='si'){ 
            webSocket2.send({ 'text': 'activar_aware' }).done(function() {
                console.log('message send 2');
                setTimeout(function(){ 
                // Create a web socket connection for the PhotoCapture API.
                photoCaptureWs = new WebSocket( 'ws://localhost:2080' );
                // Register the error handler for the PhotoCapture web socket.
                photoCaptureWs.onerror = onWsError;
                // Once the connection has been established, create the PhotoCapture object
                // and register all callbacks.
                photoCaptureWs.onopen = function( message )
                {

                    var transport = createWebsocketTransport(photoCaptureWs);

                    createPhotoCapture( transport, "PhotoCapture" ).then( function( instance ) {
                        photoCapture = instance;
                        photoCapture.setPreviewImageUpdated( previewImageUpdated );
                        photoCapture.setAutocaptureFeedbackUpdated( autocaptureFeedbackUpdated );
                        photoCapture.setCapturedImageUpdated( capturedImageUpdated );
                        return photoCapture.getVersionString()
                    } ).then( function( version ) {
                        var p = document.getElementById('version');
                        p.innerHTML += version+'<br>'
                    } ).catch(onError);

                    createPhotoSet( transport, "PhotoSet" ).then( function( instance ) {
                        photoSet = instance;
                        return photoSet.getVersionString()
                    } ).then( function( version ) {
                        var p = document.getElementById('version');
                        p.innerHTML += version+'<br>';
                        initialize();
                        startAutoCapture(); 
                        return photoSet.setProfile( profile )
                    } ).catch(onError)
                };
                }, 5000);


            }).fail(function(e) {
                // your error handling e. g.
                console.log(e);
            });
            //clearInterval();
            $('#aware_desactivado').val('no');
            if($('#primera_vez').val()=='no'){
                ocultarMensaje();
            }            
        }
    }, 1000);

