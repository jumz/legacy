/* Copyright (C) 2019 Aware, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
 
/** @namespace
  */
var IrisCaptureApi =
{
    /** Camera model
     *  @enum {number} */
    CameraModel : 
    (function()
    {
        var values = {};
        /** Iris ID TD100 */
        values[values.IRIS_ID_TD100 = 0] = "IRIS_ID_TD100";

        /** Iris ID iCAM T10 */
        values[values.IRIS_ID_T10 = 1] = "IRIS_ID_T10";

        /** CrossMatch IScan2 */
        values[values.CROSSMATCH_ISCAN2 = 2] = "CROSSMATCH_ISCAN2";

        /** CMITech EMX-30 */
        values[values.CMITECH_EMX30 = 3] = "CMITECH_EMX30";

        /** VistaFA2-01 BioCAM */
        values[values.VISTAFA2_01 = 4] = "VISTAFA2_01";

        /** Vista EY2P */
        values[values.VISTA_EY2P = 5] = "VISTA_EY2P";

        /** IriTech IriShield BK2121U */
        values[values.IRITECH_BK2121U = 6] = "IRITECH_BK2121U";

        return values;
    })(),

    /** Image Formats
     *  @enum {number} */
    ImageFormat : 
    (function()
    {
        var values = {};
        /** RAW format */
        values[values.RAW = 1] = "RAW";

        /** BMP format */
        values[values.BMP = 2] = "BMP";

        /** JPEG 2000 Lossy format */
        values[values.JP2 = 4] = "JP2";

        /** JPEG 2000 Lossless format */
        values[values.JP2L = 6] = "JP2L";

        /** PNG format */
        values[values.PNG = 7] = "PNG";

        /** TIFF format */
        values[values.TIF = 8] = "TIF";

        return values;
    })(),

    /** Image Color Format
     *  @enum {number} */
    ColorFormat : 
    (function()
    {
        var values = {};
        /** 8 bit grayscale. */
        values[values.GRAY8 = 0] = "GRAY8";

        /** 24 bit color in RGB order. */
        values[values.RGB24 = 1] = "RGB24";

        return values;
    })(),

    /** Camera Property
     *  @enum {number} */
    CameraProperty : 
    (function()
    {
        var values = {};
        /** Query the camera's native image format for preview data. */
        values[values.CAMERA_NATIVE_PREVIEW_FORMAT = 4] = "CAMERA_NATIVE_PREVIEW_FORMAT";

        /** Query the camera's native color format (bit depth) for preview
         *  data. */
        values[values.CAMERA_NATIVE_PREVIEW_COLOR_FORMAT = 5] = "CAMERA_NATIVE_PREVIEW_COLOR_FORMAT";

        /** Query the camera's native image format for captured image data. */
        values[values.CAMERA_NATIVE_CAPTURE_FORMAT = 6] = "CAMERA_NATIVE_CAPTURE_FORMAT";

        /** Query the camera's native color format (bit depth) for captured
         *  image data. */
        values[values.CAMERA_NATIVE_CAPTURE_COLOR_FORMAT = 7] = "CAMERA_NATIVE_CAPTURE_COLOR_FORMAT";

        /** Query whether camera has a dual eye or single eye design. */
        values[values.CAMERA_DESIGN = 8] = "CAMERA_DESIGN";

        /** Set or query the width of the preview image. */
        values[values.PREVIEW_IMAGE_WIDTH = 9] = "PREVIEW_IMAGE_WIDTH";

        /** Set or query the height of the preview image. */
        values[values.PREVIEW_IMAGE_HEIGHT = 10] = "PREVIEW_IMAGE_HEIGHT";

        /** Set or query the width of the capture image. */
        values[values.CAPTURE_IMAGE_WIDTH = 11] = "CAPTURE_IMAGE_WIDTH";

        /** Set or query the height of the capture image. */
        values[values.CAPTURE_IMAGE_HEIGHT = 12] = "CAPTURE_IMAGE_HEIGHT";

        /** Set or query the camera autocapture modes. */
        values[values.CAMERA_AUTOCAPTURE_MODE = 13] = "CAMERA_AUTOCAPTURE_MODE";

        /** Set or query the camera timeout, from 0 to 30000 milliseconds
         *  (affects only certain cameras when shared across multiple SDKs). */
        values[values.SHARED_CONNECTION_TIMEOUT = 14] = "SHARED_CONNECTION_TIMEOUT";

        /** Set of query if the camera will reset to the default position
         *  after a capture. */
        values[values.CAMERA_RESET_POSITION = 15] = "CAMERA_RESET_POSITION";

        return values;
    })(),

    /** Camera Design
     *  @enum {number} */
    CameraDesign : 
    (function()
    {
        var values = {};
        /** Camera can only acquire one eye at a time */
        values[values.SINGLE_EYE = 0] = "SINGLE_EYE";

        /** Camera can acquire both eyes simultaneously */
        values[values.DUAL_EYE = 1] = "DUAL_EYE";

        return values;
    })(),

    /** Image content.
     *  @enum {number} */
    ImageContent : 
    (function()
    {
        var values = {};
        /** Left eye. */
        values[values.LEFT = 0] = "LEFT";

        /** Right eye. */
        values[values.RIGHT = 1] = "RIGHT";

        /** Face with eyes. */
        values[values.FACE = 2] = "FACE";

        /** Left and Right eye in single image. */
        values[values.BOTH_EYES = 3] = "BOTH_EYES";

        return values;
    })(),

    /** Camera Status.
     *  @enum {number} */
    CameraStatus : 
    (function()
    {
        var values = {};
        /** No status available or initial state. */
        values[values.READY = 0x000] = "READY";

        /** Image capture complete. */
        values[values.CAPTURE_COMPLETE = 0x001] = "CAPTURE_COMPLETE";

        /** Image capture failed. */
        values[values.CAPTURE_FAILED = 0x002] = "CAPTURE_FAILED";

        /** Camera too near. */
        values[values.RANGE_NEAR = 0x004] = "RANGE_NEAR";

        /** Camera operating. */
        values[values.RANGE_OPERATING = 0x008] = "RANGE_OPERATING";

        /** Camera too far. */
        values[values.RANGE_FAR = 0x010] = "RANGE_FAR";

        /** Camera out of range. */
        values[values.RANGE_OUT = 0x020] = "RANGE_OUT";

        /** Image capture timed out. */
        values[values.CAPTURE_TIMED_OUT = 0x040] = "CAPTURE_TIMED_OUT";

        /** Camera tilt is normal. */
        values[values.TILT_NORMAL = 0x080] = "TILT_NORMAL";

        /** Camera is upside-down. */
        values[values.TILT_UPSIDE_DOWN = 0x100] = "TILT_UPSIDE_DOWN";

        /** Camera is disconnected. */
        values[values.CAMERA_REMOVED = 0x200] = "CAMERA_REMOVED";

        /** Camera range indicator off. */
        values[values.RANGE_OFF = 0x400] = "RANGE_OFF";

        /** Eye is not aligned; look forward. */
        values[values.NOT_ALIGNED = 0x800] = "NOT_ALIGNED";

        /** Eye is occluded/covered. */
        values[values.OCCLUDED = 0x1000] = "OCCLUDED";

        /** Too dark. */
        values[values.TOO_DARK = 0x2000] = "TOO_DARK";

        /** Too much light. */
        values[values.TOO_LIGHT = 0x4000] = "TOO_LIGHT";

        /** Capturing. */
        values[values.CAPTURING = 0x8000] = "CAPTURING";

        /** Capture aborted. */
        values[values.CAPTURE_ABORTED = 0x10000] = "CAPTURE_ABORTED";

        return values;
    })(),

    /** Autocapture Modes.
     *  @enum {number} */
    AutocaptureMode : 
    (function()
    {
        var values = {};
        /** Hardware autocapture only. */
        values[values.AUTO = 0] = "AUTO";

        /** Manual capture only. */
        values[values.MANUAL = 1] = "MANUAL";

        /** Manual capture in addition to autocapture. */
        values[values.MANUAL_WITH_AUTO = 2] = "MANUAL_WITH_AUTO";

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

        /** The iris_capture object was NULL. */
        values[values.NULL_IRIS_CAPTURE_OBJ = 101] = "NULL_IRIS_CAPTURE_OBJ";

        /** Invalid parameter value for the function. */
        values[values.INVALID_PARAMETER_VALUE = 101] = "INVALID_PARAMETER_VALUE";

        /** A camera has not been opened. */
        values[values.CAMERA_NOT_OPENED = 102] = "CAMERA_NOT_OPENED";

        /** Failed to open a session with the camera. */
        values[values.FAILED_TO_OPEN_CAMERA = 104] = "FAILED_TO_OPEN_CAMERA";

        /** An invalid camera property was given. */
        values[values.INVALID_CAMERA_PROPERTY = 105] = "INVALID_CAMERA_PROPERTY";

        /** An invalid index was given for a camera property. */
        values[values.INVALID_CAMERA_PROPERTY_INDEX = 106] = "INVALID_CAMERA_PROPERTY_INDEX";

        /** This camera property is read-only. */
        values[values.READ_ONLY_PROPERTY = 107] = "READ_ONLY_PROPERTY";

        /** This camera does not support this functionality. */
        values[values.CAMERA_CAPABILITY_NOT_SUPPORTED = 108] = "CAMERA_CAPABILITY_NOT_SUPPORTED";

        /** Cannot convert the image to the target format. */
        values[values.CANNOT_CONVERT_TO_FORMAT = 109] = "CANNOT_CONVERT_TO_FORMAT";

        /** Invalid image format. */
        values[values.INVALID_IMAGE_FORMAT = 110] = "INVALID_IMAGE_FORMAT";

        /** The chosen Autocapture parameters are not valid for this camera. */
        values[values.INVALID_AUTOCAPTURE_PARAMETERS = 112] = "INVALID_AUTOCAPTURE_PARAMETERS";

        /** The camera is not detected. */
        values[values.CAMERA_NOT_DETECTED = 113] = "CAMERA_NOT_DETECTED";

        /** The required camera DLL is not present or available. */
        values[values.CAMERA_DLL_NOT_PRESENT = 114] = "CAMERA_DLL_NOT_PRESENT";

        /** There is no indicated camera present. */
        values[values.CAMERA_NOT_PRESENT = 115] = "CAMERA_NOT_PRESENT";

        /** The camera is busy and cannot complete the operation. */
        values[values.CAMERA_BUSY = 116] = "CAMERA_BUSY";

        /** The camera encountered an error trying to capture an image. */
        values[values.ERROR_CAPTURING_IMAGE = 117] = "ERROR_CAPTURING_IMAGE";

        /** Manual capture is only allowed when camera is in a manual
         *  autocapture mode. */
        values[values.MANUAL_CAPTURE_WRONG_MODE = 118] = "MANUAL_CAPTURE_WRONG_MODE";

        /** There is no captured image available. */
        values[values.NO_CAPTURED_IMAGE = 119] = "NO_CAPTURED_IMAGE";

        /** No valid cameras were found connected to the computer. */
        values[values.NO_CAMERA_CONNECTED = 130] = "NO_CAMERA_CONNECTED";

        /** No camera of the specified type was found connected to the
         *  computer. */
        values[values.NO_CAMERA_TYPE_CONNECTED = 131] = "NO_CAMERA_TYPE_CONNECTED";

        /** No camera of the specified name was found connected to the
         *  computer. */
        values[values.NO_CAMERA_NAME_CONNECTED = 132] = "NO_CAMERA_NAME_CONNECTED";

        /** The underlying camera device driver is out of date. */
        values[values.DEVICE_DRIVER_OUT_OF_DATE = 150] = "DEVICE_DRIVER_OUT_OF_DATE";

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

/** Creates an object that implements the IrisCapture API.
  *
  * @param websocketHandle - Handle to an open websocket connection, connected
  *      to the aw_bio_component_server. The caller is responsible for handling
  *      the "onerror" callback, whereas this class will handle the "onmessage"
  *      callback.
  *
  * @return Object that implements the IrisCapture API.
  */
var createIrisCapture = (function( transportObject, channelName )
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
        if ( !isCallback &&  functionName == "aw_iris_capture_camera_status_updated" )
        {
            if ( typeof callbacks.cameraStatusUpdated != "undefined" )
            {
                callbacks.cameraStatusUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_iris_capture_preview_image_updated" )
        {
            if ( typeof callbacks.previewImageUpdated != "undefined" )
            {
                callbacks.previewImageUpdated.apply( null, result.args );
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


    /** This function destroys the IrisCapture object.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var destroy = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_destroy";
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_get_camera_list";
            jsonNode.args = [ ];
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_open_camera_name";
            jsonNode.args = [ cameraName ];
            transport.send( jsonNode );
        } );
    };

    /** Opens the camera of the specified model.
     *  @param {Number} cameraModel Model of camera.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var openCameraModel = function( cameraModel )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_open_camera_model";
            jsonNode.args = [ cameraModel ];
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_close_camera";
            jsonNode.args = [ ];
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_get_camera_name";
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_get_camera_property_index";
            jsonNode.args = [ prop ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the index of the given camera property.
     *  @param {Number} prop Camera property to set.
     *  @param {Number} index Index the given camera property is to be set
     *  to.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setCameraPropertyIndex = function( prop, index )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_set_camera_property_index";
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_get_camera_property_values";
            jsonNode.args = [ prop ];
            transport.send( jsonNode );
        } );
    };

    /** Begins camera image live autocapture preview with specified eye
     *  preferences.  For example, enabling only one of the eyes attempts to
     *  start a single-eye capture session.
     *  @param {Number} imageFormat Desired image format for the preview.
     *  @param {Number} colorFormat Color format (bit depth) of preview
     *  data.
     *  @param {Boolean} enableLeftEye Flag indicating capture of left eye.
     *  @param {Boolean} enableRightEye Flag indicating capture of right
     *  eye.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var startAutocapture = function( imageFormat, colorFormat, enableLeftEye, enableRightEye )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_start_autocapture";
            jsonNode.args = [ imageFormat, colorFormat, enableLeftEye, enableRightEye ];
            transport.send( jsonNode );
        } );
    };

    /** Ends camera image live autocapture preview.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var endAutocapture = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_end_autocapture";
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_capture_image";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Obtains captured image data.
     *  @param {Number} imageFormat Image format of captured output image.
     *  @param {Number} colorFormat Color format (bit depth) of captured
     *  output image.
     *  @param {Number} imageContent Image content.
     *  
     *  @returns {Promise<String,Error>} Captured image.
     *   */
    var getCapturedImage = function( imageFormat, colorFormat, imageContent )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_get_captured_image";
            jsonNode.args = [ imageFormat, colorFormat, imageContent ];
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_request_next_preview_image";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Obtains camera status.
     *  
     *  @returns {Promise<Number,Error>} Camera status code.
     *   */
    var getCameraStatus = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_get_camera_status";
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_get_version";
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
                if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisCaptureApi.ErrorCode )
                    {
                        if ( IrisCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_capture_get_version_string";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };




    var instance = {};
    instance.onMessage = onMessage;
    instance.channel = channel;
    instance.destroy = destroy;
    instance.getCameraList = getCameraList;
    instance.openCameraName = openCameraName;
    instance.openCameraModel = openCameraModel;
    instance.closeCamera = closeCamera;
    instance.getCameraName = getCameraName;
    instance.getCameraPropertyIndex = getCameraPropertyIndex;
    instance.setCameraPropertyIndex = setCameraPropertyIndex;
    instance.getCameraPropertyValues = getCameraPropertyValues;
    instance.startAutocapture = startAutocapture;
    instance.endAutocapture = endAutocapture;
    instance.captureImage = captureImage;
    instance.getCapturedImage = getCapturedImage;
    instance.setCameraStatusUpdated = setCameraStatusUpdated;
    instance.setPreviewImageUpdated = setPreviewImageUpdated;
    instance.requestNextPreviewImage = requestNextPreviewImage;
    instance.getCameraStatus = getCameraStatus;
    instance.getVersion = getVersion;
    instance.getVersionString = getVersionString;

    return new Promise( function( resolve, reject )
    {
        internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
        {
            if ( errorCode == IrisCaptureApi.ErrorCode.NO_ERRORS )
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
        jsonNode.function = "aw_iris_capture_create";
        jsonNode.channel = channel;
        transport.send( jsonNode );
    } );
});

