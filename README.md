JQuery Json Rpc 2.0
===============
This is JSON RPC 2.0 (Remote Procedure Call) client implementation based on jQuery. You can find specification on http://groups.google.com/group/json-rpc/web/json-rpc-1-2-proposal.

Forked from: http://plugins.jquery.com/project/jsonRPC2

How to use it:
~~~~~~ {ruby}
$.jsonRpc('functionName', ['param1', 'param2'], onSuccessCallback, onErrorCallback);
~~~~~~

Configuration:
~~~~~~ {ruby}
$.jsonRpcSetup({
    namespace: 'default',
    url: '/api/json-rpc'
});
~~~~~~
