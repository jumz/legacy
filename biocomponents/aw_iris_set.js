/* Copyright (C) 2019 Aware, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
 
/** @namespace
  */
var IrisSetApi =
{
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

        /** JPEG format */
        values[values.JPG = 5] = "JPG";

        /** JPEG 2000 Lossless format */
        values[values.JP2L = 6] = "JP2L";

        /** PNG format */
        values[values.PNG = 7] = "PNG";

        /** TIFF format */
        values[values.TIF = 8] = "TIF";

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

        /** The iris_set object was NULL. */
        values[values.NULL_IRIS_SET_OBJ = 101] = "NULL_IRIS_SET_OBJ";

        /** No input iris image is loaded. */
        values[values.NO_INPUT_IMAGE = 102] = "NO_INPUT_IMAGE";

        /** The specified image buffer was not a valid image. */
        values[values.INVALID_IMAGE = 103] = "INVALID_IMAGE";

        /** The given image does not meet the minimum image size
         *  requirements. */
        values[values.IMAGE_TOO_SMALL = 103] = "IMAGE_TOO_SMALL";

        /** Only 8 bit grayscale and 24 bit RGB/BGR images are supported. */
        values[values.INVALID_BIT_DEPTH = 104] = "INVALID_BIT_DEPTH";

        /** This function does not support the provided color format. */
        values[values.INVALID_COLOR_FORMAT = 105] = "INVALID_COLOR_FORMAT";

        /** This function does not support the provided image format. */
        values[values.INVALID_IMAGE_FORMAT = 106] = "INVALID_IMAGE_FORMAT";

        /** A parameter value is invalid. */
        values[values.INVALID_PARAMETER = 107] = "INVALID_PARAMETER";

        /** No iris was found in the image. */
        values[values.NO_IRIS_FOUND = 108] = "NO_IRIS_FOUND";

        /** The iris capture object did not contain a captured image. */
        values[values.IRIS_CAPTURE_HAS_NO_CAPTURED_IMAGE = 109] = "IRIS_CAPTURE_HAS_NO_CAPTURED_IMAGE";

        /** Failed to retrieve the captured image from the iris capture
         *  object. */
        values[values.FAILED_TO_RETRIEVE_CAPTURED_IMAGE = 110] = "FAILED_TO_RETRIEVE_CAPTURED_IMAGE";

        /** The Iris Capture library was not found and is unavailable. */
        values[values.IRIS_CAPTURE_NOT_AVAILABLE = 111] = "IRIS_CAPTURE_NOT_AVAILABLE";

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

/** Creates an object that implements the IrisSet API.
  *
  * @param websocketHandle - Handle to an open websocket connection, connected
  *      to the aw_bio_component_server. The caller is responsible for handling
  *      the "onerror" callback, whereas this class will handle the "onmessage"
  *      callback.
  *
  * @return Object that implements the IrisSet API.
  */
var createIrisSet = (function( transportObject, channelName )
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


    /** This function destroys the IrisSet object.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var destroy = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_destroy";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Specify the iris image to use.
     *  @param {Number} imageContent Image content.
     *  @param {String} image Input image.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setImage = function( imageContent, image )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_set_image";
            jsonNode.args = [ imageContent, image ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the input iris image using a IrisCapture object that contains a
     *  captured image.
     *  @param {Number} imageContent Image content.
     *  @param {String} irisCapture IrisCapture object containing a captured
     *  impression image.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setIrisCaptureImage = function( imageContent, irisCapture )
    {
        irisCapture = irisCapture.channel;
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_set_iris_capture_image";
            jsonNode.args = [ imageContent, irisCapture ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieves the image.
     *  @param {Number} imageContent Image content.
     *  @param {Number} format Desired image format.
     *  
     *  @returns {Promise<String,Error>} Output image.
     *   */
    var getImage = function( imageContent, format )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_get_image";
            jsonNode.args = [ imageContent, format ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieves the quality metrics for an image.
     *  @param {Number} imageContent Image content.
     *  
     *  @returns {Promise<Object,Error>} Quality metrics for the image.
     *   */
    var getQualityMetrics = function( imageContent )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_get_quality_metrics";
            jsonNode.args = [ imageContent ];
            transport.send( jsonNode );
        } );
    };

    /** Sets meta data for an image. Image must already be set. Meta data is
     *  cleared when a new image is entered.
     *  @param {Number} imageContent Image content.
     *  @param {String} metadata Metadata for the image.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setMetadata = function( imageContent, metadata )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_set_metadata";
            jsonNode.args = [ imageContent, metadata ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieves the previously set meta data.
     *  @param {Number} imageContent Image content.
     *  
     *  @returns {Promise<String,Error>} Metadata for the impression.
     *   */
    var getMetadata = function( imageContent )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_get_metadata";
            jsonNode.args = [ imageContent ];
            transport.send( jsonNode );
        } );
    };

    /** Clears all images and meta data.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var reset = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_reset";
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
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_get_version";
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
                if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in IrisSetApi.ErrorCode )
                    {
                        if ( IrisSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_iris_set_get_version_string";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };




    var instance = {};
    instance.onMessage = onMessage;
    instance.channel = channel;
    instance.destroy = destroy;
    instance.setImage = setImage;
    instance.setIrisCaptureImage = setIrisCaptureImage;
    instance.getImage = getImage;
    instance.getQualityMetrics = getQualityMetrics;
    instance.setMetadata = setMetadata;
    instance.getMetadata = getMetadata;
    instance.reset = reset;
    instance.getVersion = getVersion;
    instance.getVersionString = getVersionString;

    return new Promise( function( resolve, reject )
    {
        internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
        {
            if ( errorCode == IrisSetApi.ErrorCode.NO_ERRORS )
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
        jsonNode.function = "aw_iris_set_create";
        jsonNode.channel = channel;
        transport.send( jsonNode );
    } );
});

