/* Copyright (C) 2019 Aware, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
 
/** @namespace
  */
var PhotoCaptureApi =
{
    /** Camera properties.
     *  @enum {number} */
    CameraProperty : 
    (function()
    {
        var values = {};
        /** Preview image width of the camera.  (Constrained by current
         *  Capture Resolution setting to valid Preview Resolutions.) */
        values[values.PREVIEW_WIDTH = 0] = "PREVIEW_WIDTH";

        /** Preview image height of the camera.  (Constrained by current
         *  Capture Resolution setting to valid Preview Resolutions.) */
        values[values.PREVIEW_HEIGHT = 1] = "PREVIEW_HEIGHT";

        /** Capture image width of the camera. */
        values[values.CAPTURE_WIDTH = 2] = "CAPTURE_WIDTH";

        /** Capture image height of the camera. */
        values[values.CAPTURE_HEIGHT = 3] = "CAPTURE_HEIGHT";

        /** Exposure of the camera. */
        values[values.EXPOSURE = 4] = "EXPOSURE";

        /** Focus of the camera. */
        values[values.FOCUS = 5] = "FOCUS";

        /** Zoom of the camera. */
        values[values.ZOOM = 6] = "ZOOM";

        /** Enable or disable auto exposure settings of the camera. */
        values[values.AUTO_EXPOSURE = 7] = "AUTO_EXPOSURE";

        /** Enable or disable auto focus settings of the camera. */
        values[values.AUTO_FOCUS = 8] = "AUTO_FOCUS";

        /** Enable or disable the camera's light.  Property index 0 for off
         *  and property index 1 for on. */
        values[values.LIGHT = 9] = "LIGHT";

        /** Flash setting */
        values[values.FLASH = 10] = "FLASH";

        /** Set or query the clockwise image rotation angle. */
        values[values.ROTATION_ANGLE = 11] = "ROTATION_ANGLE";

        /** Set or query the white balance setting. */
        values[values.WHITE_BALANCE = 12] = "WHITE_BALANCE";

        /** Set or query the camera ISO speed. */
        values[values.ISO_SPEED = 13] = "ISO_SPEED";

        /** Set or query the camera shutter speed. */
        values[values.SHUTTER_SPEED = 14] = "SHUTTER_SPEED";

        /** Set or query the camera metering mode. */
        values[values.METERING_MODE = 15] = "METERING_MODE";

        /** Preview image width of the camera. (Not constrained by current
         *  Capture Resolution setting.  Only used to query device
         *  capabilities.) */
        values[values.ALL_PREVIEW_WIDTH = 16] = "ALL_PREVIEW_WIDTH";

        /** Preview image height of the camera. (Not constrained by current
         *  capture resolution settings.  Only used to query device
         *  capabilities.) */
        values[values.ALL_PREVIEW_HEIGHT = 17] = "ALL_PREVIEW_HEIGHT";

        /** When enabled, the camera will stream at the capture resolution
         *  selected and analyze the images downsampled to the preview
         *  resolution.  The full sized image is used in AutoCapture to
         *  immediately return a captured frame instead of switching the
         *  camera to the capture resolution then taking them image.  This
         *  property is only available for DirectX cameras.  Property index
         *  0 for off and 1 for on. */
        values[values.GENERATE_CAPTURE_CANDIDATES = 18] = "GENERATE_CAPTURE_CANDIDATES";

        /** Enable or disable auto white balancing settings of the camera. */
        values[values.AUTO_WHITE_BALANCE = 19] = "AUTO_WHITE_BALANCE";

        /** Set or query the camera color temperature setting. */
        values[values.COLOR_TEMPERATURE = 20] = "COLOR_TEMPERATURE";

        /** Enable or disable automatic color temperature on the camera. */
        values[values.AUTO_COLOR_TEMPERATURE = 21] = "AUTO_COLOR_TEMPERATURE";

        return values;
    })(),

    /** Autocapture analysis mode.
     *  @enum {number} */
    AutocaptureMode : 
    (function()
    {
        var values = {};
        /** Do not run analysis. (Default): */
        values[values.OFF = 0] = "OFF";

        /** Run analysis and make decisions based on autocapture results. */
        values[values.ON = 1] = "ON";

        /** Run analysis but ignore autocapture results. */
        values[values.OBSERVER = 2] = "OBSERVER";

        return values;
    })(),

    /** Feedback from the autocapture algorithm.
     *  @enum {number} */
    AutocaptureFeedback : 
    (function()
    {
        var values = {};
        /** AutoCapture is off and unconfigured. */
        values[values.OFF = 0] = "OFF";

        /** The image analyzed is compliant with the current profile. */
        values[values.COMPLIANT_IMAGE = 1] = "COMPLIANT_IMAGE";

        /** AutoCapture has triggered the capture of an image.  The preview
         *  is ending. */
        values[values.CAPTURE_IMAGE = 2] = "CAPTURE_IMAGE";

        /** Image resolution is too low to be compliant. */
        values[values.IMAGE_RESOLUTION_TOO_LOW = 3] = "IMAGE_RESOLUTION_TOO_LOW";

        /** No face was detected in the image provided. */
        values[values.NO_FACE_DETECTED = 4] = "NO_FACE_DETECTED";

        /** Multiple faces were detected in the image provided. */
        values[values.MULTIPLE_FACES_DETECTED = 5] = "MULTIPLE_FACES_DETECTED";

        /** The subject's facial pose is invalid. */
        values[values.INVALID_POSE = 6] = "INVALID_POSE";

        /** The subject's face is too far from the camera. */
        values[values.FACE_TOO_FAR = 7] = "FACE_TOO_FAR";

        /** The subject's face is too close to the camera. */
        values[values.FACE_TOO_CLOSE = 8] = "FACE_TOO_CLOSE";

        /** The subject's face is too far to the left. */
        values[values.FACE_ON_LEFT = 9] = "FACE_ON_LEFT";

        /** The subject's face is too far to the right. */
        values[values.FACE_ON_RIGHT = 10] = "FACE_ON_RIGHT";

        /** The subject's face is too high in the frame. */
        values[values.FACE_TOO_HIGH = 11] = "FACE_TOO_HIGH";

        /** The subject's face is too low in the frame. */
        values[values.FACE_TOO_LOW = 12] = "FACE_TOO_LOW";

        /** The lighting is too dark. */
        values[values.INSUFFICIENT_LIGHTING = 13] = "INSUFFICIENT_LIGHTING";

        /** The lighting is too bright. */
        values[values.LIGHT_TOO_BRIGHT = 14] = "LIGHT_TOO_BRIGHT";

        /** The camera is out of focus. */
        values[values.TOO_MUCH_BLUR = 15] = "TOO_MUCH_BLUR";

        /** The subject is non-compliant due to the presence of eye-wear. */
        values[values.GLASSES_PRESENT = 16] = "GLASSES_PRESENT";

        /** The subject is non-compliant due to the absence of eye-wear. */
        values[values.GLASSES_ABSENT = 17] = "GLASSES_ABSENT";

        /** The subject is non-compliant because they are smiling. */
        values[values.SMILE_PRESENT = 18] = "SMILE_PRESENT";

        /** The subject is non-compliant because they are not smiling. */
        values[values.SMILE_ABSENT = 19] = "SMILE_ABSENT";

        /** The subject's forehead is covered. */
        values[values.FOREHEAD_COVERING = 20] = "FOREHEAD_COVERING";

        /** The background is too cluttered. */
        values[values.BACKGROUND_TOO_CLUTTERED = 21] = "BACKGROUND_TOO_CLUTTERED";

        /** The background is too bright. */
        values[values.BACKGROUND_TOO_BRIGHT = 22] = "BACKGROUND_TOO_BRIGHT";

        /** The background is too dark. */
        values[values.BACKGROUND_TOO_DARK = 23] = "BACKGROUND_TOO_DARK";

        /** The subject's gender is non-compliant with the current profile. 
         *  Gender must be female. */
        values[values.GENDER_NOT_FEMALE = 24] = "GENDER_NOT_FEMALE";

        /** The subject's gender is non-compliant with the current profile. 
         *  Gender must be male. */
        values[values.GENDER_NOT_MALE = 25] = "GENDER_NOT_MALE";

        /** The subject's race is non-compliant with the current profile. 
         *  Race must be White. */
        values[values.RACE_NOT_WHITE = 26] = "RACE_NOT_WHITE";

        /** The subject's race is non-compliant with the current profile.
         *  Race must be Black. */
        values[values.RACE_NOT_BLACK = 27] = "RACE_NOT_BLACK";

        /** The subject's race is non-compliant with the current profile. 
         *  Race must be Asian. */
        values[values.RACE_NOT_ASIAN = 28] = "RACE_NOT_ASIAN";

        /** The subject's left eye is closed. */
        values[values.LEFT_EYE_CLOSED = 29] = "LEFT_EYE_CLOSED";

        /** The subject's right eye is closed. */
        values[values.RIGHT_EYE_CLOSED = 30] = "RIGHT_EYE_CLOSED";

        /** The subject's left eye is obstructed. */
        values[values.LEFT_EYE_OBSTRUCTED = 31] = "LEFT_EYE_OBSTRUCTED";

        /** The subject's right eye is obstructed. */
        values[values.RIGHT_EYE_OBSTRUCTED = 32] = "RIGHT_EYE_OBSTRUCTED";

        /** The subject's gaze is off angle. */
        values[values.OFF_ANGLE_GAZE = 33] = "OFF_ANGLE_GAZE";

        /** The subject is non-compliant due to the thickness of their
         *  eye-wear frames. */
        values[values.HEAVY_FRAMES = 34] = "HEAVY_FRAMES";

        /** The frame is non-compliant due to excessive glare. */
        values[values.GLARE = 35] = "GLARE";

        /** The subject is non-compliant due to the presence of dark
         *  glasses. */
        values[values.DARK_GLASSES = 36] = "DARK_GLASSES";

        /** The subject is too young for the current profile. */
        values[values.TOO_YOUNG = 37] = "TOO_YOUNG";

        /** The subject is too old for the current profile. */
        values[values.TOO_OLD = 38] = "TOO_OLD";

        /** Shadows detected on the subject's face. */
        values[values.FACIAL_SHADOWING = 39] = "FACIAL_SHADOWING";

        /** Red eye detected for the subject. */
        values[values.RED_EYE = 40] = "RED_EYE";

        /** An unnatural lighting color was detected in the frame. */
        values[values.UNNATURAL_LIGHTING_COLOR = 41] = "UNNATURAL_LIGHTING_COLOR";

        /** Internal Error 1 */
        values[values.AWARE_INTERNAL_ERROR_1 = 42] = "AWARE_INTERNAL_ERROR_1";

        /** The subject is non-compliant due to the presence of a mask being
         *  detected. */
        values[values.MASK_PRESENT = 44] = "MASK_PRESENT";

        /** The subject is non-compliant due to the absence of a mask being
         *  detected. */
        values[values.MASK_ABSENT = 45] = "MASK_ABSENT";

        /** No face detected as environment is too dark */
        values[values.ENVIRONMENT_TOO_DARK = 46] = "ENVIRONMENT_TOO_DARK";

        /** The analyzed image was within all profile parameter ranges but
         *  found non-compliant. */
        values[values.UNKNOWN = 999] = "UNKNOWN";

        return values;
    })(),

    /** The current camera status.
     *  @enum {number} */
    CameraStatus : 
    (function()
    {
        var values = {};
        /** Camera is disconnected. */
        values[values.DISCONNECTED = 0] = "DISCONNECTED";

        /** Camera is connected, but not opened. */
        values[values.CONNECTED = 1] = "CONNECTED";

        /** Camera is open and available for use. */
        values[values.OPEN = 2] = "OPEN";

        /** Camera is currently previewing. */
        values[values.PREVIEWING = 3] = "PREVIEWING";

        /**  */
        values[values.CAPTURING = 4] = "CAPTURING";

        /** Camera has been set to an unsupported mode. */
        values[values.UNSUPPORTED_MODE = 5] = "UNSUPPORTED_MODE";

        return values;
    })(),

    /** The supported camera types.
     *  @enum {number} */
    CameraType : 
    (function()
    {
        var values = {};
        /** Any supported camera type. */
        values[values.ANY = -1] = "ANY";

        /** An unsupported camera type. */
        values[values.UNSUPPORTED = 0] = "UNSUPPORTED";

        /** Cameras that use DirectX. */
        values[values.DIRECTX = 1] = "DIRECTX";

        /** Cameras that use the EOS SDK. */
        values[values.EOS = 2] = "EOS";

        /** iDS Camera that uses the uEye SDK. */
        values[values.IDS = 3] = "IDS";

        /** Videology Camera that uses DirectX with the Videology SDK
         *  (optional) */
        values[values.VIDEOLOGY = 4] = "VIDEOLOGY";

        /** External user camera. */
        values[values.EXTERNAL = 5] = "EXTERNAL";

        /** Iris ID iCAM TD100. */
        values[values.ICAM_TD100 = 6] = "ICAM_TD100";

        return values;
    })(),

    /** Image format
     *  @enum {number} */
    ImageFormat : 
    (function()
    {
        var values = {};
        /** RAW format */
        values[values.RAW = 1] = "RAW";

        /** BMP format */
        values[values.BMP = 2] = "BMP";

        /** JPEG format */
        values[values.JPG = 5] = "JPG";

        /** PNG format */
        values[values.PNG = 7] = "PNG";

        return values;
    })(),

    /** Barcode hint type.
     *  @enum {number} */
    BarcodeHint : 
    (function()
    {
        var values = {};
        /** Unknown type. */
        values[values.UNKNOWN = -1] = "UNKNOWN";

        /** EAN-13 type. */
        values[values.EAN_13 = 1] = "EAN_13";

        /** Will read any EAN supplemental barcode and appened a space and
         *  the supplemental value to the primary value. */
        values[values.EAN_13_SUPPLEMENTAL = 2] = "EAN_13_SUPPLEMENTAL";

        /** EAN-8 type. */
        values[values.EAN_8 = 3] = "EAN_8";

        /** UPC-A type. */
        values[values.UPC_A = 4] = "UPC_A";

        /** UPC-E type. */
        values[values.UPC_E = 5] = "UPC_E";

        /** Code 39 type. */
        values[values.CODE_39 = 6] = "CODE_39";

        /** Code 93 type. */
        values[values.CODE_93 = 7] = "CODE_93";

        /** Code 128 type. */
        values[values.CODE_128 = 8] = "CODE_128";

        /** Code 128 barcodes of symbol set C, without the normal start and
         *  stop characters. */
        values[values.SHORT_CODE_128 = 9] = "SHORT_CODE_128";

        /** Codabar type. */
        values[values.CODABAR = 10] = "CODABAR";

        /** Data Matric Type. */
        values[values.DATAMATRIX = 11] = "DATAMATRIX";

        /** QR Code type. */
        values[values.QRCODE = 12] = "QRCODE";

        /** PDF417 type. */
        values[values.PDF417 = 13] = "PDF417";

        /** MicroPDF417 type. */
        values[values.MICRO_PDF417 = 14] = "MICRO_PDF417";

        /** Databar type. */
        values[values.DATABAR = 15] = "DATABAR";

        /** Code 25 type. */
        values[values.CODE_25 = 16] = "CODE_25";

        /** Code 25 non-interleaved type. */
        values[values.CODE_25_NI = 17] = "CODE_25_NI";

        return values;
    })(),


    /** List of error codes.
     *  @enum {number} */
    ErrorCode : 
    (function()
    {
        var values = {};
        /** No errors or warnings. */
        values[values.NO_ERRORS = 0] = "NO_ERRORS";

        /** Internal error. */
        values[values.INTERNAL_ERROR = 1] = "INTERNAL_ERROR";

        /** The library failed to allocate memory. */
        values[values.OUT_OF_MEMORY = 100] = "OUT_OF_MEMORY";

        /** The photo_capture object was NULL. */
        values[values.NULL_PHOTO_CAPTURE_OBJ = 101] = "NULL_PHOTO_CAPTURE_OBJ";

        /** A camera has not been opened. */
        values[values.CAMERA_NOT_OPENED = 102] = "CAMERA_NOT_OPENED";

        /** A function that required preview was called before preview was
         *  started. */
        values[values.PREVIEW_NOT_STARTED = 103] = "PREVIEW_NOT_STARTED";

        /** A function that required capture was called before capture was
         *  started. */
        values[values.CAPTURE_NOT_STARTED = 104] = "CAPTURE_NOT_STARTED";

        /** Failed to open a session with the camera. */
        values[values.FAILED_TO_OPEN_CAMERA = 105] = "FAILED_TO_OPEN_CAMERA";

        /** Failed to retrieve the captured image from the camera. */
        values[values.FAILED_TO_RETRIEVE_CAPTURED_IMAGE = 106] = "FAILED_TO_RETRIEVE_CAPTURED_IMAGE";

        /** The camera has been disconnected. */
        values[values.CAMERA_DISCONNECTED = 109] = "CAMERA_DISCONNECTED";

        /** An invalid camera property was given. */
        values[values.INVALID_CAMERA_PROPERTY = 110] = "INVALID_CAMERA_PROPERTY";

        /** An invalid index was given for a camera property. */
        values[values.INVALID_CAMERA_PROPERTY_INDEX = 111] = "INVALID_CAMERA_PROPERTY_INDEX";

        /** Cannot convert the image to the target format. */
        values[values.CANNOT_CONVERT_TO_FORMAT = 112] = "CANNOT_CONVERT_TO_FORMAT";

        /** Invalid image format. */
        values[values.INVALID_IMAGE_FORMAT = 113] = "INVALID_IMAGE_FORMAT";

        /** The profile specified was not a valid PreFace 6 profile. */
        values[values.INVALID_PROFILE = 114] = "INVALID_PROFILE";

        /** The camera is busy and could not complete the operation. */
        values[values.BUSY = 115] = "BUSY";

        /** There is no captured image available. */
        values[values.NO_CAPTURED_IMAGE = 116] = "NO_CAPTURED_IMAGE";

        /** Focus failed when taking a picture. */
        values[values.FOCUS_FAILED = 127] = "FOCUS_FAILED";

        /** Failed to set camera property. */
        values[values.SET_CAMERA_PROPERTY_FAILED = 128] = "SET_CAMERA_PROPERTY_FAILED";

        /** Failed to get camera property. */
        values[values.GET_CAMERA_PROPERTY_FAILED = 129] = "GET_CAMERA_PROPERTY_FAILED";

        /** No valid cameras were found connected to the computer. */
        values[values.NO_CAMERA_CONNECTED = 130] = "NO_CAMERA_CONNECTED";

        /** No camera of the specified type was found connected to the
         *  computer. */
        values[values.NO_CAMERA_TYPE_CONNECTED = 131] = "NO_CAMERA_TYPE_CONNECTED";

        /** No camera of the specified name was found connected to the
         *  computer. */
        values[values.NO_CAMERA_NAME_CONNECTED = 132] = "NO_CAMERA_NAME_CONNECTED";

        /** No profile has been specified. */
        values[values.NO_PROFILE_SPECIFIED = 133] = "NO_PROFILE_SPECIFIED";

        /** The underlying camera device driver is out of date. */
        values[values.DEVICE_DRIVER_OUT_OF_DATE = 150] = "DEVICE_DRIVER_OUT_OF_DATE";

        /** Cannot refresh the camera list while there are any cameras open. */
        values[values.REFRESH_FAILED_CAMERA_OPEN = 151] = "REFRESH_FAILED_CAMERA_OPEN";

        /**  */
        values[values.PROPERTY_NOT_APPLICABLE_TO_DEVICE = 410] = "PROPERTY_NOT_APPLICABLE_TO_DEVICE";

        /**  */
        values[values.PREFACE_VERSION_MISMATCH = 998] = "PREFACE_VERSION_MISMATCH";

        /** The barcode library was not found and is unavailable. */
        values[values.BARCODE_LIBRARY_NOT_AVAILABLE = 1001] = "BARCODE_LIBRARY_NOT_AVAILABLE";

        /** The image format is not supported. */
        values[values.IMAGE_FORMAT_NOT_SUPPORTED = 2104] = "IMAGE_FORMAT_NOT_SUPPORTED";

        /** Failed to parse the JSON request. */
        values[values.FAILED_TO_PARSE_JSON = 10001] = "FAILED_TO_PARSE_JSON";

        /** The function name was not valid. */
        values[values.INVALID_FUNCTION_NAME = 10002] = "INVALID_FUNCTION_NAME";

        /** The parameter list must be a JSON array. */
        values[values.INVALID_PARAMETER_LIST = 10003] = "INVALID_PARAMETER_LIST";

        /** A parameter had an incorrect type. */
        values[values.INVALID_PARAMETER_TYPE = 10004] = "INVALID_PARAMETER_TYPE";

        /** The wrong number of parameters were passed to the function. */
        values[values.INCORRECT_PARAMETER_COUNT = 10005] = "INCORRECT_PARAMETER_COUNT";

        /** The channel name is incorrect, hasn't been opened, or is closed. */
        values[values.INVALID_CHANNEL_NAME = 10006] = "INVALID_CHANNEL_NAME";

        /** There was an error with the websocket. */
        values[values.WEBSOCKET_ERROR = 10007] = "WEBSOCKET_ERROR";

        return values;
    })(),


};

