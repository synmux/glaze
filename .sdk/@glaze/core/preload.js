var $="__glazeIPCStructuredCloneV1",y="glaze.transport.hello";var ae={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array};function R(r,t){let e=ke(t),n=r?` at \`${r}\``:"",i="";return e==="Promise"?i=`Found a Promise${n} \u2014 did you forget to \`await\` an async call before returning it? Some Glaze APIs are async where Electron's are synchronous (e.g. \`app.isPackaged()\`, \`globalShortcut.register()\`).`:e==="function"?i=`Found a function${n}; functions cannot cross the IPC boundary \u2014 return a serializable value instead.`:e?i=`Found a non-serializable value of type \`${e}\`${n}.`:n&&(i=`Non-serializable value${n}.`),new Error(i?`An object could not be cloned. ${i}`:"An object could not be cloned.")}function ke(r){if(r==null)return null;let t=typeof r;if(t==="function"||t==="symbol")return t;if(t==="object"){if(typeof r.then=="function")return"Promise";let e=r.constructor?.name;return e&&e!=="Object"?e:"object"}return t}function V(r){return Object.is(r,-0)?"-0":String(r)}function q(r){return r==="-0"?-0:Number(r)}function j(r){let t=globalThis.Buffer;if(t)return t.from(r).toString("base64");let e="";for(let n=0;n<r.length;n+=1)e+=String.fromCharCode(r[n]);return btoa(e)}function se(r){let t=globalThis.Buffer;if(t)return t.from(r,"base64");let e=atob(r),n=new Uint8Array(e.length);for(let i=0;i<e.length;i+=1)n[i]=e.charCodeAt(i);return n}function oe(r){let t=new ArrayBuffer(r.byteLength);return new Uint8Array(t).set(r),t}function Se(r){return j(new Uint8Array(r))}function ie(r){return oe(se(r))}function Ne(r,t){try{return structuredClone(r)}catch{throw R(t,r)}}function ce(r){let t=Object.getPrototypeOf(r);return t===Object.prototype||t===null}function Me(){return{references:new WeakMap,nextId:1}}function xe(){return{references:new Map}}function Ue(r,t){let e=t.references.get(r);if(e!==void 0)return{id:e,alreadyEncoded:!0};let n=t.nextId;return t.nextId+=1,t.references.set(r,n),{id:n,alreadyEncoded:!1}}function m(r,t,e){typeof r=="number"&&e.references.set(r,t)}function b(r,t,e){if(r===void 0)return{type:"Undefined"};if(r===null)return{type:"Null"};switch(typeof r){case"boolean":return{type:"Boolean",value:r};case"string":return{type:"String",value:r};case"number":return{type:"Number",value:V(r)};case"bigint":return{type:"BigInt",value:r.toString()};case"function":case"symbol":throw R(t,r);case"object":break;default:throw R(t,r)}let i=Ue(r,e);if(i.alreadyEncoded)return{type:"Reference",id:i.id};if(Array.isArray(r)){let a=[];for(let s=0;s<r.length;s++)Object.prototype.hasOwnProperty.call(r,s)?a.push(b(r[s],`${t}[${s}]`,e)):a.push({type:"ArrayHole"});return{type:"Array",id:i.id,value:a}}if(r instanceof Date)return{type:"Date",id:i.id,value:V(r.getTime())};if(r instanceof RegExp)return{type:"RegExp",id:i.id,source:r.source,flags:r.flags,lastIndex:V(r.lastIndex)};if(r instanceof Map)return{type:"Map",id:i.id,value:Array.from(r.entries(),([a,s],c)=>[b(a,`${t}.<map-key-${c}>`,e),b(s,`${t}.<map-value-${c}>`,e)])};if(r instanceof Set)return{type:"Set",id:i.id,value:Array.from(r.values(),(a,s)=>b(a,`${t}.<set-${s}>`,e))};if(r instanceof ArrayBuffer)return{type:"ArrayBuffer",id:i.id,value:Se(r)};if(ArrayBuffer.isView(r)){let a=new Uint8Array(r.buffer,r.byteOffset,r.byteLength);if(r instanceof DataView)return{type:"DataView",id:i.id,value:j(a)};let s=r.constructor.name==="Buffer"?"Uint8Array":r.constructor.name;if(!(s in ae))throw R(t,r);return{type:"TypedArray",id:i.id,name:s,value:j(a)}}if(r instanceof Error)return{type:"Error",id:i.id,name:r.name,message:r.message,...typeof r.stack=="string"?{stack:r.stack}:{}};if(!ce(r))throw R(t,r);return{type:"Object",id:i.id,value:Object.entries(r).map(([a,s])=>[a,b(s,`${t}.${a}`,e)])}}function v(r,t){switch(r.type){case"Undefined":return;case"Null":return null;case"Boolean":case"String":return r.value;case"Number":return q(r.value);case"BigInt":return BigInt(r.value);case"Reference":{if(!t.references.has(r.id))throw new Error(`Invalid IPC reference id: ${r.id}`);return t.references.get(r.id)}case"Array":{let e=new Array(r.value.length);m(r.id,e,t);for(let n=0;n<r.value.length;n++){let i=r.value[n];i.type!=="ArrayHole"&&(e[n]=v(i,t))}return e}case"ArrayHole":return;case"Object":{let e={};m(r.id,e,t);for(let[n,i]of r.value)Object.defineProperty(e,n,{value:v(i,t),writable:!0,configurable:!0,enumerable:!0});return e}case"Date":{let e=new Date(q(r.value));return m(r.id,e,t),e}case"RegExp":{let e=new RegExp(r.source,r.flags);return e.lastIndex=q(r.lastIndex),m(r.id,e,t),e}case"Map":{let e=new Map;m(r.id,e,t);for(let[n,i]of r.value)e.set(v(n,t),v(i,t));return e}case"Set":{let e=new Set;m(r.id,e,t);for(let n of r.value)e.add(v(n,t));return e}case"ArrayBuffer":{let e=ie(r.value);return m(r.id,e,t),e}case"TypedArray":{let e=se(r.value),n=oe(e),i=ae[r.name],a=new i(n);return m(r.id,a,t),a}case"DataView":{let e=new DataView(ie(r.value));return m(r.id,e,t),e}case"Error":{let e=new Error(r.message);return e.name=r.name,typeof r.stack=="string"&&(e.stack=r.stack),m(r.id,e,t),e}}}function de(r){return!!r&&typeof r=="object"&&$ in r&&Object.keys(r).length===1}function le(r){return de(r)||!W(r,new WeakSet)}function W(r,t){if(r===null)return!0;switch(typeof r){case"boolean":case"string":return!0;case"number":return Number.isFinite(r)&&!Object.is(r,-0);case"object":break;default:return!1}let e=r;if(t.has(e))return!1;if(t.add(e),Array.isArray(r)){for(let n=0;n<r.length;n+=1)if(!Object.prototype.hasOwnProperty.call(r,n)||!W(r[n],t))return!1;return!0}if(!ce(e))return!1;for(let n of Object.values(e))if(!W(n,t))return!1;return!0}function C(r,t="argument"){let e=Ne(r,t);return{[$]:b(e,t,Me())}}function f(r){return de(r)?v(r[$],xe()):r}function S(r,t="argument"){C(r,t)}function H(r){for(let t=0;t<r.length;t++)S(r[t],`argument[${t}]`)}function ue(r){return r instanceof Error&&r.isIpcTransportFailure===!0}var N=class extends Error{constructor(e,n={}){super(`Request timeout: ${e}`);this.isIpcTransportFailure=!0;this.ipcSanitizedMessage="Something went wrong. Please try again.";this.ipcFailureKind="request_timeout";this.name="IpcRequestTimeoutError",this.ipcOperation=n.operation,this.ipcChannel=n.method,this.ipcRawMessage=this.message,this.ipcTimeoutMs=n.timeoutMs,this.ipcAgeMs=n.ageMs,this.ipcIdleMs=n.idleMs}},A=()=>typeof window<"u"&&window.__GLAZE_IPC_TRACE__===!0||typeof process<"u"&&process?.env?.GLAZE_IPC_TRACE==="1",M=class{constructor(){this.pendingRequests=new Map;this.requestCounter=0;this.notificationHandlers=new Map;this.notificationQueue=new Map;this.MAX_QUEUE_SIZE=10;this.lastClearPendingReason=null;this.lastClearPendingAt=null}generateRequestId(){return`${++this.requestCounter}`}createRequest(t,e,n){return{jsonrpc:"2.0",id:this.generateRequestId(),method:t,params:e,...n?{meta:n}:{}}}registerPendingRequest(t,e,n,i=5e3,a,s="invoke"){let c=setTimeout(()=>{let o=this.pendingRequests.get(t);o&&(this.pendingRequests.delete(t),o.reject(new N(t,{method:o.metadata.method,operation:o.metadata.operation,timeoutMs:o.metadata.timeoutMs,ageMs:Date.now()-o.metadata.createdAt})))},i);this.pendingRequests.set(t,{resolve:e,reject:n,timeout:c,metadata:{method:a,createdAt:Date.now(),lastActivityAt:Date.now(),isStreaming:!1,timeoutMs:i,operation:s}})}registerStreamingRequest(t,e,n,i,a=3600*1e3,s){this.pendingRequests.set(t,{resolve:n,reject:i,timeout:this.scheduleStreamInactivityTimeout(t,a),onChunk:e,metadata:{method:s,createdAt:Date.now(),lastActivityAt:Date.now(),isStreaming:!0,timeoutMs:a,operation:"stream"}}),A()&&console.log("[IPCTrace] Registered streaming request",{id:t,method:s??"unknown",timeoutMs:a})}scheduleStreamInactivityTimeout(t,e){return setTimeout(()=>{let n=this.pendingRequests.get(t);if(!n)return;let i=n.metadata.timeoutMs,a=Date.now()-n.metadata.lastActivityAt;if(a<i){n.timeout=this.scheduleStreamInactivityTimeout(t,i-a);return}this.pendingRequests.delete(t),n.reject(new N(t,{method:n.metadata.method,operation:n.metadata.operation,timeoutMs:n.metadata.timeoutMs,ageMs:Date.now()-n.metadata.createdAt,idleMs:a}))},e)}handleResponse(t){try{let e=JSON.parse(t);this.handleResponseObject(e)}catch(e){console.error("[MessageProcessor] Failed to parse response:",e)}}handleResponseObject(t){if(!t.id&&typeof t.method=="string"){this.handleNotification({method:t.method,params:f(t.params)});return}let e=this.normalizeResponseId(t.id,t.type);if(!e)return;let n=this.pendingRequests.get(e);if(!n){if(t.type==="complete"||t.type==="error"){let a=this.lastClearPendingAt===null?null:Math.max(0,Date.now()-this.lastClearPendingAt);console.error("[MessageProcessor] Unmatched stream completion response",{id:e,type:t.type,pendingIds:Array.from(this.pendingRequests.keys()),lastClearPendingReason:this.lastClearPendingReason??"none",lastClearPendingAgoMs:a})}else A()&&console.log("[IPCTrace] Unmatched response",{id:e,type:t.type,method:t.method});return}if(t.type){let a=t;this.handleStreamResponse(a,e,n);return}let i=t;if(clearTimeout(n.timeout),this.pendingRequests.delete(e),i.error){let a=this.hydrateBackendError(new Error(i.error.message),f(i.error.data));n.reject(a);return}A()&&n.metadata.isStreaming&&console.log("[IPCTrace] Streaming request resolved via regular response",{id:e,method:n.metadata.method??"unknown",durationMs:Date.now()-n.metadata.createdAt}),n.resolve(f(i.result))}handleStreamResponse(t,e,n){if(t.type==="chunk"){if(n.metadata.lastActivityAt=Date.now(),n.onChunk)try{n.onChunk(f(t.data))}catch(i){console.error("[MessageProcessor] Error in stream onChunk callback",{id:e,method:n.metadata.method??"unknown",error:i})}}else if(t.type==="complete"){let i=Date.now()-n.metadata.createdAt;clearTimeout(n.timeout),this.pendingRequests.delete(e),A()&&console.log("[IPCTrace] Streaming request completed",{id:e,method:n.metadata.method??"unknown",durationMs:i}),n.resolve(f(t.data))}else if(t.type==="error"){let i=Date.now()-n.metadata.createdAt;clearTimeout(n.timeout),this.pendingRequests.delete(e),console.error("[MessageProcessor] Streaming request failed",{id:e,method:n.metadata.method??"unknown",durationMs:i,message:t.error?.message??"Unknown error"}),n.reject(this.hydrateBackendError(new Error(t.error?.message||"Unknown error"),f(t.error?.data)))}}hydrateBackendError(t,e){if(!e||typeof e!="object")return t;let n=e;return typeof n.name=="string"&&n.name&&(t.name=n.name),(typeof n.code=="number"||typeof n.code=="string")&&(t.code=n.code),typeof n.stack=="string"&&(t.backendStack=n.stack),n.reportedToSentry===!0&&(t.reportedToSentry=!0),t}normalizeResponseId(t,e){if(typeof t=="string")return t;if(typeof t=="number"&&Number.isFinite(t)){let n=String(t);return console.warn("[MessageProcessor] Received numeric response ID, normalizing to string",{id:t,normalizedId:n,type:e}),n}return e==="complete"||e==="error"?console.error("[MessageProcessor] Dropping stream completion response with invalid ID",{id:t,idType:typeof t,type:e}):A()&&console.warn("[MessageProcessor] Dropping response with invalid ID",{id:t,idType:typeof t,type:e}),null}clearAllPending(t,e="unspecified"){let n=Array.from(this.pendingRequests.keys());n.length>0&&console.warn("[MessageProcessor] Clearing pending IPC requests",{reason:e,count:n.length,pendingIds:n.slice(0,20)}),this.pendingRequests.forEach(i=>{clearTimeout(i.timeout),i.reject(t)}),this.pendingRequests.clear(),this.lastClearPendingReason=e,this.lastClearPendingAt=Date.now()}registerNotificationHandler(t,e){this.notificationHandlers.has(t)||this.notificationHandlers.set(t,new Set),this.notificationHandlers.get(t).add(e);let n=this.notificationQueue.get(t);return n&&n.length>0&&(console.log(`[MessageProcessor] Replaying ${n.length} queued notification(s) for ${t}`),n.forEach(i=>{e(i.params)}),this.notificationQueue.delete(t)),()=>{this.notificationHandlers.get(t)?.delete(e)}}handleNotification(t){let e=this.notificationHandlers.get(t.method);if(e&&e.size>0)console.log(`[MessageProcessor] Handling notification: ${t.method} (${e.size} handler(s))`),e.forEach(n=>n(t.params));else{this.notificationQueue.has(t.method)||this.notificationQueue.set(t.method,[]);let n=this.notificationQueue.get(t.method);t.method.includes(".userChanged")||t.method.includes(".stateChanged")||t.method.includes(".updated")?(n.length=0,n.push(t),console.log(`[MessageProcessor] Queued state notification: ${t.method} (replaced previous). Will replay when handler is registered.`)):(n.length>=this.MAX_QUEUE_SIZE&&n.shift(),n.push(t),console.log(`[MessageProcessor] Queued notification: ${t.method} (queue size: ${n.length}). Will replay when handler is registered.`))}}};var G=class{constructor(){this.pendingRequests=new Map;this.messageCounter=0;window.addEventListener("message",this.handleMessage.bind(this))}async request(t,e){let n=`${++this.messageCounter}`;return new Promise((i,a)=>{this.pendingRequests.set(n,{resolve:i,reject:a});let s={id:n,method:t,params:e};window.webkit?.messageHandlers?.["glaze-ipc"]?(window.webkit.messageHandlers["glaze-ipc"].postMessage(s),setTimeout(()=>{this.pendingRequests.has(n)&&(this.pendingRequests.delete(n),a(new Error(`Request timeout: ${t}`)))},5e3)):(this.pendingRequests.delete(n),a(new Error("WebKit message handler not available")))})}handleMessage(t){let e=t.data;if(!e.id)return;let n=this.pendingRequests.get(e.id);n&&(this.pendingRequests.delete(e.id),e.error?n.reject(new Error(e.error)):n.resolve(e.result))}},K=new G;var pe="glaze.transport.cancelStream";var Oe="glaze.ipc.connect",_e="glaze.ipc.disconnect",ze="glaze.ipc.message",Be="Menu:popup",x={structuredCloneV1:!0},J=class extends Error{constructor(){super("Native IPC disconnected");this.isIpcTransportFailure=!0;this.name="NativeBridgeDisconnectedError"}},Fe=r=>r instanceof Error?r.message||r.name||"transport failure":String(r),De=r=>{if(!(r instanceof Error))return!1;let t=r.message.trim().replace(/^(?:Error:\s*)+/i,"");return t===`Unknown method: ${y}`||t===`No handler registered for '${y}'`};function Y(r,t=new WeakMap){if(!r||typeof r!="object")return r;let e=t.get(r);if(e!==void 0)return e;if(Array.isArray(r)){let a=new Array(r.length);t.set(r,a);for(let s=0;s<r.length;s+=1)Object.prototype.hasOwnProperty.call(r,s)&&(a[s]=Y(r[s],t));return a}let n=Object.getPrototypeOf(r);if(n!==Object.prototype&&n!==null)return r;let i=Object.create(n);t.set(r,i);for(let[a,s]of Object.entries(r))s!==void 0&&Object.defineProperty(i,a,{value:Y(s,t),enumerable:!0,configurable:!0,writable:!0});return i}var U=()=>typeof window<"u"&&window.__GLAZE_IPC_TRACE__===!0||typeof process<"u"&&process?.env?.GLAZE_IPC_TRACE==="1",w=class{constructor(){this.messageProcessor=new M;this.connected=!1;this.connectPromise=null;this.clientId=this.createClientId();this.webViewId=this.getWebViewId();this.listenerAttached=!1;this.hostEnvelopeSupport=null;this.hostCapabilityProbe=null;this.activeStreamCleanup=new Map;this.connectionEpoch=0;this.handleMessage=t=>{let e=t.data;!e||e.jsonrpc!=="2.0"||this.handleIncomingMessage(e)};this.attachListener(),this.attachDirectReceiver()}async connect(t){if(!this.connected){if(this.connectPromise)return this.connectPromise;this.connectPromise=(async()=>{this.attachListener(),await K.request(Oe,{clientId:this.clientId,webViewId:this.webViewId}),this.connected=!0,this.connectionEpoch+=1,this.hostEnvelopeSupport=null,this.hostCapabilityProbe=null,this.ensureHostCapabilityProbe(),U()&&console.log("[NativeIPC] Connected to native bridge",{clientId:this.clientId,webViewId:this.webViewId})})();try{await this.connectPromise}finally{this.connectPromise&&(this.connectPromise=null)}}}disconnect(){if(this.connected){for(let t of this.activeStreamCleanup.keys())this.postStreamCancellation(t);this.connected=!1,this.hostEnvelopeSupport=null,this.hostCapabilityProbe=null,this.messageProcessor.clearAllPending(new J,"native-bridge-disconnect"),this.detachListener(),K.request(_e,{clientId:this.clientId}).catch(t=>{console.error("[NativeIPC] Disconnect failed:",t)})}}isConnected(){return this.connected}async sendMessage(t,e,n,i){if(!this.connected)throw new Error("Native IPC not connected");let a=await this.encodeOutboundParams(e,t),s=this.messageProcessor.createRequest(t,a,{...i?.kind?{ipcKind:i.kind}:{},transport:x});return new Promise((c,o)=>{this.messageProcessor.registerPendingRequest(s.id,c,o,n,t,i?.kind),U()&&console.log("[IPCTrace] Native send",{id:s.id,method:t}),this.postRequest(s)})}async sendStreamingMessage(t,e,n,i){if(!this.connected)throw new Error("Native IPC not connected");if(i?.signal?.aborted)throw i.signal.reason;let a=await this.encodeOutboundParams(e,t);if(i?.signal?.aborted)throw i.signal.reason;let s=this.messageProcessor.createRequest(t,a,{ipcKind:"stream",transport:x}),c=()=>this.postStreamCancellation(s.id);i?.signal?.addEventListener("abort",c,{once:!0}),this.activeStreamCleanup.set(s.id,()=>i?.signal?.removeEventListener("abort",c));try{return await new Promise((o,d)=>{this.messageProcessor.registerStreamingRequest(s.id,n,o,d,void 0,t),U()&&console.log("[IPCTrace] Native stream send",{id:s.id,method:t}),this.postRequest(s)})}finally{this.activeStreamCleanup.get(s.id)?.(),this.activeStreamCleanup.delete(s.id)}}postStreamCancellation(t){try{let e={requestId:t},n=this.messageProcessor.createRequest(pe,e,{ipcKind:"send",transport:x});this.postRequest(n)}catch(e){console.error("[NativeIPC] Failed to cancel stream:",e)}}onNotification(t,e){return this.messageProcessor.registerNotificationHandler(t,e)}async encodeOutboundParams(t,e){let n=e===Be?Y(t):t;if(!le(n))return n;let i=C(n,"params");if(this.hostEnvelopeSupport===!0)return i;if(this.hostEnvelopeSupport===!1)throw this.createHostEnvelopeUnsupportedError(e);let a=await this.ensureHostCapabilityProbe();switch(a.status){case"supported":return i;case"unsupported":throw this.createHostEnvelopeUnsupportedError(e);case"indeterminate":throw this.createHostCapabilityUnknownError(e,a.reason)}}ensureHostCapabilityProbe(){if(this.hostEnvelopeSupport!==null){let t=this.hostEnvelopeSupport?{status:"supported"}:{status:"unsupported"};return Promise.resolve(t)}return this.hostCapabilityProbe||(this.hostCapabilityProbe=this.probeHostCapabilities()),this.hostCapabilityProbe}async probeHostCapabilities(){let t=this.connectionEpoch;try{let e=this.messageProcessor.createRequest(y,void 0,{ipcKind:"invoke",transport:x}),n=await new Promise((a,s)=>{this.messageProcessor.registerPendingRequest(e.id,a,s,5e3,y),this.postRequest(e)}),i=!!n&&typeof n=="object"&&n.structuredCloneV1===!0;return t===this.connectionEpoch&&(this.hostEnvelopeSupport=i),i?{status:"supported"}:{status:"unsupported"}}catch(e){return ue(e)||!De(e)?{status:"indeterminate",reason:Fe(e)}:(t===this.connectionEpoch&&(this.hostEnvelopeSupport=!1),{status:"unsupported"})}finally{t===this.connectionEpoch&&(this.hostCapabilityProbe=null)}}createHostEnvelopeUnsupportedError(t){return new Error(`This Glaze host does not support rich IPC values (Date, Map/Set, typed arrays, bigint, undefined, cyclic references, \u2026) required by \`${t}\`. The host answered the \`${y}\` capability handshake without advertising structured-clone support, so it predates the transport envelope. Update the host, or pass only plain JSON-serializable values over this channel.`)}createHostCapabilityUnknownError(t,e){return new Error(`Could not confirm whether this Glaze host can decode rich IPC values (Date, Map/Set, typed arrays, bigint, \u2026) required by \`${t}\`: the \`${y}\` capability probe did not complete (${e}). This is not a confirmed version mismatch \u2014 the IPC channel may be degraded (e.g. after the WebView slept) and the next rich-value send will re-probe. Retry, or pass only plain JSON-serializable values over this channel.`)}postRequest(t){this.postMessage({clientId:this.clientId,webViewId:this.webViewId,message:JSON.stringify(t),requestId:t.id})}postMessage(t){if(!window.webkit?.messageHandlers?.["glaze-ipc"])throw new Error("WebKit message handler not available");window.webkit.messageHandlers["glaze-ipc"].postMessage({id:t.requestId,method:ze,params:t})}attachListener(){this.listenerAttached||(window.addEventListener("message",this.handleMessage),this.listenerAttached=!0)}detachListener(){this.listenerAttached&&(window.removeEventListener("message",this.handleMessage),this.listenerAttached=!1)}attachDirectReceiver(){if(typeof window>"u")return;let t=window;t.__glazeReceiveIPCMessageJSON=e=>{try{let n=JSON.parse(e);this.handleIncomingMessage(n)}catch(n){console.error("[NativeIPC] Failed to parse direct JSON message",n)}},t.__glazeReceiveIPCMessageObject=e=>{this.handleIncomingMessage(e)}}handleIncomingMessage(t){U()&&console.log("[IPCTrace] Native recv",{id:t.id,type:t.type,hasError:!!t.error}),this.messageProcessor.handleResponseObject(t)}createClientId(){let t=this.getWebViewId()??"webview",e=typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():Math.random().toString(16).slice(2);return`${t}-${e}`}getWebViewId(){if(!(typeof window>"u"))return window.identifier}};var O=class{constructor(){this.emitterEvents=new Map;this.warnedEvents=new Set;this.maxListeners=10}on(t,e){return this.addListener(t,e)}addListener(t,e){return this.assertListener(e),this.emitNewListener(t,e),this.addEntry(t,{listener:e,once:!1},!1),this}once(t,e){this.assertListener(e);let n=(...i)=>{this.removeListener(t,n),e.apply(this,i)};return n.listener=e,this.emitNewListener(t,e),this.addEntry(t,{listener:n,original:e,once:!0},!1),this}prependListener(t,e){return this.assertListener(e),this.emitNewListener(t,e),this.addEntry(t,{listener:e,once:!1},!0),this}prependOnceListener(t,e){this.assertListener(e);let n=(...i)=>{this.removeListener(t,n),e.apply(this,i)};return n.listener=e,this.emitNewListener(t,e),this.addEntry(t,{listener:n,original:e,once:!0},!0),this}off(t,e){return this.removeListener(t,e)}removeListener(t,e){this.assertListener(e);let n=this.emitterEvents.get(t);if(!n)return this;for(let i=n.length-1;i>=0;i-=1){let a=n[i];if(a.listener===e||a.original===e){n.splice(i,1),n.length===0&&(this.emitterEvents.delete(t),this.warnedEvents.delete(t)),this.emitRemoveListener(t,a.original??a.listener);break}}return this}removeAllListeners(t){if(t===void 0){for(let n of this.eventNames())this.removeAllListeners(n);return this}let e=this.emitterEvents.get(t);if(!e)return this;for(let n=e.length-1;n>=0;n-=1){let i=e[n];e.splice(n,1),e.length===0&&(this.emitterEvents.delete(t),this.warnedEvents.delete(t)),this.emitRemoveListener(t,i.original??i.listener)}return this}emit(t,...e){let n=this.emitterEvents.get(t);if(!n||n.length===0){if(t==="error"){let i=e[0];throw i instanceof Error?i:new Error(`Unhandled error.${i===void 0?"":` (${String(i)})`}`)}return!1}for(let i of[...n])i.listener.apply(this,e);return!0}listeners(t){return(this.emitterEvents.get(t)??[]).map(e=>e.original??e.listener)}rawListeners(t){return(this.emitterEvents.get(t)??[]).map(e=>e.listener)}listenerCount(t,e){let n=this.emitterEvents.get(t)??[];return e==null?n.length:typeof e!="function"?0:n.filter(i=>i.listener===e||i.original===e).length}eventNames(){return[...this.emitterEvents.keys()]}setMaxListeners(t){if(typeof t!="number"){let e=new TypeError(`The "setMaxListeners" argument must be of type number. Received ${this.formatReceived(t)}`);throw e.code="ERR_INVALID_ARG_TYPE",e}if(Number.isNaN(t)||t<0){let e=new RangeError(`The value of "setMaxListeners" is out of range. It must be >= 0. Received ${t}`);throw e.code="ERR_OUT_OF_RANGE",e}return this.maxListeners=t,this}getMaxListeners(){return this.maxListeners}addEntry(t,e,n){let i=this.emitterEvents.get(t)??[];n?i.unshift(e):i.push(e),this.emitterEvents.set(t,i),this.maybeEmitMaxListenersWarning(t,i.length)}assertListener(t){if(typeof t!="function"){let e=new TypeError(`The "listener" argument must be of type function. Received ${this.formatReceived(t)}`);throw e.code="ERR_INVALID_ARG_TYPE",e}}emitNewListener(t,e){this.emit("newListener",t,e)}emitRemoveListener(t,e){this.emit("removeListener",t,e)}maybeEmitMaxListenersWarning(t,e){if(this.maxListeners===0||e<=this.maxListeners||this.warnedEvents.has(t))return;this.warnedEvents.add(t);let n=this.constructor.name||"EventEmitter",i=new Error(`Possible EventEmitter memory leak detected. ${e} ${String(t)} listeners added to [${n}]. MaxListeners is ${this.maxListeners}. Use emitter.setMaxListeners() to increase limit`);i.name="MaxListenersExceededWarning",i.emitter=this,i.type=t,i.count=e;let a=globalThis.process;typeof a?.emitWarning=="function"?a.emitWarning(i):console.warn(i)}formatReceived(t){return t===null?"null":t===void 0?"undefined":typeof t=="string"?`type string ('${t}')`:typeof t=="number"?`type number (${t})`:typeof t=="boolean"?`type boolean (${t})`:`type ${typeof t}`}};var ge="__glazeIpcTransferPayloadV1",E="__glaze:message-port";function me(r,t){return{[ge]:!0,args:r,ports:t}}function Q(r){if(!r||typeof r!="object"||Array.isArray(r))return!1;let t=r;return t[ge]===!0&&Array.isArray(t.args)&&Array.isArray(t.ports)&&t.ports.every(Z)}function Z(r){return r!==null&&typeof r=="object"&&typeof r.id=="string"}var Ve=Symbol.for("glaze.ipcRendererBridgeValue"),fe="Something went wrong. Please try again.",qe="IPC method called after context was released",je=/\b[a-z][a-z0-9_.-]*:[a-z0-9_.:-]+\b/i,We=/\b(ipc|channel|method)\b/i,$e=[{kind:"unknown_method",pattern:/^Unknown method:/i},{kind:"request_timeout",pattern:/^Request timeout:/i},{kind:"backend_not_connected",pattern:/^IPC backend not connected$/i},{kind:"native_not_connected",pattern:/^Native IPC not connected$/i},{kind:"native_disconnected",pattern:/^Native IPC disconnected$/i},{kind:"webkit_handler_missing",pattern:/^WebKit message handler not available$/i},{kind:"invalid_message_format",pattern:/^Invalid message format$/i},{kind:"native_bridge_unavailable",pattern:/^Glaze ipcRenderer requires native bridge/i}],X=class extends O{constructor(){super();this.listenerChannels=new Set;this.listenerUnsubscribers=new Map;this.isInitialized=!1;this.initPromise=null;this.contextReleased=!1;this.dispatchQueue=Promise.resolve();this.messagePortControlUnsubscribe=null;this.transferredRendererPorts=new Map;this.rendererTransferredMessagePorts=new WeakSet;this.nextRendererTransferredPortId=0;this.streamCancellationControllers=new Map;Object.defineProperty(this,Ve,{value:!0,enumerable:!1,configurable:!1,writable:!1}),this.transport=new w,this.setupMessageHandling(),this.registerMessagePortControlListener(),this.setupContextReleaseHandling()}send(e,...n){this.assertContextActive(),this.assertChannel(e),H(n),this.enqueueTransportDispatch(()=>this.transport.sendMessage(e,n,void 0,{kind:"send"})).catch(i=>{console.error(`[ipcRenderer] Failed to send on channel '${e}':`,i)})}enqueueTransportDispatch(e){let n,i=this.dispatchQueue.then(async()=>{await this.ensureConnected();try{n=e()}catch(a){n=Promise.reject(a)}});return this.dispatchQueue=i.catch(()=>{}),i.then(()=>{if(!n)throw new Error("IPC dispatch did not start");return n})}postMessage(e,n,i){if(this.assertContextActive(),arguments.length<2)throw new Error("Insufficient number of arguments");this.assertChannel(e);let a=this.validatePostMessageTransferList(i);if(S(n),a.length===0){this.send(e,n);return}let s=me([n],a.map(c=>this.createRendererTransferredMessagePortDescriptor(c)));this.enqueueTransportDispatch(()=>this.transport.sendMessage(e,[s],void 0,{kind:"send"})).catch(c=>{console.error(`[ipcRenderer] Failed to postMessage on channel '${e}':`,c)})}async invoke(e,...n){this.assertContextActive(),this.assertChannel(e),H(n);try{return await this.enqueueTransportDispatch(()=>this.transport.sendMessage(e,n,6e5,{kind:"invoke"}))}catch(i){throw this.createUserSafeIpcError("invoke",e,i)}}sendSync(e,...n){throw this.assertContextActive(),this.assertChannel(e),console.warn("[ipcRenderer] sendSync() is deprecated and not recommended. Use invoke() instead."),new Error("sendSync is not supported in Glaze. Use invoke() for async communication.")}on(e,n){return super.on(e,n),this.registerIPCListenerChannel(e),this.ensureConnected().catch(i=>{console.error(`[ipcRenderer] Failed to connect for listener on channel '${String(e)}':`,i)}),this}once(e,n){return super.once(e,n),this.registerIPCListenerChannel(e),this.ensureConnected().catch(i=>{console.error(`[ipcRenderer] Failed to connect for listener on channel '${String(e)}':`,i)}),this}addListener(e,n){return super.addListener(e,n),this.registerIPCListenerChannel(e),this.ensureConnected().catch(i=>{console.error(`[ipcRenderer] Failed to connect for listener on channel '${String(e)}':`,i)}),this}prependListener(e,n){return super.prependListener(e,n),this.registerIPCListenerChannel(e),this.ensureConnected().catch(i=>{console.error(`[ipcRenderer] Failed to connect for listener on channel '${String(e)}':`,i)}),this}prependOnceListener(e,n){return super.prependOnceListener(e,n),this.registerIPCListenerChannel(e),this.ensureConnected().catch(i=>{console.error(`[ipcRenderer] Failed to connect for listener on channel '${String(e)}':`,i)}),this}off(e,n){return this.removeListener(e,n)}removeListener(e,n){return super.removeListener(e,n),this.unregisterIPCListenerChannelIfEmpty(e),this}removeAllListeners(e){return e===void 0?(super.removeAllListeners(),this.listenerChannels.clear(),this.unregisterAllNotificationListeners()):typeof e=="string"?(super.removeAllListeners(e),this.listenerChannels.delete(e),this.unregisterNotificationListener(e)):super.removeAllListeners(e),this}async stream(e,n,i,a){this.assertContextActive(),this.assertChannel(e),S(n);let s=a?.cancellationId;if(s!==void 0&&(this.assertCancellationId(s),this.streamCancellationControllers.has(s)))throw new Error(`An IPC stream already uses cancellation id '${s}'`);let c=s?new AbortController:void 0,o=()=>c?.abort(a?.signal?.reason);c&&s&&(this.streamCancellationControllers.set(s,c),a?.signal?.aborted?o():a?.signal?.addEventListener("abort",o,{once:!0}));try{return await this.enqueueTransportDispatch(()=>this.transport.sendStreamingMessage(e,n,l=>{i(l)},{signal:c?.signal??a?.signal}))}catch(d){throw this.createUserSafeIpcError("stream",e,d)}finally{a?.signal?.removeEventListener("abort",o),s&&this.streamCancellationControllers.get(s)===c&&this.streamCancellationControllers.delete(s)}}cancelStream(e){this.assertContextActive(),this.assertCancellationId(e),this.streamCancellationControllers.get(e)?.abort(new DOMException("The IPC stream was cancelled.","AbortError"))}async _wireToClient(e){e&&(this.unregisterAllNotificationListeners(),this.unregisterMessagePortControlListener(),this.transport=e,this.registerAllNotificationListeners(),this.registerMessagePortControlListener()),await this.connect(),console.log("[ipcRenderer] Wired to transport")}async connect(){if(!(this.isInitialized&&this.transport.isConnected())){if(this.initPromise){if(await this.initPromise,this.transport.isConnected())return;this.initPromise=null,this.isInitialized=!1}return this.initPromise=(async()=>{if(!this.isGlazeApp())throw new Error("Glaze ipcRenderer requires native bridge (Glaze app context)");this.transport instanceof w||(this.unregisterMessagePortControlListener(),this.transport.disconnect(),this.transport=new w,this.registerMessagePortControlListener()),this.registerMessagePortControlListener(),console.log("[ipcRenderer] Connecting via native bridge (stdio transport)"),await this.transport.connect("native"),this.isInitialized=!0})(),this.initPromise}}async ensureConnected(){(!this.isInitialized||!this.transport.isConnected())&&await this.connect()}setupMessageHandling(){this.registerAllNotificationListeners()}registerAllNotificationListeners(){for(let e of this.listenerChannels)this.registerNotificationListener(e)}registerNotificationListener(e){if(this.listenerUnsubscribers.has(e))return;let n=this.transport.onNotification(e,i=>{this.dispatchNotification(e,i)});this.listenerUnsubscribers.set(e,n)}unregisterNotificationListener(e){this.listenerUnsubscribers.get(e)?.(),this.listenerUnsubscribers.delete(e)}unregisterAllNotificationListeners(){for(let e of this.listenerUnsubscribers.values())e();this.listenerUnsubscribers.clear()}dispatchNotification(e,n){if(this.listenerCount(e)===0)return;let{args:i,ports:a}=this.unpackNotificationPayload(n),s={sender:this,ports:a,channel:e};this.emit(e,s,...i)}unpackNotificationPayload(e){let n=Q(e)?e:Array.isArray(e)&&e.length===1&&Q(e[0])?e[0]:null;return n?{args:n.args,ports:n.ports.map(i=>this.createTransferredRendererPort(i))}:{args:Array.isArray(e)?e:e==null?[]:[e],ports:[]}}createTransferredRendererPort(e){if(typeof MessageChannel>"u")throw new Error("MessagePort transfer requires MessageChannel support");let n=new MessageChannel,i=n.port1,a=o=>{s.closed||this.send(E,{type:"message",portId:e.id,data:o.data,...this.createRendererTransferredMessagePortsControlPayload(o.ports)})},s={bridgePort:n.port2,closed:!1,removeBridgeMessageListener:()=>{n.port2.removeEventListener("message",a)},userPort:i};s.bridgePort.addEventListener("message",a),s.bridgePort.start();let c=i.close.bind(i);return i.close=()=>{s.closed||(s.closed=!0,this.send(E,{type:"close",portId:e.id}),this.transferredRendererPorts.delete(e.id),s.removeBridgeMessageListener(),s.bridgePort.close()),c()},this.transferredRendererPorts.set(e.id,s),i}validatePostMessageTransferList(e){if(e===void 0)return[];if(!Array.isArray(e))throw new TypeError("Invalid value for transfer");if(!e.every(i=>typeof MessagePort<"u"&&i instanceof MessagePort))throw new TypeError("Invalid value for transfer");let n=new Set;for(let i of e){if(n.has(i)||this.rendererTransferredMessagePorts.has(i))throw new TypeError("Invalid value for transfer");n.add(i)}return e}createRendererTransferredMessagePortDescriptor(e){let n=`renderer-port-${++this.nextRendererTransferredPortId}`,i=c=>{a.closed||this.send(E,{type:"message",portId:n,data:c.data,...this.createRendererTransferredMessagePortsControlPayload(c.ports)})},a={bridgePort:e,closed:!1,removeBridgeMessageListener:()=>{e.removeEventListener("message",i)}};this.rendererTransferredMessagePorts.add(e),e.addEventListener("message",i),e.start();let s=e.close.bind(e);return e.close=()=>{a.closed||(a.closed=!0,this.send(E,{type:"close",portId:n}),this.transferredRendererPorts.delete(n),a.removeBridgeMessageListener()),s()},this.transferredRendererPorts.set(n,a),{id:n}}registerMessagePortControlListener(){this.messagePortControlUnsubscribe||(this.messagePortControlUnsubscribe=this.transport.onNotification(E,e=>{this.dispatchMessagePortControl(e)}))}unregisterMessagePortControlListener(){this.messagePortControlUnsubscribe?.(),this.messagePortControlUnsubscribe=null}dispatchMessagePortControl(e){let n=this.normalizeMessagePortControlMessage(e);if(!n)return;let i=this.transferredRendererPorts.get(n.portId);if(!(!i||i.closed)){if(n.type==="message"){let a=(n.ports??[]).map(s=>this.createTransferredRendererPort(s));i.bridgePort.postMessage(n.data,a);return}i.closed=!0,this.transferredRendererPorts.delete(n.portId),i.removeBridgeMessageListener(),i.bridgePort.close(),i.userPort?.close()}}normalizeMessagePortControlMessage(e){let n=Array.isArray(e)&&e.length===1?e[0]:e;if(!n||typeof n!="object")return null;let i=n;return i.type!=="message"&&i.type!=="close"||typeof i.portId!="string"||i.type==="message"&&i.ports!==void 0&&(!Array.isArray(i.ports)||!i.ports.every(Z))?null:i}createRendererTransferredMessagePortsControlPayload(e){return!e||e.length===0?{}:{ports:Array.from(e,n=>this.createRendererTransferredMessagePortDescriptor(n))}}closeTransferredRendererPorts(){for(let e of this.transferredRendererPorts.values())e.closed=!0,e.removeBridgeMessageListener(),e.bridgePort.close(),e.userPort?.close();this.transferredRendererPorts.clear()}registerIPCListenerChannel(e){typeof e=="string"&&(this.listenerChannels.add(e),this.registerNotificationListener(e))}unregisterIPCListenerChannelIfEmpty(e){typeof e=="string"&&this.listenerCount(e)===0&&(this.listenerChannels.delete(e),this.unregisterNotificationListener(e))}assertChannel(e){if(typeof e!="string")throw new TypeError("Error processing argument at index 0, conversion failure")}assertCancellationId(e){if(typeof e!="string"||e.length===0||e.length>200)throw new TypeError("IPC stream cancellation id must be a non-empty string of at most 200 characters")}assertContextActive(){if(this.contextReleased)throw new Error(qe)}setupContextReleaseHandling(){typeof window>"u"||window.addEventListener("pagehide",e=>{e.persisted!==!0&&this.markContextReleased()})}markContextReleased(){this.contextReleased||(this.contextReleased=!0,this.unregisterAllNotificationListeners(),this.unregisterMessagePortControlListener(),this.closeTransferredRendererPorts(),this.transport.disconnect(),this.isInitialized=!1,this.initPromise=null)}isGlazeApp(){return!!(typeof window<"u"&&window.__GLAZE_APP__||typeof window<"u"&&window.webkit?.messageHandlers?.["glaze-ipc"]||typeof window<"u"&&window.location?.protocol==="glaze:")}isConnected(){return this.transport.isConnected()}async waitForReady(){this.assertContextActive(),await this.ensureConnected()}disconnect(){this.unregisterMessagePortControlListener(),this.closeTransferredRendererPorts(),this.transport.disconnect(),this.isInitialized=!1,this.initPromise=null}onNotification(e,n){return this.assertContextActive(),this.transport.onNotification(e,n)}_markContextReleasedForTesting(){this.markContextReleased()}_resetContextReleasedForTesting(){this.contextReleased=!1}createUserSafeIpcError(e,n,i){let a=i instanceof Error?i.message:String(i),s=i&&typeof i=="object"?i:void 0,c=typeof s?.backendStack=="string",o=this.classifyIpcFailure(a),l=(typeof s?.ipcFailureKind=="string"?s.ipcFailureKind:void 0)??(e==="invoke"&&c?void 0:o),u=e==="invoke"&&!l?this.createElectronInvokeErrorMessage(n,a):typeof s?.ipcSanitizedMessage=="string"?s.ipcSanitizedMessage:this.sanitizeErrorMessage(a,l);console.error(`[ipcRenderer] ${e} failed`,{channel:n,rawErrorMessage:a,error:i});let p=new Error(u);return p.ipcOperation=s?.ipcOperation==="send"||s?.ipcOperation==="invoke"||s?.ipcOperation==="stream"?s.ipcOperation:e,p.ipcChannel=typeof s?.ipcChannel=="string"?s.ipcChannel:n,p.ipcRawMessage=typeof s?.ipcRawMessage=="string"?s.ipcRawMessage:a,p.ipcSanitizedMessage=u,l&&(p.ipcFailureKind=l),typeof s?.ipcTimeoutMs=="number"&&(p.ipcTimeoutMs=s.ipcTimeoutMs),typeof s?.ipcAgeMs=="number"&&(p.ipcAgeMs=s.ipcAgeMs),s&&(typeof s.name=="string"&&s.name&&(p.name=s.name),(typeof s.code=="number"||typeof s.code=="string")&&(p.code=s.code),typeof s.backendStack=="string"&&(p.backendStack=s.backendStack),s.reportedToSentry===!0&&(p.reportedToSentry=!0)),p}stripLegacyIpcErrorPrefix(e){return e.trim().replace(/^IPC invoke error on\s+'[^']+':\s*/i,"")}classifyIpcFailure(e){let n=e.trim(),i=this.stripLegacyIpcErrorPrefix(e);if(!i)return"empty_message";let a=$e.find(({pattern:s})=>s.test(i)||s.test(n));if(a)return a.kind;if(We.test(n)&&je.test(n))return"ipc_internal"}sanitizeErrorMessage(e,n){let i=this.stripLegacyIpcErrorPrefix(e);return!i||n?fe:i}createElectronInvokeErrorMessage(e,n){return`Error invoking remote method '${e}': ${this.stripLegacyIpcErrorPrefix(n)||"Error"}`}},_=new X;var he=new Set(["constructor","prototype"]),He=Symbol.for("glaze.pageWorldFunctionSource"),Ge=Symbol.for("glaze.ipcRendererBridgeValue"),Ke=String.raw`
() => {
  const TRANSPORT_ENVELOPE_KEY = "__glazeIPCStructuredCloneV1";
  const TYPED_ARRAY_CONSTRUCTORS = {
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array,
  };

  const createCloneError = () => new Error("An object could not be cloned.");
  const encodeNumber = (value) => Object.is(value, -0) ? "-0" : String(value);
  const decodeNumber = (value) => value === "-0" ? -0 : Number(value);
  const encodeBytes = (bytes) => {
    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]);
    }
    return btoa(binary);
  };
  const decodeBytes = (value) => {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  };
  const toStandaloneArrayBuffer = (bytes) => {
    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);
    return buffer;
  };
  const isPlainObject = (value) => {
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  };
  const createEncodeState = () => ({ references: new WeakMap(), nextId: 1 });
  const createDecodeState = () => ({ references: new Map() });
  const getOrCreateReferenceId = (value, state) => {
    const existingId = state.references.get(value);
    if (existingId !== undefined) {
      return { id: existingId, alreadyEncoded: true };
    }
    const id = state.nextId;
    state.nextId += 1;
    state.references.set(value, id);
    return { id, alreadyEncoded: false };
  };
  const rememberDecodedReference = (id, value, state) => {
    if (typeof id === "number") {
      state.references.set(id, value);
    }
  };
  const encodeValue = (value, state) => {
    if (value === undefined) return { type: "Undefined" };
    if (value === null) return { type: "Null" };

    switch (typeof value) {
      case "boolean":
        return { type: "Boolean", value };
      case "string":
        return { type: "String", value };
      case "number":
        return { type: "Number", value: encodeNumber(value) };
      case "bigint":
        return { type: "BigInt", value: value.toString() };
      case "function":
      case "symbol":
        throw createCloneError();
      case "object":
        break;
      default:
        throw createCloneError();
    }

    const reference = getOrCreateReferenceId(value, state);
    if (reference.alreadyEncoded) {
      return { type: "Reference", id: reference.id };
    }

    if (Array.isArray(value)) {
      const encodedItems = [];
      for (let index = 0; index < value.length; index += 1) {
        encodedItems.push(Object.prototype.hasOwnProperty.call(value, index) ? encodeValue(value[index], state) : {
          type: "ArrayHole",
        });
      }
      return { type: "Array", id: reference.id, value: encodedItems };
    }
    if (value instanceof Date) {
      return { type: "Date", id: reference.id, value: encodeNumber(value.getTime()) };
    }
    if (value instanceof RegExp) {
      return {
        type: "RegExp",
        id: reference.id,
        source: value.source,
        flags: value.flags,
        lastIndex: encodeNumber(value.lastIndex),
      };
    }
    if (value instanceof Map) {
      return {
        type: "Map",
        id: reference.id,
        value: Array.from(value.entries(), ([key, nestedValue]) => [encodeValue(key, state), encodeValue(nestedValue, state)]),
      };
    }
    if (value instanceof Set) {
      return {
        type: "Set",
        id: reference.id,
        value: Array.from(value.values(), (nestedValue) => encodeValue(nestedValue, state)),
      };
    }
    if (value instanceof ArrayBuffer) {
      return { type: "ArrayBuffer", id: reference.id, value: encodeBytes(new Uint8Array(value)) };
    }
    if (ArrayBuffer.isView(value)) {
      const bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      if (value instanceof DataView) {
        return { type: "DataView", id: reference.id, value: encodeBytes(bytes) };
      }
      const constructorName = value.constructor.name;
      if (!(constructorName in TYPED_ARRAY_CONSTRUCTORS)) {
        throw createCloneError();
      }
      return {
        type: "TypedArray",
        id: reference.id,
        name: constructorName,
        value: encodeBytes(bytes),
      };
    }
    if (value instanceof Error) {
      return {
        type: "Error",
        id: reference.id,
        name: value.name,
        message: value.message,
        ...(typeof value.stack === "string" ? { stack: value.stack } : {}),
      };
    }
    if (!isPlainObject(value)) {
      throw createCloneError();
    }
    return {
      type: "Object",
      id: reference.id,
      value: Object.entries(value).map(([key, nestedValue]) => [key, encodeValue(nestedValue, state)]),
    };
  };
  const decodeValue = (value, state) => {
    switch (value.type) {
      case "Undefined":
        return undefined;
      case "Null":
        return null;
      case "Boolean":
      case "String":
        return value.value;
      case "Number":
        return decodeNumber(value.value);
      case "BigInt":
        return BigInt(value.value);
      case "Reference":
        if (!state.references.has(value.id)) {
          throw new Error("Invalid IPC reference id: " + value.id);
        }
        return state.references.get(value.id);
      case "Array": {
        const array = new Array(value.value.length);
        rememberDecodedReference(value.id, array, state);
        for (let index = 0; index < value.value.length; index += 1) {
          const item = value.value[index];
          if (item.type !== "ArrayHole") {
            array[index] = decodeValue(item, state);
          }
        }
        return array;
      }
      case "ArrayHole":
        return undefined;
      case "Object": {
        const object = {};
        rememberDecodedReference(value.id, object, state);
        for (const [key, nestedValue] of value.value) {
          Object.defineProperty(object, key, {
            value: decodeValue(nestedValue, state),
            writable: true,
            configurable: true,
            enumerable: true,
          });
        }
        return object;
      }
      case "Date": {
        const date = new Date(decodeNumber(value.value));
        rememberDecodedReference(value.id, date, state);
        return date;
      }
      case "RegExp": {
        const regexp = new RegExp(value.source, value.flags);
        regexp.lastIndex = decodeNumber(value.lastIndex);
        rememberDecodedReference(value.id, regexp, state);
        return regexp;
      }
      case "Map": {
        const map = new Map();
        rememberDecodedReference(value.id, map, state);
        for (const [key, nestedValue] of value.value) {
          map.set(decodeValue(key, state), decodeValue(nestedValue, state));
        }
        return map;
      }
      case "Set": {
        const set = new Set();
        rememberDecodedReference(value.id, set, state);
        for (const nestedValue of value.value) {
          set.add(decodeValue(nestedValue, state));
        }
        return set;
      }
      case "ArrayBuffer": {
        const buffer = toStandaloneArrayBuffer(decodeBytes(value.value));
        rememberDecodedReference(value.id, buffer, state);
        return buffer;
      }
      case "TypedArray": {
        const Constructor = TYPED_ARRAY_CONSTRUCTORS[value.name];
        const typedArray = new Constructor(toStandaloneArrayBuffer(decodeBytes(value.value)));
        rememberDecodedReference(value.id, typedArray, state);
        return typedArray;
      }
      case "DataView": {
        const dataView = new DataView(toStandaloneArrayBuffer(decodeBytes(value.value)));
        rememberDecodedReference(value.id, dataView, state);
        return dataView;
      }
      case "Error": {
        const error = new Error(value.message);
        error.name = value.name;
        if (typeof value.stack === "string") {
          error.stack = value.stack;
        }
        rememberDecodedReference(value.id, error, state);
        return error;
      }
    }
  };
  return {
    serialize(value) {
      return { [TRANSPORT_ENVELOPE_KEY]: encodeValue(value, createEncodeState()) };
    },
    deserialize(value) {
      if (!value || typeof value !== "object" || !(TRANSPORT_ENVELOPE_KEY in value)) {
        return value;
      }
      return decodeValue(value[TRANSPORT_ENVELOPE_KEY], createDecodeState());
    },
  };
}
`,ee=class{constructor(){this.exposedKeysByWorld=new Set;this.executeCounter=0;this.fnCounter=0}exposeInMainWorld(t,e){this.exposeInWorld(0,t,e)}exposeInIsolatedWorld(t,e,n){if(!Number.isInteger(t)||t<0)throw new Error("contextBridge: worldId must be a non-negative integer");this.exposeInWorld(t,e,n)}executeInMainWorld(t){if(!t||typeof t!="object"||Array.isArray(t))throw new TypeError("contextBridge.executeInMainWorld expected an execution script object");if(typeof t.func!="function")throw new TypeError("contextBridge.executeInMainWorld expected executionScript.func to be a function");if(t.args!==void 0&&!Array.isArray(t.args))throw new TypeError("contextBridge.executeInMainWorld expected executionScript.args to be an array");let e=Function.prototype.toString.call(t.func);return window.webkit?.messageHandlers?.["glaze-bridge-register"]?this.executeInPageWorld(e,t.args??[]):(0,eval)(`(${e})`)(...t.args??[])}exposeInWorld(t,e,n){if(!e||typeof e!="string")throw new Error("contextBridge: apiKey must be a non-empty string");let i=`${t}:${e}`;if(this.exposedKeysByWorld.has(i))throw new Error(`contextBridge: '${e}' has already been exposed in world ${t}`);let a=window.webkit?.messageHandlers?.["glaze-bridge-register"];if(a){let s=this.buildShape(n);a.postMessage({worldId:t,apiKey:e,shape:s}),this.exposedKeysByWorld.add(i)}else{if(t!==0&&t!==999)throw new Error(`contextBridge: cannot expose '${e}' in isolated world ${t} without native bridge support`);console.warn(`[contextBridge] glaze-bridge-register not available \u2014 exposing '${e}' directly in world ${t} (no context isolation). Run /upgrade in Glaze to apply the preload migration.`),this.exposeDirectly(e,n),this.exposedKeysByWorld.add(i)}}executeInPageWorld(t,e){let n=window.document,i=n?.documentElement;if(!n||!i)throw new Error("contextBridge.executeInMainWorld requires a document in the main world");let a;try{a=JSON.stringify(C(e,"executionScript.args"))}catch(l){throw new TypeError(`contextBridge.executeInMainWorld could not serialize executionScript.args: ${l instanceof Error?l.message:String(l)}`)}let s=`data-glaze-execute-main-world-${Date.now()}-${this.executeCounter++}`,c=n.createElement("script");c.textContent=`
      (() => {
        const resultAttribute = ${JSON.stringify(s)};
        const codec = (${Ke})();
        const finish = (payload) => {
          document.documentElement.setAttribute(resultAttribute, JSON.stringify(payload));
        };
        const finishError = (error) => {
          finish({
            ok: false,
            error: codec.serialize(error instanceof Error ? error : new Error(String(error))),
          });
        };
        try {
          const func = (0, eval)("(" + ${JSON.stringify(t)} + ")");
          const args = codec.deserialize(JSON.parse(${JSON.stringify(a)}));
          const value = func(...args);
          finish({ ok: true, value: codec.serialize(value) });
        } catch (error) {
          finishError(error);
        }
      })();
    `,i.appendChild(c),c.remove();let o=i.getAttribute(s);if(i.removeAttribute(s),!o)throw new Error("contextBridge.executeInMainWorld did not receive a page-world result");let d=JSON.parse(o);if(!d.ok){let l=f(d.error);throw l instanceof Error?l:new Error(String(l??"contextBridge.executeInMainWorld failed"))}return f(d.value)}buildShape(t){if(this.isBlockedBridgeValue(t))return{};if(typeof t=="function"){let n=t[He];if(typeof n=="string")return{type:"page-function",source:n};let i=`fn_${this.fnCounter++}`;return window.__glazePreloadBridge?.register(i,t),{type:"function",id:i}}if(t===null||typeof t!="object"||Array.isArray(t))return{type:"data",value:this.snapshotDataValue(t)};let e={};for(let[n,i]of Object.entries(t))he.has(n)||Object.defineProperty(e,n,{value:this.buildShape(i),writable:!0,configurable:!0,enumerable:!0});return e}exposeDirectly(t,e){let n=this.cloneBridgeValue(e);this.deepFreeze(n),Object.defineProperty(window,t,{value:n,writable:!1,configurable:!1,enumerable:!0})}deepFreeze(t){if(!(t===null||typeof t!="object"||Object.isFrozen(t))){Object.freeze(t);for(let e of Object.values(t))this.deepFreeze(e)}}isBlockedBridgeValue(t){return t!==null&&typeof t=="object"&&t[Ge]===!0}snapshotDataValue(t){return t===null||typeof t!="object"?t:structuredClone(t)}cloneBridgeValue(t,e=new WeakMap){if(this.isBlockedBridgeValue(t))return{};if(t===null||typeof t!="object"||typeof t=="function")return t;let n=t,i=e.get(n);if(i!==void 0)return i;let a=Array.isArray(t)?new Array(t.length):{};e.set(n,a);for(let[s,c]of Object.entries(n))he.has(s)||Object.defineProperty(a,s,{value:this.cloneBridgeValue(c,e),writable:!0,configurable:!0,enumerable:!0});return a}},z=new ee;var Je="data:image/png;base64,";function te(r){return r instanceof Uint8Array?r:new Uint8Array(r)}function B(r){if(!r)return new Uint8Array;let t=globalThis.atob(r),e=new Uint8Array(t.length);for(let n=0;n<t.length;n+=1)e[n]=t.charCodeAt(n);return e}function re(r){let t="";for(let n=0;n<r.length;n+=32768){let i=r.subarray(n,n+32768);t+=String.fromCharCode(...i)}return globalThis.btoa(t)}function h(r,t){if(r.length===0)return null;if(t==null)return r.find(i=>i.scaleFactor===1)??r[0];let e=r[0],n=Math.abs(e.scaleFactor-t);for(let i of r){let a=Math.abs(i.scaleFactor-t);a<n&&(e=i,n=a)}return e}var g=class r{constructor(t,e){this.templateImage=!1;this.representations=t,this.invoke=e}static empty(t){return new r([],t)}static fromSerialized(t,e,n){if(!t||t.isEmpty)return r.empty(n);let i=(t.representations??[]).filter(s=>!!s.dataURL&&Number.isFinite(s.scaleFactor)&&s.scaleFactor>0);if(i.length===0&&t.dataURL&&t.size&&i.push({scaleFactor:e,dataURL:t.dataURL,size:t.size}),i.length===0)return r.empty(n);let a=new r(i,n);return a.templateImage=t.isTemplate??!1,a}isEmpty(){return this.representations.length===0||!this.representations.some(t=>!!t.dataURL)}getSize(t){return h(this.representations,t)?.size??{width:0,height:0}}getAspectRatio(t){let{width:e,height:n}=this.getSize(t);return n?e/n:1}getScaleFactors(){let t=new Set(this.representations.map(e=>e.scaleFactor));return Array.from(t).sort((e,n)=>e-n)}toDataURL(t){return h(this.representations,t?.scaleFactor)?.dataURL??Je}async toPNG(t){let e=h(this.representations,t?.scaleFactor);if(!e?.dataURL)return new Uint8Array;let n=await this.invoke("nativeImage:toPNG",{dataURL:e.dataURL});return B(n)}async toJPEG(t){let e=h(this.representations,1);if(!e?.dataURL)return new Uint8Array;let n=await this.invoke("nativeImage:toJPEG",{dataURL:e.dataURL,quality:t});return B(n)}async toBitmap(t){let e=h(this.representations,t?.scaleFactor);if(!e?.dataURL)return new Uint8Array;let n=await this.invoke("nativeImage:toBitmap",{dataURL:e.dataURL});return B(n)}async getBitmap(t){return this.toBitmap(t)}async getNativeHandle(){let t=h(this.representations,1);if(!t?.dataURL)return new Uint8Array;let e=await this.invoke("nativeImage:getNativeHandle",{dataURL:t.dataURL});return B(e)}setTemplateImage(t){if(arguments.length<1)throw new TypeError("Insufficient number of arguments.");this.isEmpty()||(this.templateImage=!!t)}isTemplateImage(){return this.templateImage}get isMacTemplateImage(){return this.templateImage}set isMacTemplateImage(t){this.isEmpty()||(this.templateImage=!!t)}async crop(t){let e=h(this.representations,1);if(!e?.dataURL)return r.empty(this.invoke);let n=await this.invoke("nativeImage:crop",{dataURL:e.dataURL,rect:t}),i=r.fromSerialized(n,1,this.invoke);return i.templateImage=this.templateImage,i}async resize(t){let e=h(this.representations,1);if(!e?.dataURL)return r.empty(this.invoke);let n=await this.invoke("nativeImage:resize",{dataURL:e.dataURL,width:t.width,height:t.height,quality:t.quality}),i=r.fromSerialized(n,1,this.invoke);return i.templateImage=this.templateImage,i}async addRepresentation(t){let e=t.scaleFactor??1;if(t.dataURL){let n=await this.invoke("nativeImage:createFromDataURL",{dataURL:t.dataURL});n?.dataURL&&(this.representations=[...this.representations.filter(i=>i.scaleFactor!==e),{scaleFactor:e,dataURL:n.dataURL,size:n.size??{width:0,height:0}}]);return}if(t.buffer){let n=te(t.buffer),i=await this.invoke("nativeImage:createFromBuffer",{data:re(n),width:t.width,height:t.height,scaleFactor:e});i?.dataURL&&(this.representations=[...this.representations.filter(a=>a.scaleFactor!==e),{scaleFactor:e,dataURL:i.dataURL,size:i.size??{width:0,height:0}}])}}};function ye(r,t){return r?g.fromSerialized({isEmpty:r.isEmpty??!1,dataURL:r.dataURL??r.data??"",size:r.size??{width:0,height:0},representations:r.representations,isTemplate:r.isTemplate},1,t):g.empty(t)}function Ye(r){return{createEmpty:()=>g.empty(r),createThumbnailFromPath:async(o,d)=>{let l=await r("nativeImage:createThumbnailFromPath",{path:o,size:d});return g.fromSerialized(l,1,r)},createFromPath:async o=>{let d=await r("nativeImage:createFromPath",{path:o});return g.fromSerialized(d,1,r)},createFromBitmap:async(o,d)=>{let l=te(o),u=await r("nativeImage:createFromBitmap",{data:re(l),width:d.width,height:d.height,scaleFactor:d.scaleFactor??1});return g.fromSerialized(u,d.scaleFactor??1,r)},createFromBuffer:async(o,d)=>{let l=te(o),u=await r("nativeImage:createFromBuffer",{data:re(l),width:d?.width,height:d?.height,scaleFactor:d?.scaleFactor??1});return g.fromSerialized(u,d?.scaleFactor??1,r)},createFromDataURL:async o=>{let d=await r("nativeImage:createFromDataURL",{dataURL:o});return g.fromSerialized(d,1,r)},createFromNamedImage:async(o,d)=>{let l=await r("nativeImage:createFromNamedImage",{imageName:o,hslShift:d});return g.fromSerialized(l,1,r)}}}var I={PERMISSION_DENIED:1,POSITION_UNAVAILABLE:2,TIMEOUT:3};function Qe(r){let t=r?.code;if(t===1||t===2||t===3)return t;let n=(r instanceof Error?r.message:String(r)).toLowerCase();return n.includes("denied")||n.includes("restricted")?I.PERMISSION_DENIED:n.includes("timeout")?I.TIMEOUT:I.POSITION_UNAVAILABLE}function Ze(r){let t=r instanceof Error?r.message:String(r);return{code:Qe(r),message:t,PERMISSION_DENIED:I.PERMISSION_DENIED,POSITION_UNAVAILABLE:I.POSITION_UNAVAILABLE,TIMEOUT:I.TIMEOUT}}function Xe(r){let t=n=>r("location:getCurrentPosition",n);return((n,i,a)=>{if(typeof n=="function"){let s=n,c=i;t(a).then(s,o=>{c?.(Ze(o))});return}return t(n)})}var be=Symbol.for("glaze.pageWorldFunctionSource"),Ee=new WeakMap,L=[],T=[],ve=!1;function we(r){return Array.isArray(r)?r.filter(t=>typeof t=="string"&&t.length>0):[]}function et(){if(ve||typeof window>"u")return;ve=!0;let r=n=>{L=we(n.detail?.paths)},t=n=>{T=we(n.detail?.paths)},e=(n,i)=>{let a=Math.min(n.length,i.length);for(let s=0;s<a;s+=1){let c=n[s];c&&Ee.set(c,i[s])}};window.addEventListener("__glaze-drop-committed",r,!0),window.addEventListener("__glaze-native-drop-paths",r,!0),window.addEventListener("__glaze-file-selection-committed",t,!0),window.addEventListener("drop",n=>{let i=n.dataTransfer?.files;if(!i||i.length===0||L.length===0){L=[];return}e(Array.from(i),L),L=[]},!0),window.addEventListener("change",n=>{if(T.length===0)return;let i=n.target,a=i&&typeof i=="object"&&"files"in i?i.files:null;if(!a||a.length===0){T=[];return}e(Array.from(a),T),T=[]},!0)}function tt(r){if(typeof Blob>"u"||!(r instanceof Blob))throw new TypeError("getPathForFile expected to receive a File object but one was not provided");let t=Ee.get(r);if(typeof t=="string")return t;let e=r.path;return typeof e=="string"?e:""}var rt=`function(file) {
  if (typeof Blob === "undefined" || !(file instanceof Blob)) {
    throw new TypeError("getPathForFile expected to receive a File object but one was not provided");
  }

  const mappedPath = window.__glazeGetDroppedFilePath?.(file);
  if (typeof mappedPath === "string") {
    return mappedPath;
  }

  return file && typeof file.path === "string" ? file.path : "";
}`;function nt(r,t){let e=r;return e[be]!==t&&Object.defineProperty(e,be,{value:t,writable:!1,configurable:!1,enumerable:!1}),r}function it(){return et(),{getPathForFile:nt(tt,rt)}}var Ie=!1;function at(){Ie||(Ie=!0,z.exposeInMainWorld("__glazeDisplayMediaBridge",{request:r=>_.invoke("displayMedia:request",r),stop:r=>{_.invoke("displayMedia:stop",r).catch(()=>{})}}),z.executeInMainWorld({func:st}))}function st(){let r=window;if(r.__glazeDisplayMedia)return;let t=navigator.mediaDevices;if(!t)return;let e=()=>r.__glazeDisplayMediaBridge??null,n=new Map;r.__glazeDisplayMedia={onFrame(s,c){let o=n.get(s);if(!o||o.busy||o.stopped||!o.context)return;o.busy=!0;let d=new Image;d.onload=()=>{o.stopped||((o.canvas.width!==d.naturalWidth||o.canvas.height!==d.naturalHeight)&&(o.canvas.width=d.naturalWidth,o.canvas.height=d.naturalHeight),o.context?.drawImage(d,0,0),o.frames+=1,o.busy=!1)},d.onerror=()=>{o.busy=!1},d.src=c},stats(){return{active:n.size,frames:Array.from(n.values()).map(s=>s.frames)}}};let i=typeof t.getDisplayMedia=="function"?t.getDisplayMedia.bind(t):null,a=s=>{if(typeof s=="number"&&Number.isFinite(s))return s;if(s&&typeof s=="object"){let c=s;if(typeof c.ideal=="number"&&Number.isFinite(c.ideal))return c.ideal;if(typeof c.max=="number"&&Number.isFinite(c.max))return c.max}};t.getDisplayMedia=async function(c){let o=c?.video===void 0?!0:c.video;if(o===!1)throw new TypeError("getDisplayMedia requires video to be requested");let d=o&&typeof o=="object"?{maxWidth:a(o.width),maxHeight:a(o.height),frameRate:a(o.frameRate)}:null,l=e(),u=l?await l.request({videoRequested:!0,audioRequested:!!c?.audio,userGesture:!!navigator.userActivation?.isActive,securityOrigin:location.origin,video:d}):null;if(!u||u.handled!==!0){if(i)return i(c);throw new DOMException("getDisplayMedia is not supported","NotSupportedError")}if(!u.granted||!u.token)throw new DOMException(u.error||"Permission denied","NotAllowedError");let p=u.token,P=document.createElement("canvas");P.width=Math.max(1,u.width??1),P.height=Math.max(1,u.height??1);let F={canvas:P,context:P.getContext("2d"),frames:0,busy:!1,stopped:!1};n.set(p,F);let Le=u.frameRate&&u.frameRate>0?u.frameRate:15,ne=P.captureStream(Le),D=()=>{F.stopped||(F.stopped=!0,n.delete(p),e()?.stop(p))};for(let k of ne.getTracks()){let Te=k.stop.bind(k);k.stop=()=>{Te(),D()},k.addEventListener("ended",D)}return window.addEventListener("pagehide",D,{once:!0}),ne}}var ot=new Set(["clipboard","selection","general","find","drag","ruler","font"]);function ct(r){return ArrayBuffer.isView(r)?new Uint8Array(r.buffer,r.byteOffset,r.byteLength):new Uint8Array(r)}function Re(r){return Array.from(ct(r))}function Ce(r){if(r)return Object.fromEntries(Object.entries(r).map(([t,e])=>[t,typeof e=="string"?e:Re(e)]))}function dt(r,t){return ye(t,r)}function lt(r){let t={...r},e=pt(r.image);return e!==void 0?t.image=e:delete t.image,r.custom?t.custom=Ce(r.custom):delete t.custom,t}function ut(r){if(r===null||typeof r=="string")return r;if(r&&typeof r.toDataURL=="function")return r.toDataURL();throw new TypeError("Error processing argument at index 0, conversion failure from ")}function Pe(r){let t=/^data:([^;,]+)?(?:;[^,]*)*;base64,/is.exec(r);if(!t)return!1;let e=(t[1]||"image/png").toLowerCase();return e==="image/png"||e==="image/tiff"}function pt(r){if(r!=null){if(typeof r=="string")return Pe(r)?r:void 0;if(typeof r.toDataURL=="function"){let t=r.toDataURL();return Pe(t)?t:void 0}}}function gt(r,t){return typeof r=="string"?{type:t(r)}:{...r,type:t(r?.type)}}function mt(r,t,e,n){return e<3&&!t&&r&&ot.has(r)?{type:n(r)}:{text:r,type:n(t)}}var ft=Symbol.for("glaze.pageWorldFunctionSource");function ht(r,t){return Object.defineProperty(r,ft,{value:t,writable:!1,configurable:!1,enumerable:!1}),r}function yt(r){return`function(overrideType) {
    var CLIPBOARD_TYPE = ${r===void 0?"undefined":JSON.stringify(r)};
    var bridge = (window.glazeAPI && window.glazeAPI.glaze) || window.glaze;
    var invoke = bridge && bridge.ipc && bridge.ipc.invoke;
    if (typeof invoke !== "function") {
      return Promise.reject(new Error("clipboard.readImage: Glaze IPC bridge is not available"));
    }
    var targetType = overrideType == null ? CLIPBOARD_TYPE : overrideType;
    var EMPTY_DATA_URL = "data:image/png;base64,";
    function base64ToBytes(base64) {
      if (!base64) return new Uint8Array();
      var binary = atob(base64);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }
    function makeImage(dataURL, size, isTemplate) {
      var templateImage = !!isTemplate;
      function getSize() { return { width: (size && size.width) || 0, height: (size && size.height) || 0 }; }
      function bytesVia(channel, payload) {
        if (!dataURL) return Promise.resolve(new Uint8Array());
        return Promise.resolve(invoke(channel, payload)).then(base64ToBytes);
      }
      function fromSerialized(result) {
        if (!result || result.isEmpty || !result.dataURL || !result.size) {
          return makeImage("", { width: 0, height: 0 }, templateImage);
        }
        return makeImage(result.dataURL, result.size, templateImage);
      }
      var image = {
        isEmpty: function() { return !dataURL; },
        getSize: getSize,
        getAspectRatio: function() { var s = getSize(); return s.height ? s.width / s.height : 1; },
        getScaleFactors: function() { return [1]; },
        toDataURL: function() { return dataURL || EMPTY_DATA_URL; },
        toPNG: function() { return bytesVia("nativeImage:toPNG", { dataURL: dataURL }); },
        toJPEG: function(quality) { return bytesVia("nativeImage:toJPEG", { dataURL: dataURL, quality: quality }); },
        toBitmap: function() { return bytesVia("nativeImage:toBitmap", { dataURL: dataURL }); },
        getBitmap: function() { return bytesVia("nativeImage:toBitmap", { dataURL: dataURL }); },
        getNativeHandle: function() { return bytesVia("nativeImage:getNativeHandle", { dataURL: dataURL }); },
        setTemplateImage: function(option) {
          if (arguments.length < 1) throw new TypeError("Insufficient number of arguments.");
          if (!dataURL) return;
          templateImage = !!option;
        },
        isTemplateImage: function() { return templateImage; },
        crop: function(rect) {
          if (!dataURL) return Promise.resolve(makeImage("", { width: 0, height: 0 }, templateImage));
          return Promise.resolve(invoke("nativeImage:crop", { dataURL: dataURL, rect: rect })).then(fromSerialized);
        },
        resize: function(options) {
          if (!dataURL) return Promise.resolve(makeImage("", { width: 0, height: 0 }, templateImage));
          return Promise.resolve(invoke("nativeImage:resize", {
            dataURL: dataURL,
            width: options && options.width,
            height: options && options.height,
            quality: options && options.quality,
          })).then(fromSerialized);
        },
        addRepresentation: function(options) {
          if (options && options.dataURL) {
            return Promise.resolve(invoke("nativeImage:createFromDataURL", { dataURL: options.dataURL })).then(function(result) {
              if (result && result.dataURL) { dataURL = result.dataURL; size = result.size || size; }
            });
          }
          return Promise.resolve();
        }
      };
      Object.defineProperty(image, "isMacTemplateImage", {
        enumerable: true,
        configurable: true,
        get: function() { return templateImage; },
        set: function(value) { if (!dataURL) return; templateImage = !!value; }
      });
      return image;
    }
    return Promise.resolve(invoke("clipboard:readImage", targetType)).then(function(result) {
      if (!result || result.isEmpty || (!result.dataURL && !result.data)) {
        return makeImage("", { width: 0, height: 0 }, false);
      }
      return makeImage(result.dataURL || result.data || "", result.size || { width: 0, height: 0 }, !!result.isTemplate);
    });
  }`}function Ae(r,t){let e=i=>i??t;return{readImage:ht(async i=>dt(r,await r("clipboard:readImage",e(i))),yt(t)),readText:i=>r("clipboard:readText",e(i)),writeText:(i,a)=>r("clipboard:writeText",i,e(a)),readHTML:i=>r("clipboard:readHTML",e(i)),writeHTML(i,a,s){let c=mt(a,s,arguments.length,e);return r("clipboard:writeHTML",i,c.text,c.type)},readRTF:i=>r("clipboard:readRTF",e(i)),writeRTF:(i,a)=>r("clipboard:writeRTF",i,e(a)),writeImage:(i,a)=>r("clipboard:writeImage",ut(i),gt(a,e)),readBookmark:i=>r("clipboard:readBookmark",e(i)),writeBookmark:(i,a,s)=>r("clipboard:writeBookmark",i,a,e(s)),readFindText:()=>r("clipboard:readFindText"),writeFindText:i=>r("clipboard:writeFindText",i),clear:i=>r("clipboard:clear",e(i)),availableFormats:i=>r("clipboard:availableFormats",e(i)),has:(i,a)=>r("clipboard:has",i,e(a)),read:(i,a)=>r("clipboard:read",i,e(a)),readBuffer:async(i,a)=>Uint8Array.from(await r("clipboard:readBuffer",i,e(a))),writeBuffer:(i,a,s)=>r("clipboard:writeBuffer",i,Re(a),e(s)),write:(i,a)=>r("clipboard:write",lt(i),e(a)),writeWebCustomFormats:(i,a)=>r("clipboard:writeWebCustomFormats",Ce(i),e(a)),readWebCustomFormats:i=>r("clipboard:readWebCustomFormats",e(i)),readFilePaths:i=>r("clipboard:readFilePaths",e(i)),writeFilePaths:(i,a)=>r("clipboard:writeFilePaths",i,e(a)),changeCount:i=>r("clipboard:changeCount",e(i)),items:i=>r("clipboard:items",e(i)),onChange:(i,a={})=>{let s=!1,c,o=async()=>{if(s)return;let l=await r("clipboard:changeCount",t);if(s)return;if(c===void 0){c=l;return}if(l===c)return;c=l;let u=await r("clipboard:availableFormats",t);s||i(u)};o();let d=window.setInterval(()=>{o()},a.intervalMs??500);return()=>{s=!0,window.clearInterval(d)}},pasteboard:i=>Ae(r,i)}}export{z as contextBridge,Ae as createClipboardAPI,Xe as createLocationGetCurrentPosition,Ye as createNativeImageAPI,it as createWebUtilsAPI,at as installDisplayMediaCompat,_ as ipcRenderer};
