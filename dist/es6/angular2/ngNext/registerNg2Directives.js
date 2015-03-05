function registerPropertyDirectives(ngModule) {
    const ALL_PROPERTIES = ['abbr', 'accept', 'acceptCharset', 'accessKey', 'accessKeyLabel', 'action', 'allowfullscreen', 'alt', 'areas', 'async', 'attributes', 'audioTracks', 'autocomplete', 'autofocus', 'autoplay', 'baseURI', 'buffered', 'caption', 'cellIndex', 'cells', 'challenge', 'charset', 'checked', 'childElementCount', 'childNodes', 'children', 'cite', 'classList', 'className', 'clientHeight', 'clientLeft', 'clientTop', 'clientWidth', 'color', 'cols', 'colSpan', 'complete', 'content', 'contentDocument', 'contentEditable', 'contentWindow', 'contextMenu', 'control', 'controller', 'controls', 'coords', 'crossOrigin', 'currentSrc', 'currentTime', 'data', 'dataset', 'datetime', 'default', 'defaultChecked', 'defaultMuted', 'defaultPlaybackRate', 'defaultSelected', 'defaultValue', 'defer', 'dir', 'dirName', 'disabled', 'download', 'draggable', 'dropzone', 'duration', 'elements', 'encoding', 'enctype', 'ended', 'error', 'face', 'files', 'firstChild', 'firstElementChild', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'hash', 'headers', 'height', 'hidden', 'high', 'host', 'hostname', 'href', 'hreflang', 'htmlFor', 'httpEquiv', 'id', 'images', 'indeterminate', 'index', 'innerHTML', 'inputMode', 'isContentEditable', 'isMap', 'itemId', 'itemProp', 'itemRef', 'itemScope', 'itemType', 'itemValue', 'keySystem', 'keytype', 'kind', 'label', 'labels', 'lang', 'lastChild', 'lastElementChild', 'length', 'list', 'loop', 'low', 'max', 'maxLength', 'media', 'mediaGroup', 'menu', 'method', 'min', 'multiple', 'muted', 'name', 'naturalHeight', 'naturalWidth', 'networkState', 'nextElementSibling', 'nextSibling', 'nodeName', 'nodeType', 'nodeValue', 'noValidate', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth', 'optimum', 'options', 'origin', 'outerHTML', 'ownerDocument', 'parentElement', 'parentNode', 'password', 'pathname', 'pattern', 'paused', 'placeholder', 'playbackRate', 'played', 'port', 'position', 'poster', 'preload', 'previousElementSibling', 'previousSibling', 'properties', 'protocol', 'readOnly', 'readyState', 'rel', 'relList', 'required', 'reversed', 'rowIndex', 'rows', 'rowSpan', 'sandbox', 'scope', 'scoped', 'scrollHeight', 'scrollLeft', 'scrollTop', 'scrollWidth', 'seamless', 'search', 'sectionRowIndex', 'seekable', 'seeking', 'select', 'selected', 'selectedIndex', 'selectedOptions', 'selectionDirection', 'selectionEnd', 'selectionStart', 'shadowRoot', 'sheet', 'size', 'sizes', 'sortable', 'sorted', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabIndex', 'tagName', 'target', 'tBodies', 'text', 'textContent', 'textLength', 'textTracks', 'tFoot', 'tHead', 'title', 'track', 'translate', 'type', 'typeMustMatch', 'undoManager', 'undoScope', 'useMap', 'username', 'validationMessage', 'validity', 'value', 'valueAsDate', 'valueAsNumber', 'videoHeight', 'videoTracks', 'videoWidth', 'volume', 'width', 'willValidate', 'wrap'];

    angular.forEach(ALL_PROPERTIES, function (prop) {
        var directiveName = `[${prop}]`;
        ngModule.directive(directiveName, ['$parse', '$timeout', function ($parse, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var domElement = element[0];

                    var bindExpression = $parse(attrs[directiveName]);

                    var curValue = bindExpression(scope);
                    if (curValue === undefined) {
                        curValue = domElement[prop];
                        if (curValue !== undefined) {
                            bindExpression.assign(scope, curValue);
                        }
                    } else {
                        domElement[prop] = curValue;
                    }


                    //Note that this will only be called on a digest and changes to a property won't necessarily trigger a digest.
                    scope.$watch(() => domElement[prop],
                        function (newValue) {
                            if (newValue !== curValue) {
                                curValue = newValue;
                                bindExpression.assign(scope, newValue);
                            }
                        });

                    scope.$watch(attrs[directiveName], function (newValue) {
                        if (newValue !== curValue) {
                            curValue = newValue;
                            domElement[prop] = newValue;
                        }
                    });


                    if (domElement.nodeName === 'INPUT' || domElement.nodeName === 'TEXTAREA') {
                        domElement.addEventListener('input', function () {
                            var newValue = domElement[prop];
                            if (newValue !== curValue) {
                                curValue = newValue;
                                bindExpression.assign(scope, newValue);
                                scope.$apply();
                            }
                        });
                    }

                }
            };
        }]);
    });
}

//Taken from https://github.com/angular/angular.js/blob/master/src/ng/directive/ngEventDirs.js
function registerEventDirectives(ngModule) {
    var forceAsyncEvents = {
        'blur': true,
        'focus': true
    };
    angular.forEach(
        'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
        function (eventName) {
            var directiveName = `(${eventName})`;
            ngModule.directive(directiveName, ['$parse', '$rootScope', function ($parse, $rootScope) {
                return {
                    restrict: 'A',
                    compile: function ($element, attr) {
                        // We expose the powerful $event object on the scope that provides access to the Window,
                        // etc. that isn't protected by the fast paths in $parse.  We explicitly request better
                        // checks at the cost of speed since event handler expressions are not executed as
                        // frequently as regular change detection.
                        var fn = $parse(attr[directiveName], /* interceptorFn */ null, /* expensiveChecks */ true);
                        return function ngEventHandler(scope, element) {
                            element.on(eventName, function (event) {
                                var callback = function () {
                                    fn(scope, {$event: event});
                                };
                                if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                                    scope.$evalAsync(callback);
                                } else {
                                    scope.$apply(callback);
                                }
                            });
                        };
                    }
                };
            }]);
        }
    );
}

export default function (ngModule) {
    registerPropertyDirectives(ngModule);
    registerEventDirectives(ngModule);
};