/** Creates an object that implements the PhotoCapture API.
  *
  * @param websocketHandle - Handle to an open websocket connection, connected
  *      to the aw_bio_component_server. The caller is responsible for handling
  *      the "onerror" callback, whereas this class will handle the "onmessage"
  *      callback.
  *
  * @return Object that implements the PhotoCapture API.
  */
var createPhotoCapture = (function( transportObject, channelName )
{
    var callbacks = {};
    var onReturnDictionary = {};
    var currentMessageId = 0;
    var transport = transportObject;
    var channel = channelName;

    var onMessage = function( result )
    {
        var functionName = result.function;
        var isCallback = false;
        if ( !isCallback &&  functionName == "aw_photo_capture_camera_status_updated" )
        {
            if ( typeof callbacks.cameraStatusUpdated != "undefined" )
            {
                callbacks.cameraStatusUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_photo_capture_preview_image_updated" )
        {
            if ( typeof callbacks.previewImageUpdated != "undefined" )
            {
                callbacks.previewImageUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_photo_capture_captured_image_updated" )
        {
            if ( typeof callbacks.capturedImageUpdated != "undefined" )
            {
                callbacks.capturedImageUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_photo_capture_autocapture_feedback_updated" )
        {
            if ( typeof callbacks.autocaptureFeedbackUpdated != "undefined" )
            {
                callbacks.autocaptureFeedbackUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_photo_capture_barcode_updated" )
        {
            if ( typeof callbacks.barcodeUpdated != "undefined" )
            {
                callbacks.barcodeUpdated.apply( null, result.args );
            }
            isCallback = true;
        }

        if ( !isCallback )
        {
            var messageId = result.message_id;
            if( !messageId ) return;
            var onReturn = onReturnDictionary[messageId.toString()];
            delete onReturnDictionary[messageId.toString()];
            if ( typeof onReturn == "function" )
            {
                onReturn(
                    result.return_value,
                    result.error.code,
                    result.error.message );
            }
        }
    };

    // Register the channel name with transport so we will receive messages from the server
    transport.register(channel, onMessage);

    var internalStoreOnReturn = function( onReturn )
    {
        if ( currentMessageId >= Number.MAX_SAFE_INTEGER )
        {
            currentMessageId = 0;
        }
        else
        {
            currentMessageId += 1;
        }
        onReturnDictionary[currentMessageId.toString()] = onReturn;
    };


    /** This function destroys the PhotoCapture object.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var destroy = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_destroy";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Refreshes the camera list.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var refreshCameraList = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_refresh_camera_list";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Gets a list of camera names for connected cameras.
     *  
     *  @returns {Promise<Object,Error>} A list of camera names.
     *   */
    var getCameraList = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_get_camera_list";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Gets a list of camera names for connected cameras.
     *  @param {Object} cameraTypeArray Types of camera.
     *  
     *  @returns {Promise<Object,Error>} A list of camera names.
     *   */
    var getCameraListByTypes = function( cameraTypeArray )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_get_camera_list_by_types";
            jsonNode.args = [ cameraTypeArray ];
            transport.send( jsonNode );
        } );
    };

    /** Opens the camera of the specified name.
     *  @param {String} cameraName Name of camera.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var openCameraName = function( cameraName )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_open_camera_name";
            jsonNode.args = [ cameraName ];
            transport.send( jsonNode );
        } );
    };

    /** Opens the camera of the specified type.
     *  @param {Number} cameraType Type of camera.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var openCameraType = function( cameraType )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_open_camera_type";
            jsonNode.args = [ cameraType ];
            transport.send( jsonNode );
        } );
    };

    /** Closes the open camera.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var closeCamera = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_close_camera";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Configure Autocapture mode.
     *  @param {Number} autocaptureMode Autocapture mode.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setAutocaptureMode = function( autocaptureMode )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_set_autocapture_mode";
            jsonNode.args = [ autocaptureMode ];
            transport.send( jsonNode );
        } );
    };

    /** Set the barcode pattern to use when analyzing images.
     *  @param {String} pattern Barcode pattern.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setBarcodePattern = function( pattern )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_set_barcode_pattern";
            jsonNode.args = [ pattern ];
            transport.send( jsonNode );
        } );
    };

    /** Set the barcode min / max character length to use when analyzing
     *  images.
     *  @param {Number} minlength Barcode min character length.
     *  @param {Number} maxlength Barcode max character length.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setBarcodeLengths = function( minlength, maxlength )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_set_barcode_lengths";
            jsonNode.args = [ minlength, maxlength ];
            transport.send( jsonNode );
        } );
    };

    /** Set the barcode hints to use when analyzing images.
     *  @param {Object} barcodeHintArray Barcode hints.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setBarcodeHints = function( barcodeHintArray )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_set_barcode_hints";
            jsonNode.args = [ barcodeHintArray ];
            transport.send( jsonNode );
        } );
    };

    /** Set the profile to use for controlling autocapture.
     *  @param {String} profile Buffer containing the profile file.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setAutocaptureProfile = function( profile )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_set_autocapture_profile";
            jsonNode.args = [ profile ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the display name for the currently opened camera.
     *  
     *  @returns {Promise<String,Error>} Name of the camera.
     *   */
    var getCameraName = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_get_camera_name";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the current index of the given camera property.
     *  @param {Number} prop Camera property to query.
     *  
     *  @returns {Promise<Number,Error>} Index the given camera property is
     *  at currently.
     *   */
    var getCameraPropertyIndex = function( prop )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_get_camera_property_index";
            jsonNode.args = [ prop ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the index of the given camera property.
     *                  *Notes*
     *                  When changing capture resolution index, the list of
     *  preview resolutions will change.
     *                  When changing capture resolution to be a different
     *  aspect ratio or smaller than the current preview resolution, the
     *  preview resolution index will change to the closest value to the new
     *  capture resolution.
     *  @param {Number} prop Camera property to set.
     *  @param {Number} index Index the given camera property is to be set
     *  to. For autofocus, index is used as 0 for off, anything else for on.
     *                                                                      
     *      For Canon EOS camera, this command is supported by the EOS 50D
     *  or EOS 5D Mark II or later cameras, and only for preview.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setCameraPropertyIndex = function( prop, index )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_set_camera_property_index";
            jsonNode.args = [ prop, index ];
            transport.send( jsonNode );
        } );
    };

    /** Get the list of values for the specified camera property.
     *  @param {Number} prop Camera property to query.
     *  
     *  @returns {Promise<Object,Error>} Values for the specified property.
     *   */
    var getCameraPropertyValues = function( prop )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_get_camera_property_values";
            jsonNode.args = [ prop ];
            transport.send( jsonNode );
        } );
    };

    /** Start camera preview.
     *  @param {Number} imageFormat Desired image format for the preview.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var startPreview = function( imageFormat )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_start_preview";
            jsonNode.args = [ imageFormat ];
            transport.send( jsonNode );
        } );
    };

    /** End camera preview.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var endPreview = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_end_preview";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Tells the camera to initiate a final image capture, regardless of
     *  current auto capture status.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var captureImage = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_capture_image";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieves the captured image in the specified image format.
     *  @param {Number} imageFormat Image format.
     *  
     *  @returns {Promise<String,Error>} Captured image.
     *   */
    var getCapturedImage = function( imageFormat )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_get_captured_image";
            jsonNode.args = [ imageFormat ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the camera_status_updated.
     *  @param {String} cameraStatusUpdated Callback used to send camera
     *  status up to the user.
     *   */
    var setCameraStatusUpdated = function( cameraStatusUpdated )
    {
        callbacks.cameraStatusUpdated = cameraStatusUpdated;
    };

    /** Sets the preview_image_updated.
     *  @param {String} previewImageUpdated Callback with the updated
     *  preview image.
     *   */
    var setPreviewImageUpdated = function( previewImageUpdated )
    {
        callbacks.previewImageUpdated = previewImageUpdated;
    };

    /** Sets the captured_image_updated.
     *  @param {String} capturedImageUpdated Callback with the captured
     *  image. The image format is the same as the preview image.
     *   */
    var setCapturedImageUpdated = function( capturedImageUpdated )
    {
        callbacks.capturedImageUpdated = capturedImageUpdated;
    };

    /** Requests that the next preview image be sent through the callback,
     *  when it is available.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var requestNextPreviewImage = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_request_next_preview_image";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the autocapture_feedback_updated.
     *  @param {String} autocaptureFeedbackUpdated Get a list of codes
     *  detailing the results of the autocapture algorithm's analysis.
     *   */
    var setAutocaptureFeedbackUpdated = function( autocaptureFeedbackUpdated )
    {
        callbacks.autocaptureFeedbackUpdated = autocaptureFeedbackUpdated;
    };

    /** Sets the barcode_updated.
     *  @param {String} barcodeUpdated The function to call when a barcode
     *  is found.
     *   */
    var setBarcodeUpdated = function( barcodeUpdated )
    {
        callbacks.barcodeUpdated = barcodeUpdated;
    };

    /** Requests that the next barcode be sent through the callback, when it
     *  is available.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var requestNextBarcode = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_request_next_barcode";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Returns integer value indicating the current version of the
     *  component.
     *  
     *  @returns {Promise<Number,Error>} An integer indicating the library
     *  version number.
     *   */
    var getVersion = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_get_version";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Returns a text string indicating the current version of the
     *  component.
     *  
     *  @returns {Promise<String,Error>} A string indicating the library
     *  version number.
     *   */
    var getVersionString = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoCaptureApi.ErrorCode )
                    {
                        if ( PhotoCaptureApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_capture_get_version_string";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };




    var instance = {};
    instance.onMessage = onMessage;
    instance.channel = channel;
    instance.destroy = destroy;
    instance.refreshCameraList = refreshCameraList;
    instance.getCameraList = getCameraList;
    instance.getCameraListByTypes = getCameraListByTypes;
    instance.openCameraName = openCameraName;
    instance.openCameraType = openCameraType;
    instance.closeCamera = closeCamera;
    instance.setAutocaptureMode = setAutocaptureMode;
    instance.setBarcodePattern = setBarcodePattern;
    instance.setBarcodeLengths = setBarcodeLengths;
    instance.setBarcodeHints = setBarcodeHints;
    instance.setAutocaptureProfile = setAutocaptureProfile;
    instance.getCameraName = getCameraName;
    instance.getCameraPropertyIndex = getCameraPropertyIndex;
    instance.setCameraPropertyIndex = setCameraPropertyIndex;
    instance.getCameraPropertyValues = getCameraPropertyValues;
    instance.startPreview = startPreview;
    instance.endPreview = endPreview;
    instance.captureImage = captureImage;
    instance.getCapturedImage = getCapturedImage;
    instance.setCameraStatusUpdated = setCameraStatusUpdated;
    instance.setPreviewImageUpdated = setPreviewImageUpdated;
    instance.setCapturedImageUpdated = setCapturedImageUpdated;
    instance.requestNextPreviewImage = requestNextPreviewImage;
    instance.setAutocaptureFeedbackUpdated = setAutocaptureFeedbackUpdated;
    instance.setBarcodeUpdated = setBarcodeUpdated;
    instance.requestNextBarcode = requestNextBarcode;
    instance.getVersion = getVersion;
    instance.getVersionString = getVersionString;

    return new Promise( function( resolve, reject )
    {
        internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
        {
            if ( errorCode == PhotoCaptureApi.ErrorCode.NO_ERRORS )
            {
                resolve( instance );
            }
            else
            {
                reject( errorMessage );
            }
        } );
        var jsonNode = {};
        jsonNode.message_id = currentMessageId.toString();
        jsonNode.function = "aw_photo_capture_create";
        jsonNode.channel = channel;
        transport.send( jsonNode );
    } );
});

