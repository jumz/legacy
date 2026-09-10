/* Copyright (C) 2021 Aware, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/** @namespace
 */
var BiocomponentServerApi =
{
    /** List of error codes.
     *  @enum {number} */
    ErrorCode :
        (function() {
            var values = {};
            /** No errors or warnings. */
            values[values.NO_ERRORS = 0] = "NO_ERRORS";
            return values;
        })()
};

createBiocomponentServer = (function( transportObject, channelName )
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
            if ( typeof onReturn === "function" )
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

    var getVersion = function(){
        return call("get_version");
    };

    var getPluginList = function(){
        return call("get_plugin_list")
    };

    var packageVersion = function(){
        return call("package_version")
    };
    
    var shutdown = function(){
        return call("shutdown")
    };

    var call = function( functionName )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode === BiocomponentServerApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in BiocomponentServerApi.ErrorCode )
                    {
                        if ( BiocomponentServerApi.ErrorCode[errorEntry] === errorCode )
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
            jsonNode.function = functionName;
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    var instance = {};
    instance.getVersion = getVersion;
    instance.getPluginList = getPluginList;
    instance.packageVersion = packageVersion;
    instance.shutdown = shutdown;
    return instance;
});