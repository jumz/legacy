/* Copyright (C) 2019 Aware, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
 
/** @namespace
  */
var FingerprintSetApi =
{
    /** Finger.
     *  @enum {number} */
    Finger : 
    (function()
    {
        var values = {};
        /** Right thumb. */
        values[values.RIGHT_THUMB = 1] = "RIGHT_THUMB";

        /** Right index finger. */
        values[values.RIGHT_INDEX_FINGER = 2] = "RIGHT_INDEX_FINGER";

        /** Right middle finger. */
        values[values.RIGHT_MIDDLE_FINGER = 3] = "RIGHT_MIDDLE_FINGER";

        /** Right ring finger. */
        values[values.RIGHT_RING_FINGER = 4] = "RIGHT_RING_FINGER";

        /** Right little finger. */
        values[values.RIGHT_LITTLE_FINGER = 5] = "RIGHT_LITTLE_FINGER";

        /** Left thumb. */
        values[values.LEFT_THUMB = 6] = "LEFT_THUMB";

        /** Left index finger. */
        values[values.LEFT_INDEX_FINGER = 7] = "LEFT_INDEX_FINGER";

        /** Left middle finger. */
        values[values.LEFT_MIDDLE_FINGER = 8] = "LEFT_MIDDLE_FINGER";

        /** Left ring finger. */
        values[values.LEFT_RING_FINGER = 9] = "LEFT_RING_FINGER";

        /** Left little finger. */
        values[values.LEFT_LITTLE_FINGER = 10] = "LEFT_LITTLE_FINGER";

        /** Right aux finger. */
        values[values.RIGHT_AUX_FINGER = 112] = "RIGHT_AUX_FINGER";

        /** Left aux finger. */
        values[values.LEFT_AUX_FINGER = 113] = "LEFT_AUX_FINGER";

        return values;
    })(),

    /** Impression.
     *  @enum {number} */
    Impression : 
    (function()
    {
        var values = {};
        /** Rolled right thumb. */
        values[values.ROLLED_RIGHT_THUMB = 1] = "ROLLED_RIGHT_THUMB";

        /** Rolled right index finger. */
        values[values.ROLLED_RIGHT_INDEX_FINGER = 2] = "ROLLED_RIGHT_INDEX_FINGER";

        /** Rolled right middle finger. */
        values[values.ROLLED_RIGHT_MIDDLE_FINGER = 3] = "ROLLED_RIGHT_MIDDLE_FINGER";

        /** Rolled right ring finger. */
        values[values.ROLLED_RIGHT_RING_FINGER = 4] = "ROLLED_RIGHT_RING_FINGER";

        /** Rolled right little finger. */
        values[values.ROLLED_RIGHT_LITTLE_FINGER = 5] = "ROLLED_RIGHT_LITTLE_FINGER";

        /** Rolled left thumb. */
        values[values.ROLLED_LEFT_THUMB = 6] = "ROLLED_LEFT_THUMB";

        /** Rolled left index finger. */
        values[values.ROLLED_LEFT_INDEX_FINGER = 7] = "ROLLED_LEFT_INDEX_FINGER";

        /** Rolled left middle finger. */
        values[values.ROLLED_LEFT_MIDDLE_FINGER = 8] = "ROLLED_LEFT_MIDDLE_FINGER";

        /** Rolled left ring finger. */
        values[values.ROLLED_LEFT_RING_FINGER = 9] = "ROLLED_LEFT_RING_FINGER";

        /** Rolled left little finger. */
        values[values.ROLLED_LEFT_LITTLE_FINGER = 10] = "ROLLED_LEFT_LITTLE_FINGER";

        /** Plain right thumb. */
        values[values.PLAIN_RIGHT_THUMB = 11] = "PLAIN_RIGHT_THUMB";

        /** Plain left thumb. */
        values[values.PLAIN_LEFT_THUMB = 12] = "PLAIN_LEFT_THUMB";

        /** Four fingered slap of the right hand. */
        values[values.PLAIN_RIGHT_FOUR_FINGERS = 13] = "PLAIN_RIGHT_FOUR_FINGERS";

        /** Four fingered slap of the left hand. */
        values[values.PLAIN_LEFT_FOUR_FINGERS = 14] = "PLAIN_LEFT_FOUR_FINGERS";

        /** Plain right index finger found within a plain right four finger
         *  slap */
        values[values.RIGHT_SLAP_INDEX_FINGER = 15] = "RIGHT_SLAP_INDEX_FINGER";

        /** Plain right middle finger found within a plain right four finger
         *  slap. */
        values[values.RIGHT_SLAP_MIDDLE_FINGER = 16] = "RIGHT_SLAP_MIDDLE_FINGER";

        /** Plain right ring finger found within a plain right four finger
         *  slap. */
        values[values.RIGHT_SLAP_RING_FINGER = 17] = "RIGHT_SLAP_RING_FINGER";

        /** Plain right little finger found within a plain right four finger
         *  slap. */
        values[values.RIGHT_SLAP_LITTLE_FINGER = 18] = "RIGHT_SLAP_LITTLE_FINGER";

        /** Plain left index finger found within a plain left four finger
         *  slap. */
        values[values.LEFT_SLAP_INDEX_FINGER = 19] = "LEFT_SLAP_INDEX_FINGER";

        /** Plain left middle finger found within a plain left four finger
         *  slap. */
        values[values.LEFT_SLAP_MIDDLE_FINGER = 20] = "LEFT_SLAP_MIDDLE_FINGER";

        /** Plain left ring finger found within a plain left four finger
         *  slap. */
        values[values.LEFT_SLAP_RING_FINGER = 21] = "LEFT_SLAP_RING_FINGER";

        /** Plain left little finger found within a plain left four finger
         *  slap. */
        values[values.LEFT_SLAP_LITTLE_FINGER = 22] = "LEFT_SLAP_LITTLE_FINGER";

        /** Plain dual (right and left) thumbs */
        values[values.PLAIN_DUAL_THUMBS = 31] = "PLAIN_DUAL_THUMBS";

        /** Plain right thumb from within a dual thumb impression */
        values[values.PLAIN_DUAL_THUMBS_RIGHT = 32] = "PLAIN_DUAL_THUMBS_RIGHT";

        /** Plain left thumb from within a dual thumb impression. */
        values[values.PLAIN_DUAL_THUMBS_LEFT = 33] = "PLAIN_DUAL_THUMBS_LEFT";

        /** Plain right index finger. */
        values[values.PLAIN_RIGHT_INDEX_FINGER = 80] = "PLAIN_RIGHT_INDEX_FINGER";

        /** Plain right middle finger. */
        values[values.PLAIN_RIGHT_MIDDLE_FINGER = 81] = "PLAIN_RIGHT_MIDDLE_FINGER";

        /** Plain right ring finger. */
        values[values.PLAIN_RIGHT_RING_FINGER = 82] = "PLAIN_RIGHT_RING_FINGER";

        /** Plain right little finger. */
        values[values.PLAIN_RIGHT_LITTLE_FINGER = 83] = "PLAIN_RIGHT_LITTLE_FINGER";

        /** Plain left index finger. */
        values[values.PLAIN_LEFT_INDEX_FINGER = 84] = "PLAIN_LEFT_INDEX_FINGER";

        /** Plain left middle finger. */
        values[values.PLAIN_LEFT_MIDDLE_FINGER = 85] = "PLAIN_LEFT_MIDDLE_FINGER";

        /** Plain left ring finger. */
        values[values.PLAIN_LEFT_RING_FINGER = 86] = "PLAIN_LEFT_RING_FINGER";

        /** Plain left little finger. */
        values[values.PLAIN_LEFT_LITTLE_FINGER = 87] = "PLAIN_LEFT_LITTLE_FINGER";

        /** Five fingered slap of the right hand. */
        values[values.PLAIN_RIGHT_FIVE_FINGERS = 100] = "PLAIN_RIGHT_FIVE_FINGERS";

        /** Five fingered slap of the left hand. */
        values[values.PLAIN_LEFT_FIVE_FINGERS = 101] = "PLAIN_LEFT_FIVE_FINGERS";

        /** Plain right index found within a five finger slap. */
        values[values.RIGHT_FIVE_SLAP_INDEX_FINGER = 102] = "RIGHT_FIVE_SLAP_INDEX_FINGER";

        /** Plain right middle found within a five finger slap. */
        values[values.RIGHT_FIVE_SLAP_MIDDLE_FINGER = 103] = "RIGHT_FIVE_SLAP_MIDDLE_FINGER";

        /** Plain right ring found within a five finger slap. */
        values[values.RIGHT_FIVE_SLAP_RING_FINGER = 104] = "RIGHT_FIVE_SLAP_RING_FINGER";

        /** Plain right little found within a five finger slap. */
        values[values.RIGHT_FIVE_SLAP_LITTLE_FINGER = 105] = "RIGHT_FIVE_SLAP_LITTLE_FINGER";

        /** Plain right aux found within a five finger slap. */
        values[values.RIGHT_FIVE_SLAP_AUX_FINGER = 106] = "RIGHT_FIVE_SLAP_AUX_FINGER";

        /** Plain left index found within a five finger slap. */
        values[values.LEFT_FIVE_SLAP_INDEX_FINGER = 107] = "LEFT_FIVE_SLAP_INDEX_FINGER";

        /** Plain left middle found within a five finger slap. */
        values[values.LEFT_FIVE_SLAP_MIDDLE_FINGER = 108] = "LEFT_FIVE_SLAP_MIDDLE_FINGER";

        /** Plain left ring found within a five finger slap. */
        values[values.LEFT_FIVE_SLAP_RING_FINGER = 109] = "LEFT_FIVE_SLAP_RING_FINGER";

        /** Plain left little found within a five finger slap. */
        values[values.LEFT_FIVE_SLAP_LITTLE_FINGER = 110] = "LEFT_FIVE_SLAP_LITTLE_FINGER";

        /** Plain left aux found within a five finger slap. */
        values[values.LEFT_FIVE_SLAP_AUX_FINGER = 111] = "LEFT_FIVE_SLAP_AUX_FINGER";

        /** First two finger right. */
        values[values.FIRST_TWO_FINGER_RIGHT = 62] = "FIRST_TWO_FINGER_RIGHT";

        /** First two finger left. */
        values[values.FIRST_TWO_FINGER_LEFT = 65] = "FIRST_TWO_FINGER_LEFT";

        /** Second two finger right. */
        values[values.SECOND_TWO_FINGER_RIGHT = 68] = "SECOND_TWO_FINGER_RIGHT";

        /** Second two finger left. */
        values[values.SECOND_TWO_FINGER_LEFT = 71] = "SECOND_TWO_FINGER_LEFT";

        /** Third two finger right. */
        values[values.THIRD_TWO_FINGER_RIGHT = 74] = "THIRD_TWO_FINGER_RIGHT";

        /** Third two finger left. */
        values[values.THIRD_TWO_FINGER_LEFT = 77] = "THIRD_TWO_FINGER_LEFT";

        /** Dual index. */
        values[values.DUAL_INDEX = 114] = "DUAL_INDEX";

        /** First two finger right index finger. */
        values[values.FIRST_TWO_FINGER_RIGHT_INDEX_FINGER = 63] = "FIRST_TWO_FINGER_RIGHT_INDEX_FINGER";

        /** First two finger right middle finger. */
        values[values.FIRST_TWO_FINGER_RIGHT_MIDDLE_FINGER = 64] = "FIRST_TWO_FINGER_RIGHT_MIDDLE_FINGER";

        /** First two finger left index finger. */
        values[values.FIRST_TWO_FINGER_LEFT_INDEX_FINGER = 66] = "FIRST_TWO_FINGER_LEFT_INDEX_FINGER";

        /** First two finger left middle finger. */
        values[values.FIRST_TWO_FINGER_LEFT_MIDDLE_FINGER = 67] = "FIRST_TWO_FINGER_LEFT_MIDDLE_FINGER";

        /** Second two finger right middle finger. */
        values[values.SECOND_TWO_FINGER_RIGHT_MIDDLE_FINGER = 69] = "SECOND_TWO_FINGER_RIGHT_MIDDLE_FINGER";

        /** Second two finger right ring finger. */
        values[values.SECOND_TWO_FINGER_RIGHT_RING_FINGER = 70] = "SECOND_TWO_FINGER_RIGHT_RING_FINGER";

        /** Second two finger left middle finger. */
        values[values.SECOND_TWO_FINGER_LEFT_MIDDLE_FINGER = 72] = "SECOND_TWO_FINGER_LEFT_MIDDLE_FINGER";

        /** Second two finger left ring finger. */
        values[values.SECOND_TWO_FINGER_LEFT_RING_FINGER = 73] = "SECOND_TWO_FINGER_LEFT_RING_FINGER";

        /** Third two finger right ring finger. */
        values[values.THIRD_TWO_FINGER_RIGHT_RING_FINGER = 75] = "THIRD_TWO_FINGER_RIGHT_RING_FINGER";

        /** Third two finger right little finger. */
        values[values.THIRD_TWO_FINGER_RIGHT_LITTLE_FINGER = 76] = "THIRD_TWO_FINGER_RIGHT_LITTLE_FINGER";

        /** Third two finger left ring finger. */
        values[values.THIRD_TWO_FINGER_LEFT_RING_FINGER = 78] = "THIRD_TWO_FINGER_LEFT_RING_FINGER";

        /** Third two finger left little finger. */
        values[values.THIRD_TWO_FINGER_LEFT_LITTLE_FINGER = 79] = "THIRD_TWO_FINGER_LEFT_LITTLE_FINGER";

        /** Dual index right index. */
        values[values.DUAL_INDEX_RIGHT_INDEX = 116] = "DUAL_INDEX_RIGHT_INDEX";

        /** Dual index left index. */
        values[values.DUAL_INDEX_LEFT_INDEX = 115] = "DUAL_INDEX_LEFT_INDEX";

        return values;
    })(),

    /** Sequencing method.
     *  @enum {number} */
    SequencingMethod : 
    (function()
    {
        var values = {};
        /** No type of sequencing will be performed. */
        values[values.NONE = 0] = "NONE";

        /** Plains and rolls will be checked to ensure they match. */
        values[values.SEQUENCING = 1] = "SEQUENCING";

        /** Each image will be checked to ensure it does not match an image
         *  with a different finger. */
        values[values.ANTI_SEQUENCING = 2] = "ANTI_SEQUENCING";

        /** Perform both sequencing and anti-sequencing, treating an error
         *  in either as a failure. */
        values[values.FULL_SEQUENCING = 3] = "FULL_SEQUENCING";

        /** First, an image will be checked for sequence errors. If there is
         *  a sequence error, it will then perform anti-sequencing and use
         *  the anti-sequencing result. */
        values[values.SMART_SEQUENCING = 4] = "SMART_SEQUENCING";

        return values;
    })(),

    /** Image format
     *  @enum {number} */
    ImageFormat : 
    (function()
    {
        var values = {};
        /** BMP format */
        values[values.BMP = 2] = "BMP";

        /** WSQ format */
        values[values.WSQ = 3] = "WSQ";

        /** JPEG format */
        values[values.JPG = 5] = "JPG";

        /** PNG format */
        values[values.PNG = 7] = "PNG";

        return values;
    })(),

    /** Fingerprint capture source.
     *  @enum {number} */
    CaptureSource : 
    (function()
    {
        var values = {};
        /** Livescan */
        values[values.LIVESCAN = 1] = "LIVESCAN";

        /** CardScan */
        values[values.CARDSCAN = 2] = "CARDSCAN";

        /** Latent */
        values[values.LATENT = 3] = "LATENT";

        /** Other */
        values[values.OTHER = 4] = "OTHER";

        return values;
    })(),

    /** The result when an image is analyzed
     *  @enum {number} */
    AnalysisResult : 
    (function()
    {
        var values = {};
        /** The image was successfully analyzed */
        values[values.SUCCESS = 0] = "SUCCESS";

        /** Friction ridge data could not be found in the image */
        values[values.NO_FINGERPRINT_FOUND = 1] = "NO_FINGERPRINT_FOUND";

        /** The quality of the image was too low to analyze */
        values[values.IMAGE_QUALITY_TOO_LOW = 2] = "IMAGE_QUALITY_TOO_LOW";

        /** The size of the image was too small to analyze */
        values[values.IMAGE_TOO_SMALL = 3] = "IMAGE_TOO_SMALL";

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

        /** Failed to connect to the server. */
        values[values.FAILED_TO_CONNECT_TO_SERVER = 4] = "FAILED_TO_CONNECT_TO_SERVER";

        /** The library failed to allocate memory. */
        values[values.OUT_OF_MEMORY = 100] = "OUT_OF_MEMORY";

        /** The fingerprint_set object was NULL. */
        values[values.NULL_FINGERPRINT_SET_OBJ = 101] = "NULL_FINGERPRINT_SET_OBJ";

        /** No image data is available for the impression. */
        values[values.NO_IMAGE_DATA = 102] = "NO_IMAGE_DATA";

        /** The cutoff was invalid. */
        values[values.INVALID_CUTOFF = 103] = "INVALID_CUTOFF";

        /** The sequence method was invalid. */
        values[values.INVALID_SEQUENCING_METHOD = 104] = "INVALID_SEQUENCING_METHOD";

        /** The impression was invalid. */
        values[values.INVALID_IMPRESSION = 105] = "INVALID_IMPRESSION";

        /** No fingerprint was found in the image. */
        values[values.NO_FINGERPRINT_FOUND = 106] = "NO_FINGERPRINT_FOUND";

        /** The image quality was too low. */
        values[values.IMAGE_QUALITY_TOO_LOW = 107] = "IMAGE_QUALITY_TOO_LOW";

        /** The compare template was not valid. */
        values[values.INVALID_COMPARE_TEMPLATE = 108] = "INVALID_COMPARE_TEMPLATE";

        /** The image could not be loaded. */
        values[values.CANNOT_LOAD_IMAGE = 109] = "CANNOT_LOAD_IMAGE";

        /** The image resolution was invalid. */
        values[values.INVALID_RESOLUTION = 110] = "INVALID_RESOLUTION";

        /** Invalid image format. */
        values[values.INVALID_IMAGE_FORMAT = 111] = "INVALID_IMAGE_FORMAT";

        /** The input image was too small. */
        values[values.IMAGE_TOO_SMALL = 112] = "IMAGE_TOO_SMALL";

        /** Cannot convert the image to the target format. */
        values[values.CANNOT_CONVERT_TO_FORMAT = 113] = "CANNOT_CONVERT_TO_FORMAT";

        /** The fingerprint capture object contained no captured image. */
        values[values.FINGERPRINT_CAPTURE_HAS_NO_CAPTURED_IMAGE = 114] = "FINGERPRINT_CAPTURE_HAS_NO_CAPTURED_IMAGE";

        /** Failed to retrieve the captured image from the fingerprint
         *  capture object. */
        values[values.FAILED_TO_RETRIEVE_CAPTURED_IMAGE = 115] = "FAILED_TO_RETRIEVE_CAPTURED_IMAGE";

        /** Invalid WSQ compression factor. Value must be in the range of
         *  2-50. */
        values[values.INVALID_WSQ_COMPRESSION_FACTOR = 116] = "INVALID_WSQ_COMPRESSION_FACTOR";

        /** Invalid JPEG quality. Value must be in the range of 1-100. */
        values[values.INVALID_JPG_QUALITY = 117] = "INVALID_JPG_QUALITY";

        /** The Fingerprint Capture library was not found and is
         *  unavailable. */
        values[values.FINGERPRINT_CAPTURE_NOT_AVAILABLE = 118] = "FINGERPRINT_CAPTURE_NOT_AVAILABLE";

        /** Invalid matching score. */
        values[values.INVALID_MATCHING_SCORE = 119] = "INVALID_MATCHING_SCORE";

        /** Not all fingers in slap could be found. */
        values[values.MISSING_FINGERS_IN_SLAP = 120] = "MISSING_FINGERS_IN_SLAP";

        /** The Card Scan library was not found and is unavailable. */
        values[values.CARD_SCAN_NOT_AVAILABLE = 121] = "CARD_SCAN_NOT_AVAILABLE";

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

/** Creates an object that implements the FingerprintSet API.
  *
  * @param websocketHandle - Handle to an open websocket connection, connected
  *      to the aw_bio_component_server. The caller is responsible for handling
  *      the "onerror" callback, whereas this class will handle the "onmessage"
  *      callback.
  *
  * @return Object that implements the FingerprintSet API.
  */
var createFingerprintSet = (function( transportObject, channelName )
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
        if ( !isCallback &&  functionName == "aw_fingerprint_set_finger_updated" )
        {
            if ( typeof callbacks.fingerUpdated != "undefined" )
            {
                callbacks.fingerUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_fingerprint_set_impression_updated" )
        {
            if ( typeof callbacks.impressionUpdated != "undefined" )
            {
                callbacks.impressionUpdated.apply( null, result.args );
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


    /** This function destroys the FingerprintSet object.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var destroy = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_destroy";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the method used to check that impressions are correctly
     *  entered.
     *  @param {Number} sequencingMethod Sequencing method.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setSequencingMethod = function( sequencingMethod )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_sequencing_method";
            jsonNode.args = [ sequencingMethod ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the cutoff used when matching one finger image against another
     *  image of the same finger.
     *  @param {Number} cutoff Score cutoff to be considered a match. Valid
     *  values are 0-100,000.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setSequencingCutoff = function( cutoff )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_sequencing_cutoff";
            jsonNode.args = [ cutoff ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the cutoff used when matching one finger image against an image
     *  of a different finger.
     *  @param {Number} cutoff Score cutoff to be considered a match. Valid
     *  values are 0-100,000.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setAntiSequencingCutoff = function( cutoff )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_anti_sequencing_cutoff";
            jsonNode.args = [ cutoff ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the compression factor that is used when creating WSQ images.
     *  @param {Number} wsqCompressionFactor WSQ compression factor.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setWsqCompressionFactor = function( wsqCompressionFactor )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_wsq_compression_factor";
            jsonNode.args = [ wsqCompressionFactor ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the quality value that is used when creating JPEG images.
     *  @param {Number} jpgQuality JPEG quality.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setJpgQuality = function( jpgQuality )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_jpg_quality";
            jsonNode.args = [ jpgQuality ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the image format that all input images will be converted and
     *  stored as.
     *  @param {Number} imageFormat Desired image format.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setImportImageFormat = function( imageFormat )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_import_image_format";
            jsonNode.args = [ imageFormat ];
            transport.send( jsonNode );
        } );
    };

    /** Clears all data.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var reset = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_reset";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Clears all impression image data while preserving missing finger
     *  status.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var clearAllImpressions = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_clear_all_impressions";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Clears a single impression's image data.
     *  @param {Number} impression Impression to clear.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var clearImpression = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_clear_impression";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Set capture source
     *  @param {Number} source Capture source of the fingerprints.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setCaptureSource = function( source )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_capture_source";
            jsonNode.args = [ source ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieves the impression meta data previously set.
     *  
     *  @returns {Promise<Number,Error>} Capture source of the fingerprints.
     *   */
    var getCaptureSource = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_capture_source";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the finger as present or missing.
     *  @param {Number} finger Finger to change.
     *  @param {Boolean} missing Whether the finger is missing.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setFingerMissing = function( finger, missing )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_finger_missing";
            jsonNode.args = [ finger, missing ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the input image as the one for the impression and performs
     *  segmentation and sequence checking.
     *  @param {Number} impression Impression contained in the image.
     *  @param {String} image Image containing the impression.
     *  @param {Number} resolution Image resolution.
     *  
     *  @returns {Promise<Number,Error>} 
     *   */
    var setImage = function( impression, image, resolution )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_image";
            jsonNode.args = [ impression, image, resolution ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the input image using a FingerprintCapture object that contains
     *  a captured image.
     *  @param {Number} impression Impression contained in the image.
     *  @param {String} fingerprintCapture FingerprintCapture object
     *  containing a captured impression image.
     *  
     *  @returns {Promise<Number,Error>} 
     *   */
    var setFingerprintCaptureImage = function( impression, fingerprintCapture )
    {
        fingerprintCapture = fingerprintCapture.channel;
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_fingerprint_capture_image";
            jsonNode.args = [ impression, fingerprintCapture ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the input image using a FingerprintCapture object that contains
     *  a captured image.
     *  @param {Number} impression Impression contained in the image.
     *  @param {String} cardScan CardScan object containing a captured
     *  impression image.
     *  
     *  @returns {Promise<Number,Error>} 
     *   */
    var setCardScanImage = function( impression, cardScan )
    {
        cardScan = cardScan.channel;
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_card_scan_image";
            jsonNode.args = [ impression, cardScan ];
            transport.send( jsonNode );
        } );
    };

    /** Sets meta data for an impression. Image must already be set. Meta
     *  data is cleared when a new image for the same impression is entered.
     *  @param {Number} impression Impression.
     *  @param {String} metaData Meta data for the impression.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setImpressionMetaData = function( impression, metaData )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_set_impression_meta_data";
            jsonNode.args = [ impression, metaData ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieves the impression meta data previously set.
     *  @param {Number} impression Impression.
     *  
     *  @returns {Promise<String,Error>} Meta data for the impression.
     *   */
    var getImpressionMetaData = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_impression_meta_data";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the finger_updated.
     *  @param {String} fingerUpdated Called when a finger's present status
     *  has been updated.
     *   */
    var setFingerUpdated = function( fingerUpdated )
    {
        callbacks.fingerUpdated = fingerUpdated;
    };

    /** Sets the impression_updated.
     *  @param {String} impressionUpdated Called when an impression's
     *  present status has been updated.
     *   */
    var setImpressionUpdated = function( impressionUpdated )
    {
        callbacks.impressionUpdated = impressionUpdated;
    };

    /** Whether the finger is set as present.
     *  @param {Number} finger Finger to query.
     *  
     *  @returns {Promise<Boolean,Error>} Whether the finger is present.
     *   */
    var isFingerPresent = function( finger )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_is_finger_present";
            jsonNode.args = [ finger ];
            transport.send( jsonNode );
        } );
    };

    /** Whether or not the impression has been analyzed.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<Boolean,Error>} Whether or not the impression has
     *  been analyzed.
     *   */
    var isImpressionAnalyzed = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_is_impression_analyzed";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the input image of the impression.
     *  @param {Number} impression Impression to query.
     *  @param {Number} imageFormat Desired image format.
     *  
     *  @returns {Promise<String,Error>} Image containing the impression.
     *   */
    var getInputImage = function( impression, imageFormat )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_input_image";
            jsonNode.args = [ impression, imageFormat ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the cropped image of the impression with the surrounding noise
     *  removed.
     *  @param {Number} impression Impression to query.
     *  @param {Number} imageFormat Desired image format.
     *  
     *  @returns {Promise<String,Error>} Segmented image containing the
     *  impression.
     *   */
    var getSegmentedImage = function( impression, imageFormat )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_segmented_image";
            jsonNode.args = [ impression, imageFormat ];
            transport.send( jsonNode );
        } );
    };

    /** Gets an image that is the  size specified. The image is cropped or
     *  expanded as necessary.
     *  @param {Number} impression Impression to query.
     *  @param {Number} width Desired width of the output image.
     *  @param {Number} height Desired height of the output image.
     *  @param {Number} imageFormat Desired image format.
     *  
     *  @returns {Promise<String,Error>} Sized image containing the
     *  impression.
     *   */
    var getSizedImage = function( impression, width, height, imageFormat )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_sized_image";
            jsonNode.args = [ impression, width, height, imageFormat ];
            transport.send( jsonNode );
        } );
    };

    /** Gets a color coded quality image of the impression.
     *  @param {Number} impression Impression to query.
     *  @param {Number} imageFormat Desired image format.
     *  
     *  @returns {Promise<String,Error>} Color coded quality image.
     *   */
    var getQualityImage = function( impression, imageFormat )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_quality_image";
            jsonNode.args = [ impression, imageFormat ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the coordinates of segmented fingerprints.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<Object,Error>} Coordinates of a box around the
     *  segmented fingerprint.
     *   */
    var getSegmentationCoordinates = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_segmentation_coordinates";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Gets quality score for the segmentation. Normal values are 0-100,
     *  254 means the quality was not attempted to be calculated, 255 means
     *  the quality was attempted but could not be calculated.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<Number,Error>} Segmentation quality score.
     *   */
    var getSegmentationQuality = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_segmentation_quality";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the AFIQ score for the impression.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<Number,Error>} AFIQ score.
     *   */
    var getAfiqScore = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_afiq_score";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the NFIQ score for the impression.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<Number,Error>} NFIQ score.
     *   */
    var getNfiqScore = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_nfiq_score";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the number of minutia found in the impression.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<Number,Error>} Minutia count.
     *   */
    var getMinutiaCount = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_minutia_count";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Whether all of the expected digits were found in the input image.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<Boolean,Error>} Whether all of the expected digits
     *  were found in the input image.
     *   */
    var enoughDigitsCaptured = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_enough_digits_captured";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Whether the impression failed sequencing or not. This returns
     *  "false" when there are no images that could be compared against.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<Boolean,Error>} Whether the impression failed
     *  sequencing.
     *   */
    var failedSequencing = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_failed_sequencing";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieves the list of sequencing errors for an impression.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<Object,Error>} List of sequencing errors for the
     *  impression.
     *   */
    var getSequencingErrors = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_sequencing_errors";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Gets a compare template for the impression that can be used in
     *  aw_fingerprint_set_compare_templates.
     *  @param {Number} impression Impression to query.
     *  
     *  @returns {Promise<String,Error>} Match template.
     *   */
    var getCompareTemplate = function( impression )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_compare_template";
            jsonNode.args = [ impression ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the compare score for the two templates. Scores range from
     *  0-100,000.
     *  @param {String} template1 First impression template.
     *  @param {String} template2 Second impression template.
     *  
     *  @returns {Promise<Number,Error>} Compare score.
     *   */
    var compareTemplates = function( template1, template2 )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_compare_templates";
            jsonNode.args = [ template1, template2 ];
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
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_version";
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
                if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintSetApi.ErrorCode )
                    {
                        if ( FingerprintSetApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_set_get_version_string";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };




    var instance = {};
    instance.onMessage = onMessage;
    instance.channel = channel;
    instance.destroy = destroy;
    instance.setSequencingMethod = setSequencingMethod;
    instance.setSequencingCutoff = setSequencingCutoff;
    instance.setAntiSequencingCutoff = setAntiSequencingCutoff;
    instance.setWsqCompressionFactor = setWsqCompressionFactor;
    instance.setJpgQuality = setJpgQuality;
    instance.setImportImageFormat = setImportImageFormat;
    instance.reset = reset;
    instance.clearAllImpressions = clearAllImpressions;
    instance.clearImpression = clearImpression;
    instance.setCaptureSource = setCaptureSource;
    instance.getCaptureSource = getCaptureSource;
    instance.setFingerMissing = setFingerMissing;
    instance.setImage = setImage;
    instance.setFingerprintCaptureImage = setFingerprintCaptureImage;
    instance.setCardScanImage = setCardScanImage;
    instance.setImpressionMetaData = setImpressionMetaData;
    instance.getImpressionMetaData = getImpressionMetaData;
    instance.setFingerUpdated = setFingerUpdated;
    instance.setImpressionUpdated = setImpressionUpdated;
    instance.isFingerPresent = isFingerPresent;
    instance.isImpressionAnalyzed = isImpressionAnalyzed;
    instance.getInputImage = getInputImage;
    instance.getSegmentedImage = getSegmentedImage;
    instance.getSizedImage = getSizedImage;
    instance.getQualityImage = getQualityImage;
    instance.getSegmentationCoordinates = getSegmentationCoordinates;
    instance.getSegmentationQuality = getSegmentationQuality;
    instance.getAfiqScore = getAfiqScore;
    instance.getNfiqScore = getNfiqScore;
    instance.getMinutiaCount = getMinutiaCount;
    instance.enoughDigitsCaptured = enoughDigitsCaptured;
    instance.failedSequencing = failedSequencing;
    instance.getSequencingErrors = getSequencingErrors;
    instance.getCompareTemplate = getCompareTemplate;
    instance.compareTemplates = compareTemplates;
    instance.getVersion = getVersion;
    instance.getVersionString = getVersionString;

    return new Promise( function( resolve, reject )
    {
        internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
        {
            if ( errorCode == FingerprintSetApi.ErrorCode.NO_ERRORS )
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
        jsonNode.function = "aw_fingerprint_set_create";
        jsonNode.channel = channel;
        transport.send( jsonNode );
    } );
});

