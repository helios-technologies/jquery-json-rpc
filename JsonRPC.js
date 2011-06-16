(function() {
    // private variables
    var
    /**
     * @var {string} JSON-RPC server address
     */
    apiUrl = '/api/json-rpc',
    /**
     * @var {string} API namespace
     */
    apiNamespace = 'default',
    /**
     * @var {function} Callback to handle exceptions
     */
    defaultExceptionsHandler = null;
    /**
     * @var {object} Some default exceptions
     */
    var exceptions = {
        BadResponseId: {
            name: 'BadResponseId',
            message: 'A response ID seems to be wrong'
        },
        TypeMismatch: {
            name: 'TypeMismatch',
            message: 'Bad query params'
        },
        BadParameters: {
            name: 'BadParameters',
            message: 'One or more of function\'s params are wrong'
        }
    };
    
    JsonRPC = window.JsonRPC = function() {
        return new JsonRPC.fn.init();
    };
    
    /**
     * Main JSON-RPC Query
     *
     * @param {string} functionName
     * @param {array} params
     * @param {function} callback
     * @param {function} error
     */
    var query = function(functionName, params, callback, error) {
        // if params are ok, then...
        if ('object' == typeof params && 'string' == typeof functionName) {
            // cast it to string, because on some OS this value will be converted to float on client side
            var id = String(new Date().getTime());
            // create query object in json-rpc format
            var query = {
                jsonrpc: '2.0',
                method: apiNamespace + '.' + functionName,
                id: id,
                params: params
            };

            // send query
            return $.ajax({
                type: 'POST',
                url: apiUrl,
                data: $.toJSON(query),
                success: function (data, status) {
                    // if callback variable has function...
                    if ('function' == typeof callback) {
                        // then call it whith params (input data, error)
                        // always only one parameter has value and second is null
                        if (id != data.id && data.id !== 'fixture') {
                            handleExceptions(exceptions.BadResponseId);
                        }
                        
                        //callback.apply(this, [{result: data.result, error: data.error}]);
                        callback.apply(this, [data.result, data.error]);
                    } else {
                        // if there is no callback (or it's wrong) use standard method
                        // to handle errors
                        if (null != data.error) {
                            handleExceptions(data.error);
                        }
                    }
                },
                error: error,
                dataType: 'json',
                fixture: apiNamespace + '-' + functionName + '.jsonrpc'
            });
        } else {
            handleExceptions(exceptions.TypeMismatch);
        }
    }

    /**
     * Funkcja domyślnej obsługi błędów
     *
     * @param {object} exception
     */
    var handleExceptionsDefault = function(exception) {
        throw exception.name;
    }

    /**
     * Funkcja obsługi błędów - wywołuje domyślną, lub ustawioną przez użytkownika,
     * jeśli jest poprawna
     *
     * @param {object} exception
     */
    var handleExceptions = function(exception) {
        if (null == defaultExceptionsHandler || 'function' != typeof defaultExceptionsHandler) {
            defaultExceptionsHandler = handleExceptionsDefault;
        }
        defaultExceptionsHandler.call(this, exception);
    }

    // public methods
    JsonRPC.fn = JsonRPC.prototype = {
        /**
         * @var {string} Version number
         */
        version: '0.2a',

        /**
         * Simple constructor
         * @init
         */
        init: function() {
            return this;
        },

        /**
         * Funkcja pozwalająca na zmianę domyślnej funkcji obsługi błędów
         *
         * @param {function} callback
         * @return bool
         */
        setDefaultExceptionsHandler: function(callback) {
            if ('function' == typeof callback) {
                defaultExceptionsHandler = callback;
                return true;
            }
            return false;
        },

        /**
         * Obsługa błędów
         *
         * @param {object} exception Obiekt błędu
         * @return mixed
         */
        handleExceptions: function(exception) {
            return handleExceptions(exception);
        },

        /**
         * Sets url to call api
         *
         * @param {string} url URL
         */
        setApiUri: function(url) {
            if ('string' == typeof url) {
                apiUrl = url;
            }
        },

        /**
         * Gets url to call api
         *
         * @return {string} URL
         */
        getApiUri: function() {
            return apiUrl;
        },

        /**
         * Sets default namespace to call via api
         * 
         * @param {string} namespace Namespace
         */
        setApiNamespace: function(namespace) {
            if ('string' == typeof namespace) {
                apiNamespace = namespace;
            }
        },
        
        /**
         * Gets namespace to call via api
         * 
         * @return {string} Namespace
         */
        getApiNamespace: function() {
            return apiNamespace;
        },

        /**
         * Main JSON-RPC Query
         *
         * @param {string} functionName
         * @param {array} params
         * @param {function} callback
         * @param {function} error
         */
        query: function(functionName, params, callback, error) {
            return query(functionName, params, callback, error);
        }
    };
    
    // Give the init function the JsonRPC prototype for later instantiation
    JsonRPC.fn.init.prototype = JsonRPC.fn;
})();
jsonRPC = new JsonRPC();