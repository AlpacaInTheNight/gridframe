/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "06f8c07a1731e4c57b69";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"bundle": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./demo/src/index.tsx","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/src/index.tsx":
/*!****************************************!*\
  !*** ./demo/src/index.tsx + 3 modules ***!
  \****************************************/
/*! no exports provided */
/*! all exports used */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js (<- Module uses injected variables (global)) */
/*! ModuleConcatenation bailout: Cannot concat with external "React" (<- Module is not an ECMAScript module) */
/*! ModuleConcatenation bailout: Cannot concat with external "ReactDOM" (<- Module is not an ECMAScript module) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__("react");

// EXTERNAL MODULE: external "ReactDOM"
var external_ReactDOM_ = __webpack_require__("react-dom");

// EXTERNAL MODULE: ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
var ResizeObserver_es = __webpack_require__("./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js");

// CONCATENATED MODULE: ./dist/index.es.js



class GridUtils {
}
GridUtils.DND_TRIGGER_DISTANCE = 40;
GridUtils.isTargedOfJoining = (element, currentElement, direction) => {
    if (direction === "none" || !currentElement)
        return false;
    const { row, column } = currentElement;
    if (direction === "bottom" &&
        element.row.start === row.end &&
        element.column.start <= column.start &&
        element.column.end > column.start) {
        return true;
    }
    else if (direction === "top" &&
        element.row.end === row.start &&
        element.column.start <= column.start &&
        element.column.end > column.start) {
        return true;
    }
    else if (direction === "left" &&
        element.column.end === column.start &&
        element.row.start <= row.start &&
        element.row.end > row.start) {
        return true;
    }
    else if (direction === "right" &&
        element.column.start === column.end &&
        element.row.start <= row.start &&
        element.row.end > row.start) {
        return true;
    }
    return false;
};
GridUtils.canJointSplit = (gridElement, currentElement, direction) => {
    if (!direction || direction === "none" || !currentElement)
        return false;
    const originColumn = currentElement.column;
    const targetColumn = gridElement.column;
    const originRow = currentElement.row;
    const targetRow = gridElement.row;
    if (direction === "bottom" || direction === "top") {
        if (originColumn.start === targetColumn.start && originColumn.end < targetColumn.end)
            return true;
        if (originColumn.end === targetColumn.end && originColumn.start > targetColumn.start)
            return true;
    }
    if (direction === "left" || direction === "right") {
        if (originRow.start === targetRow.start && originRow.end < targetRow.end)
            return true;
        if (originRow.end === targetRow.end && originRow.start > targetRow.start)
            return true;
    }
    return false;
};
GridUtils.joinIsPossible = (joinTargetElement, currentElement, direction) => {
    if (!direction || direction === "none")
        return false;
    if (!joinTargetElement || !currentElement)
        return false;
    if (direction === "bottom" || direction === "top") {
        if (joinTargetElement.column.start !== currentElement.column.start)
            return false;
        if (joinTargetElement.column.end !== currentElement.column.end)
            return false;
    }
    if (direction === "left" || direction === "right") {
        if (joinTargetElement.row.start !== currentElement.row.start)
            return false;
        if (joinTargetElement.row.end !== currentElement.row.end)
            return false;
    }
    return true;
};
GridUtils.checkSplitDirection = (pageX, pageY, eventOriginPos) => {
    const { pageX: originPageX, pageY: originPageY } = eventOriginPos;
    const direction = {
        isSplit: false,
        isHorizontal: false,
        isVertical: false
    };
    const pointX = (pageX - originPageX) ** 2;
    const pointY = (pageY - originPageY) ** 2;
    const distance = Math.ceil(Math.sqrt(pointX + pointY));
    if (distance > GridUtils.DND_TRIGGER_DISTANCE) {
        direction.isSplit = true;
        if (pointX > pointY)
            direction.isHorizontal = true;
        else
            direction.isVertical = true;
    }
    return direction;
};
/**
 * Removes not used grid columns or rows
 */
GridUtils.normalizeGrid = (gridElements, gridTemplate, gridFRSize) => {
    const columnsUsage = new Array(gridTemplate.columns.length).fill(false);
    const rowsUsage = new Array(gridTemplate.rows.length).fill(false);
    let largestColumn = gridFRSize;
    let largedRow = gridFRSize;
    //find grid lines that arent start of any grid element
    gridElements.forEach(element => {
        columnsUsage[element.column.start - 1] = true;
        rowsUsage[element.row.start - 1] = true;
    });
    //add size of not used columns/rows to the preceding used ones
    gridTemplate.columns.forEach((column, i) => {
        if (!columnsUsage[i + 1] && gridTemplate.columns[i + 1]) {
            gridTemplate.columns[i] = column + gridTemplate.columns[i + 1];
            if (gridTemplate.columns[i] > largestColumn)
                largestColumn = gridTemplate.columns[i];
        }
    });
    gridTemplate.rows.forEach((row, i) => {
        if (!rowsUsage[i + 1] && gridTemplate.rows[i + 1]) {
            gridTemplate.rows[i] = row + gridTemplate.rows[i + 1];
            if (gridTemplate.rows[i] > largedRow)
                largedRow = gridTemplate.rows[i];
        }
    });
    //adjusting cells fr size to use GridFrame.GRID_FR_SIZE constant as a largest value
    const ratioColumn = largestColumn / gridFRSize;
    const ratioRow = largedRow / gridFRSize;
    gridTemplate.columns.forEach((column, i) => {
        gridTemplate.columns[i] /= ratioColumn;
    });
    gridTemplate.rows.forEach((row, i) => {
        gridTemplate.rows[i] /= ratioRow;
    });
    //remove non used grid columns/rows
    gridTemplate.columns = gridTemplate.columns.filter((column, i) => columnsUsage[i]);
    gridTemplate.rows = gridTemplate.rows.filter((row, i) => rowsUsage[i]);
    //update grid elements to match the new grid template
    for (let index = 1; index <= columnsUsage.length; index++) {
        if (columnsUsage[index - 1])
            continue;
        gridElements.forEach(element => {
            if (element.column.end > index) {
                if (gridTemplate.columns.length === 1 || element.column.end !== columnsUsage.length + 1) {
                    element.column.end -= 1;
                }
            }
            if (element.column.start > index) {
                element.column.start -= 1;
            }
        });
    }
    for (let index = 1; index <= rowsUsage.length; index++) {
        if (rowsUsage[index - 1])
            continue;
        gridElements.forEach(element => {
            if (element.row.end > index) {
                if (gridTemplate.rows.length === 1 || element.row.end !== rowsUsage.length + 1) {
                    element.row.end -= 1;
                }
            }
            if (element.row.start > index) {
                element.row.start -= 1;
            }
        });
    }
    return gridTemplate;
};

class index_es_GridContainer extends external_React_["Component"] {
    constructor(props) {
        super(props);
        this.processResize = () => {
            const { resizeTrackStep, breakpoints: watchBreakpoints, watchOrientation } = this.props.adaptiveObserve;
            const target = this.target;
            if (!target)
                return;
            //TODO: replace this with default props
            const responsiveStep = resizeTrackStep ? resizeTrackStep : false;
            const breakpoints = watchBreakpoints ? watchBreakpoints : false;
            let orientation = false;
            const newState = {};
            let width = Number(target.dataset.width);
            let height = Number(target.dataset.height);
            if (watchOrientation) {
                if (width <= height) {
                    orientation = "landscape";
                }
                else if (width > height) {
                    orientation = "portrait";
                }
                newState.orientation = orientation;
            }
            if (responsiveStep) {
                if (Number.isInteger(width)) {
                    width = Math.floor(width / responsiveStep) * responsiveStep;
                    if (this.state.width !== width) {
                        newState.width = width;
                    }
                }
                if (Number.isInteger(height)) {
                    height = Math.floor(height / responsiveStep) * responsiveStep;
                    if (this.state.height !== height) {
                        newState.height = height;
                    }
                }
            }
            else {
                if (this.state.width !== 0)
                    newState.width = 0;
                if (this.state.height !== 0)
                    newState.height = 0;
            }
            if (breakpoints) {
                breakpoints.some(breakpoint => {
                    let fulfill = true;
                    if (breakpoint.orientation) {
                        if (breakpoint.orientation === "landscape" && width < height) {
                            fulfill = false;
                        }
                        if (breakpoint.orientation === "portrait" && width > height) {
                            fulfill = false;
                        }
                    }
                    if (breakpoint.min && fulfill) {
                        if (breakpoint.min.width && (width < breakpoint.min.width)) {
                            fulfill = false;
                        }
                        if (breakpoint.min.height && (height < breakpoint.min.height)) {
                            fulfill = false;
                        }
                    }
                    if (breakpoint.max && fulfill) {
                        if (breakpoint.max.width && (width > breakpoint.max.width)) {
                            fulfill = false;
                        }
                        if (breakpoint.max.height && (height > breakpoint.max.height)) {
                            fulfill = false;
                        }
                    }
                    if (fulfill) {
                        if (this.state.breakpointName !== breakpoint.name) {
                            newState.breakpointName = breakpoint.name;
                        }
                    }
                    return fulfill;
                });
            }
            else if (newState.breakpointName !== "") {
                newState.breakpointName = "";
            }
            if (newState.width !== undefined || newState.height !== undefined || newState.breakpointName !== undefined) {
                this.setState(newState);
            }
        };
        this.addObserver = () => {
            if (!this.props.adaptiveObserve)
                return;
            const { resizeTrackStep, breakpoints: watchBreakpoints, watchOrientation } = this.props.adaptiveObserve;
            //TODO: replace this with ref in render
            const target = document.getElementById(this.props.htmlContainerId);
            this.target = target;
            if (!target)
                return;
            const responsiveStep = resizeTrackStep ? resizeTrackStep : false;
            const breakpoints = watchBreakpoints ? watchBreakpoints : false;
            if (responsiveStep || breakpoints || watchOrientation) {
                this.observer = new MutationObserver(mutations => mutations.forEach(mutation => {
                    if (mutation.attributeName === "data-width" || mutation.attributeName === "data-height") {
                        this.processResize();
                    }
                }));
                const config = { attributes: true, attributeOldValue: true, childList: false, characterData: false };
                this.observer.observe(target, config);
            }
        };
        const state = {
            width: 0,
            height: 0,
            breakpointName: false,
            orientation: false
        };
        this.state = state;
    }
    render() {
        const { body: CONTAINER, changeComponentId, containerId } = this.props;
        const { userProps } = this.props.props;
        return (Object(external_React_["createElement"])(CONTAINER, Object.assign({ width: this.state.width, height: this.state.height, breakpoint: this.state.breakpointName, orientation: this.state.orientation, changeComponentId: changeComponentId, containerId: containerId }, userProps)));
    }
    shouldComponentUpdate(nextProps, nextState) {
        //TODO: check if resizeObserver did change
        this.observer && this.observer.disconnect();
        this.addObserver();
        if (this.props.body !== nextProps.body)
            return true;
        for (const index in nextState) {
            if (nextState[index] !== this.state[index]) {
                return true;
            }
        }
        //TODO: add recursive check
        for (const index in nextProps) {
            if (nextProps[index] !== this.props[index]) {
                return true;
            }
        }
        return false;
    }
    componentDidUpdate() {
        this.processResize();
    }
    componentDidMount() {
        this.addObserver();
    }
    componentWillUnmount() {
        this.observer && this.observer.disconnect();
    }
}

const panelSize = 30;
const borderColor = "black";
const panelHeight = panelSize + "px";
/**
 * Бессмысленно и беспощадно
 */
const joinPNG = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDY1REJFMUIwQjEzMTFFOTg4NTg4Njk3M0YzREVGRUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDY1REJFMUMwQjEzMTFFOTg4NTg4Njk3M0YzREVGRUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNjVEQkUxOTBCMTMxMUU5ODg1ODg2OTczRjNERUZFRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjVEQkUxQTBCMTMxMUU5ODg1ODg2OTczRjNERUZFRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmVsGaQAAADESURBVHja7NrLDoMwDERRxuL/f9ktXXTVIiWeBhddS+zI48RJlCCUmdudIrabBSBAgAABGg5JeTzVd8gQIECAAAECBMgb+/P4MVrmOK58LFS5zp/042t7zgyt+hCRK6dcdsM41lB2wrg2heyCeW0Kpg4NLdwJTK7MkCtTlkw7Qbq4/HvKyTCSMg5Kqf5okBlrfdEMU643GmJK9UdTzHQ7+8SB8ieYk35o5RriPgQIECBAgAAB+qMQ//oAAgQIEKAL4yHAACO0JW9gVjyHAAAAAElFTkSuQmCC')";
const splitPNG = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA2Qjk2OTUwQjEzMTFFOUJBN0U4MjlGQUU5OEZEMzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA2Qjk2OTYwQjEzMTFFOUJBN0U4MjlGQUU5OEZEMzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDZCOTY5MzBCMTMxMUU5QkE3RTgyOUZBRTk4RkQzNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMDZCOTY5NDBCMTMxMUU5QkE3RTgyOUZBRTk4RkQzNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoSBc4oAAADJSURBVHja7NrdDkAwDIZh3+L+b7myEAfYpiaovE0c+Zlnm6qFzGz4U6ThZwEIECBAgNwhyfLWewwjBAgQIECAAAG6N8alDCntz6WJPBe88klfad91T7nt1Djxq2HeKRdh5cTOgiItA1kLFHFNy3ZJoYHxInXnM+FNFCnwyBx2Suro1a+FtlNOhZHSUzfTMT1VSgqKOjK1tK2omNqLVRExreJU0TBrUqgUlI+gnAWt+B4CBAgQIECAAAGa6yL+9QEECBAgQC/GJMAAbPEobZMQ1WoAAAAASUVORK5CYII=')";
const swapPNG = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkZBRDcwN0MxMDEyMTFFOTk3MjA5RjU1RTVDRDQ1MDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkZBRDcwN0QxMDEyMTFFOTk3MjA5RjU1RTVDRDQ1MDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRkFENzA3QTEwMTIxMUU5OTcyMDlGNTVFNUNENDUwOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRkFENzA3QjEwMTIxMUU5OTcyMDlGNTVFNUNENDUwOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plkz14UAAADqSURBVHja7JlBDoMwDATZqv//8hahnioiSGI3CZpcEAQsRmuvsZDt7UnrtT1svXselhQq754te0idXc9XKBomKiYpV0qVChVOQ2AKAAEEEEB/s+1al2/Y18wKKfP+USmnJPgYoEL3731ZrWgKioSZxeUUBTOTbSsC5gjACL56Y82YTDNnr8cpRA0BBBBA9CH6EH2IGuqooYuJ1KVP/rvKf2P7bo1kKuSf49Ip54vzpYBceX1qIHfuN9daBpCD7xuqkIOVHGvbBWv2xT6NFSCAAAJomG1X953Gf0YoFAbUO7dkxWQEn319BBgArZlFZ5VBJxsAAAAASUVORK5CYII=')";
let styleGridArea = {
    display: "grid",
    width: "100%",
    height: "100%",
    borderBottom: `1px solid ${borderColor}`,
    borderLeft: `1px solid ${borderColor}`,
    boxSizing: "border-box",
};
let styleGridCell = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    borderTop: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
    boxSizing: "border-box",
};
let styleGridCellPanel = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#777",
    flexGrow: 0,
};
let styleOverlay = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: 10,
    opacity: 0.5
};
let styleComponentSelector = {
    height: panelHeight,
    width: panelHeight,
    minWidth: panelHeight,
    maxWidth: "200px",
    flexGrow: 1,
};
let styleButton = {
    width: panelHeight,
    height: panelHeight,
    cursor: "pointer",
    transition: "0.2s filter",
    display: "inline-block",
    borderRadius: panelSize / 2 + "px",
    backgroundSize: "80%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
};
let styleSplit = Object.assign(Object.assign({}, styleButton), { backgroundColor: "rgb(212, 102, 102)", backgroundImage: splitPNG });
let styleJoin = Object.assign(Object.assign({}, styleButton), { backgroundColor: "rgb(74, 86, 189)", backgroundImage: joinPNG });
let styleSwap = Object.assign(Object.assign({}, styleButton), { backgroundColor: "rgb(84, 196, 102)", backgroundImage: swapPNG });

const GridContext = Object(external_React_["createContext"])({});

class index_es_GridPanel extends external_React_["Component"] {
    constructor(props) {
        super(props);
        this.onGrabberStart = (e) => {
            const { clientX, clientY, pageX, pageY } = e;
            this.context.setDndEvent({
                eventOriginPos: { clientX, clientY, pageX, pageY },
                type: "grabber"
            });
            this.context.setDnDActive(true);
        };
        this.onJoinerStart = (e) => {
            const { clientX, clientY, pageX, pageY } = e;
            this.context.setDndEvent({
                eventOriginPos: { clientX, clientY, pageX, pageY },
                type: "join"
            });
            this.context.setDnDActive(true);
        };
        this.onSwapStart = (e) => {
            this.context.setDndEvent({
                type: "swap",
                targetOfDraggable: this.props.elementId
            });
            this.context.setDnDActive(true);
        };
        this.showOptions = () => {
            const options = [];
            options.push(Object(external_React_["createElement"])("option", { key: "0" }));
            for (const index in this.context.components) {
                const component = this.context.components[index];
                options.push(Object(external_React_["createElement"])("option", { key: index, value: index }, component.name ? component.name : index));
            }
            return options;
        };
        //TODO: remove this. need to use changeComponentId instead
        this.onChangeComponentId = (e) => {
            const componentId = e.target.value;
            const elementId = Number(e.target.dataset.id);
            this.context.changeComponentId(elementId, componentId);
        };
        this.state = {};
    }
    render() {
        const { customStyling } = this.context.config;
        const { classPrefix } = this.context.getWorkArea();
        const panelStyle = customStyling ? {} : Object.assign({}, styleGridCellPanel);
        const selectorStyle = customStyling ? {} : Object.assign({}, styleComponentSelector);
        const splitStyle = customStyling ? {} : Object.assign({}, styleSplit);
        const joinStyle = customStyling ? {} : Object.assign({}, styleJoin);
        const swapStyle = customStyling ? {} : Object.assign({}, styleSwap);
        return (Object(external_React_["createElement"])("div", { className: classPrefix + "controlPanel", style: panelStyle },
            Object(external_React_["createElement"])("div", { style: splitStyle, "data-grabber": "true", className: classPrefix + "spliter", onMouseDown: this.onGrabberStart }),
            Object(external_React_["createElement"])("select", { className: classPrefix + "componentSelector", style: selectorStyle, onChange: this.onChangeComponentId, "data-id": this.props.elementId, value: this.props.componentId || "" }, this.showOptions()),
            Object(external_React_["createElement"])("div", { style: swapStyle, "data-grabber": "true", className: classPrefix + "swapper", onMouseDown: this.onSwapStart }),
            Object(external_React_["createElement"])("div", { style: joinStyle, "data-grabber": "true", className: classPrefix + "joiner", onMouseDown: this.onJoinerStart })));
    }
}
index_es_GridPanel.contextType = GridContext;

class index_es_GridElement extends external_React_["Component"] {
    constructor(props) {
        super(props);
        /**
         * Resets currentContainer and currentElement if one of them was unset
         * TODO: that is extra load and probably not the best solution,
         * but is used to overcom issue when mouse move from one grid element to another
         * skiping the borders.
         */
        this.onGridContainerMove = (e) => {
            const { currentContainer, currentElement } = this.context.getDndEvent();
            if (!currentContainer || !currentElement) {
                const currentTarget = e.currentTarget;
                const elementId = Number(currentTarget.dataset.id);
                this.context.setDndEvent({
                    currentContainerRect: currentTarget.getBoundingClientRect(),
                    currentContainer: currentTarget
                });
                if (Number.isInteger(elementId)) {
                    this.context.setDndEvent({
                        currentElement: this.context.gridElements.find(elem => elem.id === elementId)
                    });
                }
            }
        };
        this.onGridContainerEnter = (e) => {
            const { type } = this.context.getDndEvent();
            if (type !== "inactive")
                return;
            const currentTarget = e.currentTarget;
            const elementId = Number(currentTarget.dataset.id);
            this.context.setDndEvent({
                currentContainerRect: currentTarget.getBoundingClientRect(),
                currentContainer: currentTarget
            });
            if (Number.isInteger(elementId)) {
                this.context.setDndEvent({
                    currentElement: this.context.gridElements.find(elem => elem.id === elementId)
                });
            }
        };
        this.onGridContainerLeave = (e) => {
            const { currentContainer } = this.context.getDndEvent();
            if (!currentContainer)
                return;
            currentContainer.style.removeProperty("cursor");
        };
        this.onContainerDrag = (e) => {
            const { type, currentElement, currentContainer } = this.context.getDndEvent();
            const { gridAreaId } = this.context.getWorkArea();
            const elementId = this.getHTMLId();
            const target = e.target;
            //if the source of dnd is not this container
            if (!target.id || target.id !== elementId) {
                return;
            }
            if (type !== "swap") {
                if (this.props.element.componentId !== index_es_GridElement.SUBGRID_ID) {
                    e.preventDefault();
                }
                return;
            }
            else if (currentElement) {
                const data = {
                    gridId: gridAreaId,
                    elementId: currentElement.id,
                    componentId: currentElement.componentId
                };
                if (currentContainer) {
                    currentContainer.classList.add("dnd_snapshot");
                }
                index_es_GridElement.preventDNDPropagation = false;
                e.dataTransfer.setData(index_es_GridElement.DND_DATATRANSFER_TYPE, JSON.stringify(data));
            }
        };
        this.onContainerDrop = (e) => {
            if (index_es_GridElement.preventDNDPropagation) {
                this.context.clearDNDState();
                return;
            }
            const { currentElement } = this.context.getDndEvent();
            const dataTransfer = e.dataTransfer.getData(index_es_GridElement.DND_DATATRANSFER_TYPE);
            if (!dataTransfer)
                return;
            if (!currentElement)
                return;
            const data = JSON.parse(dataTransfer);
            if (!data || !data.gridId || !Number.isInteger(data.elementId))
                return;
            const { gridAreaId } = this.context.getWorkArea();
            const currentTarget = e.currentTarget;
            const targetId = Number(currentTarget.dataset.id);
            const gridElements = this.context.gridElements;
            index_es_GridElement.preventDNDPropagation = true;
            if (data.gridId !== gridAreaId) {
                const originComponentId = this.props.element.componentId;
                const componentId = data.componentId ? data.componentId : false;
                this.context.changeComponentId(this.props.element.id, componentId);
                this.context.setElementComponent(data.gridId, data.elementId, originComponentId);
                this.context.clearDNDState();
                return;
            }
            gridElements.some(element => {
                if (element.id === targetId) {
                    [element.column, currentElement.column] = [currentElement.column, element.column];
                    [element.row, currentElement.row] = [currentElement.row, element.row];
                    return true;
                }
                return false;
            });
            //drop event dont trigger mouse up event, so we need to trigger it manually
            this.context.clearDNDState();
            this.context.setFrameElements(gridElements);
        };
        this.getCellStyle = () => {
            const element = this.props.element;
            const { customStyling } = this.context.config;
            let cellStyle = {};
            if (!customStyling)
                cellStyle = Object.assign({}, styleGridCell);
            cellStyle.gridColumnStart = element.column.start;
            cellStyle.gridColumnEnd = element.column.end;
            cellStyle.gridRowStart = element.row.start;
            cellStyle.gridRowEnd = element.row.end;
            cellStyle.overflow = "auto";
            if (this.props.component && this.props.component.overflowVisible) {
                cellStyle.overflow = "visible";
            }
            return cellStyle;
        };
        this.getComponentContainer = (defaultComponent) => {
            const { element } = this.props;
            let componentContainer;
            if (element.componentId) {
                if (this.context.components && this.context.components[element.componentId]) {
                    componentContainer = this.context.components[element.componentId];
                }
            }
            else if (defaultComponent) {
                componentContainer = defaultComponent.container;
            }
            //TODO: I propbably dont need to send them via props, as I use context now. Need to rewrite it.
            if (componentContainer && componentContainer.gridProps) {
                if (componentContainer.gridProps.components) {
                    componentContainer.props.gridComponents = this.context.components;
                }
                if (componentContainer.gridProps.elements) {
                    componentContainer.props.gridElement = this.context.gridElements;
                }
                if (componentContainer.gridProps.template) {
                    componentContainer.props.gridTemplate = this.context.gridTemplate;
                }
            }
            return componentContainer;
        };
        this.getAdaptiveObserve = (defaultAdaptiveObserve, componentContainer) => {
            let adaptiveObserve = {};
            if (componentContainer && componentContainer.observe && componentContainer.observe.adaptive) {
                adaptiveObserve = componentContainer.observe.adaptive;
            }
            else if (defaultAdaptiveObserve) {
                adaptiveObserve = defaultAdaptiveObserve;
            }
            return adaptiveObserve;
        };
        this.checkJoinStatus = () => {
            let status = "none";
            const { currentElement } = this.context.getDndEvent();
            const { element } = this.props;
            const { joinDirection } = this.context;
            const targetOfJoining = GridUtils.isTargedOfJoining(element, currentElement, joinDirection);
            if (joinDirection !== "none" && targetOfJoining) {
                if (GridUtils.joinIsPossible(element, currentElement, joinDirection)) {
                    this.context.setDndEvent({ joinTargetElement: element });
                    status = "merge";
                }
                else if (GridUtils.canJointSplit(element, currentElement, joinDirection)) {
                    this.context.setDndEvent({ joinTargetElement: element });
                    status = "expand";
                }
            }
            return status;
        };
        this.showOverlay = (props) => {
            const { customStyling } = this.context.config;
            const { classPrefix } = this.context.getWorkArea();
            let className = `${classPrefix}cell_overlay`;
            const overlayStyle = customStyling ? {} : Object.assign({}, styleOverlay);
            if (customStyling) {
                className += " " + classPrefix + props.status;
            }
            else {
                if (props.status === "merge") {
                    overlayStyle.backgroundColor = "red";
                }
                if (props.status === "expand") {
                    overlayStyle.backgroundColor = "green";
                }
            }
            return Object(external_React_["createElement"])("div", { style: overlayStyle, className: className });
        };
        this.getHTMLId = () => {
            const { gridAreaId } = this.context.getWorkArea();
            const { element } = this.props;
            return `${gridAreaId}-container-${element.id}`;
        };
        this.onDragOver = (e) => {
            const { type, madeDNDSnapshot, currentContainer } = this.context.getDndEvent();
            e.preventDefault();
            if (type === "swap" && !madeDNDSnapshot && currentContainer) {
                currentContainer.classList.remove("dnd_snapshot");
                this.context.setDndEvent({
                    madeDNDSnapshot: true
                });
            }
        };
        this.state = {};
    }
    render() {
        const { targetOfDraggable } = this.context.getDndEvent();
        const { defaultComponent, defaultAdaptiveObserve, classPrefix } = this.context.getWorkArea();
        const { element } = this.props;
        const cellStyle = this.getCellStyle();
        const htmlId = this.getHTMLId();
        const componentContainer = this.getComponentContainer(defaultComponent);
        const adaptiveObserve = this.getAdaptiveObserve(defaultAdaptiveObserve, componentContainer);
        const joinStatus = this.checkJoinStatus();
        const addClass = targetOfDraggable && targetOfDraggable === element.id ? "dnd_drag" : "";
        return (Object(external_React_["createElement"])("div", { style: cellStyle, key: "gridElement:" + element.id, "data-id": element.id, className: classPrefix + "container " + addClass, id: htmlId, onMouseEnter: this.onGridContainerEnter, onMouseLeave: this.onGridContainerLeave, onMouseMove: this.onGridContainerMove, onDragStart: this.onContainerDrag, onDrop: this.onContainerDrop, onDragOver: this.onDragOver, draggable: true },
            joinStatus !== "none" &&
                Object(external_React_["createElement"])(this.showOverlay, { status: joinStatus }),
            this.context.showPanel &&
                Object(external_React_["createElement"])(index_es_GridPanel, { elementId: element.id, componentId: this.props.element.componentId || "" }),
            componentContainer &&
                Object(external_React_["createElement"])(index_es_GridContainer, { body: componentContainer.body, props: componentContainer.props, containerId: element.id, htmlContainerId: htmlId, changeComponentId: this.context.changeComponentId, adaptiveObserve: adaptiveObserve })));
    }
}
index_es_GridElement.contextType = GridContext;
index_es_GridElement.SUBGRID_ID = "__subgrid";
index_es_GridElement.DND_DATATRANSFER_TYPE = "gridframednd";
index_es_GridElement.preventDNDPropagation = false;

class GridManager {
    constructor(props) {
        this._workArea = {
            gridAreaId: "",
            gridAreaClassName: "",
            classPrefix: "",
            gridHTMLElements: undefined,
            gridHTMLContainer: undefined,
            defaultComponent: false,
            defaultAdaptiveObserve: {},
            gridIdPrefix: GridManager.DEFAULT_GRID_ID_PREFIX,
            flexFactor: {
                col: 1,
                row: 1
            },
            allowGridResize: true,
        };
        this.checkContainersBreakpoints = () => {
            const { gridHTMLElements } = this.workArea;
            gridHTMLElements && gridHTMLElements.forEach((container) => {
                if (container.offsetWidth <= 210) {
                    if (!container.classList.contains("slim")) {
                        container.classList.add("slim");
                    }
                }
                else if (container.classList.contains("slim")) {
                    container.classList.remove("slim");
                }
                container.dataset.width = container.offsetWidth.toString();
                container.dataset.height = container.offsetHeight.toString();
            });
        };
        //TODO: rewrite this. I not sure it is needed at current state.
        this.setContainersActualSizes = (gridTemplate) => {
            const { gridHTMLContainer } = this.workArea;
            if (!gridHTMLContainer)
                return;
            const flexFactorHorizontal = gridTemplate.columns.reduce((a, b) => a + b, 0) / gridHTMLContainer.offsetWidth;
            const flexFactorVertical = gridTemplate.rows.reduce((a, b) => a + b, 0) / gridHTMLContainer.offsetHeight;
            this.workArea.flexFactor = {
                col: flexFactorHorizontal,
                row: flexFactorVertical
            };
        };
        const { config, components } = props;
        for (const componentId in components) {
            if (components[componentId].default) {
                this.workArea.defaultComponent = {
                    id: componentId,
                    container: components[componentId]
                };
                break;
            }
        }
        if (config) {
            if (config.idPrefix) {
                this.workArea.gridIdPrefix = config.idPrefix;
            }
            if (config.classPrefix) {
                this.workArea.classPrefix = config.classPrefix;
            }
            if (config.componentsDefaults && config.componentsDefaults.observe && config.componentsDefaults.observe.adaptive) {
                this.workArea.defaultAdaptiveObserve = config.componentsDefaults.observe.adaptive;
            }
            if (config.lockGrid) {
                this.workArea.allowGridResize = false;
            }
        }
        if (config && config.gridAreaClassName) {
            this.workArea.gridAreaClassName = config.gridAreaClassName;
        }
        else {
            this.workArea.gridAreaClassName = this.workArea.classPrefix + "gridArea";
        }
    }
    get workArea() {
        return this._workArea;
    }
}
GridManager.DEFAULT_GRID_ID_PREFIX = "grid-";

class GridEvents {
    constructor(gridManager) {
        this._dndEvent = {
            type: "inactive",
            eventOriginPos: {
                clientX: 0,
                clientY: 0,
                pageX: 0,
                pageY: 0
            },
            lineHorizontal: false,
            lineVertical: false,
            columnsClone: [],
            rowsClone: [],
            currentContainerRect: undefined,
            currentContainer: undefined,
            currentElement: undefined,
            joinTargetElement: undefined,
            targetOfDraggable: undefined,
            madeDNDSnapshot: false
        };
        this.setDndEvent = (newDnDEvent) => {
            for (const item in newDnDEvent) {
                if (this.dndEvent.hasOwnProperty(item))
                    this.dndEvent[item] = newDnDEvent[item];
            }
        };
        this.onUpdateGrid = ({ gridTemplate, gridElements, joinDirection }) => {
            const { dndEvent } = this;
            if (dndEvent.type === "inactive")
                return false;
            if (dndEvent.type === "resize") {
                gridTemplate.columns = dndEvent.columnsClone;
                gridTemplate.rows = dndEvent.rowsClone;
                dndEvent.currentContainer = undefined;
                dndEvent.currentElement = undefined;
            }
            else if (dndEvent.type === "join" && dndEvent.joinTargetElement && dndEvent.currentElement) {
                const joinTargedId = dndEvent.joinTargetElement.id;
                const joinTarged = dndEvent.joinTargetElement;
                //if joining splits the target - update its grid boundaries
                if (GridUtils.canJointSplit(joinTarged, dndEvent.currentElement, joinDirection)) {
                    switch (joinDirection) {
                        case "bottom":
                        case "top":
                            if (joinTarged.column.start < dndEvent.currentElement.column.start) {
                                joinTarged.column.end = dndEvent.currentElement.column.start;
                            }
                            else {
                                joinTarged.column.start = dndEvent.currentElement.column.end;
                            }
                            break;
                        case "right":
                        case "left":
                            if (joinTarged.row.start < dndEvent.currentElement.row.start) {
                                joinTarged.row.end = dndEvent.currentElement.row.start;
                            }
                            else {
                                joinTarged.row.start = dndEvent.currentElement.row.end;
                            }
                            break;
                    }
                    //if joining replaces target - remove it from the grid
                }
                else {
                    gridElements = gridElements.filter(element => element.id !== joinTargedId);
                }
                //update joining source element to the new grid boundaries
                switch (joinDirection) {
                    case "bottom":
                        dndEvent.currentElement.row.end = joinTarged.row.end;
                        break;
                    case "top":
                        dndEvent.currentElement.row.start = joinTarged.row.start;
                        break;
                    case "right":
                        dndEvent.currentElement.column.end = joinTarged.column.end;
                        break;
                    case "left":
                        dndEvent.currentElement.column.start = joinTarged.column.start;
                        break;
                }
                gridElements.some(element => {
                    if (element.id === dndEvent.currentElement.id) {
                        element = dndEvent.currentElement;
                        return true;
                    }
                    return false;
                });
                gridTemplate = GridUtils.normalizeGrid(gridElements, gridTemplate, GridEvents.GRID_FR_SIZE);
                return { gridTemplate, gridElements };
            }
            return false;
        };
        this.onCellSplit = ({ direction, gridTemplate, gridElements }) => {
            const { currentElement } = this.dndEvent;
            if (!direction.isSplit || !currentElement)
                return { gridTemplate, gridElements };
            const newElementAxis = {
                column: { start: 1, end: 1 },
                row: { start: 1, end: 1 },
            };
            let nextId = 0;
            gridElements.forEach(element => {
                if (element.id >= nextId)
                    nextId = element.id + 1;
            });
            function setNewElementAxis(originElement, newElement, axisA, id) {
                const axisB = axisA === "column" ? "row" : "column";
                newElement[axisB] = {
                    start: originElement[axisB].start,
                    end: originElement[axisB].end
                };
                //if addition of new line is not required
                if (originElement[axisA].start + 1 !== originElement[axisA].end) {
                    newElement[axisA] = {
                        start: originElement[axisA].start + 1,
                        end: originElement[axisA].end
                    };
                    gridElements.some(element => {
                        if (element.id === originElement.id) {
                            element[axisA].end = element[axisA].start + 1;
                            return true;
                        }
                        return false;
                    });
                    //if a new grid line is required to make a split
                }
                else {
                    const templateAxis = axisA === "column" ? gridTemplate.columns : gridTemplate.rows;
                    const line = originElement[axisA].start - 1;
                    const halfSize = templateAxis[line] /= 2;
                    const elementId = originElement.id;
                    const splitLineStart = originElement[axisA].start;
                    templateAxis.splice(line, 0, halfSize);
                    gridElements.forEach(element => {
                        if (element[axisA].start > splitLineStart) {
                            element[axisA].start += 1;
                        }
                        if (element[axisA].end > splitLineStart && element.id !== elementId) {
                            element[axisA].end += 1;
                        }
                    });
                    newElement[axisA] = {
                        start: originElement[axisA].end,
                        end: originElement[axisA].end + 1
                    };
                }
            }
            if (direction.isHorizontal) {
                setNewElementAxis(currentElement, newElementAxis, "column", currentElement.id);
            }
            else {
                setNewElementAxis(currentElement, newElementAxis, "row", currentElement.id);
            }
            gridElements.push({
                column: newElementAxis.column,
                row: newElementAxis.row,
                id: nextId,
                componentId: false,
                props: {}
            });
            return { gridTemplate, gridElements };
        };
        this.onGridMouseMove = ({ clientX, clientY, gridTemplate }) => {
            if (!this.dndEvent.currentContainerRect || !this.dndEvent.currentContainer || !this.dndEvent.currentElement)
                return;
            //const {col: containerCol, row: containerRow} = this.currentContainer.dataset;
            const colMax = gridTemplate.columns.length + 1;
            const rowMax = gridTemplate.rows.length + 1;
            const colStart = this.dndEvent.currentElement.column.start - 1;
            const rowStart = this.dndEvent.currentElement.row.start - 1;
            const colEnd = this.dndEvent.currentElement.column.end;
            const rowEnd = this.dndEvent.currentElement.row.end;
            const spread = GridEvents.RESIZE_TRIGGER_DISTANCE;
            const { left, top, width, height } = this.dndEvent.currentContainerRect;
            let isHorizontalBorder = false;
            let isVerticalBorder = false;
            let isTop = false;
            let isLeft = false;
            if (colStart !== 0 && left + spread > clientX) {
                isHorizontalBorder = true;
                isLeft = true;
            }
            if (colEnd !== colMax && left + width - spread < clientX) {
                isHorizontalBorder = true;
            }
            if (rowStart !== 0 && top + spread > clientY) {
                isVerticalBorder = true;
                isTop = true;
            }
            if (rowEnd !== rowMax && top + height - spread < clientY) {
                isVerticalBorder = true;
            }
            if (isHorizontalBorder && !isVerticalBorder) {
                this.dndEvent.currentContainer.style.cursor = "ew-resize";
            }
            else if (!isHorizontalBorder && isVerticalBorder) {
                this.dndEvent.currentContainer.style.cursor = "ns-resize";
            }
            else if (isHorizontalBorder && isVerticalBorder) {
                if (isTop && isLeft || !isTop && !isLeft) {
                    this.dndEvent.currentContainer.style.cursor = "nwse-resize";
                }
                else {
                    this.dndEvent.currentContainer.style.cursor = "nesw-resize";
                }
            }
            else {
                this.dndEvent.currentContainer.style.removeProperty("cursor");
            }
            //TODO: dont fire that if cursor is not near the border
            this.setDraggedGridLine(isHorizontalBorder, isVerticalBorder, isTop, isLeft);
        };
        this.onCellResize = ({ gridTemplate, clientX, clientY }) => {
            const { gridHTMLContainer, flexFactor } = this.gridManager.workArea;
            if (!gridHTMLContainer)
                return;
            const { col: colFactor, row: rowFactor } = flexFactor;
            function updateSize(cells, cellsOrigin, moved, lineNumber) {
                let gridTemplateStyle = "";
                const indexA = lineNumber;
                const indexB = lineNumber + 1;
                const newValueA = +(cellsOrigin[indexA] + moved).toFixed(3);
                const newValueB = +(cellsOrigin[indexB] - moved).toFixed(3);
                if (newValueA > GridEvents.GRID_MIN_SIZE && newValueB > GridEvents.GRID_MIN_SIZE) {
                    cells[indexA] = +(cellsOrigin[indexA] + moved).toFixed(3);
                    cells[indexB] = +(cellsOrigin[indexB] - moved).toFixed(3);
                }
                for (const cell of cells) {
                    gridTemplateStyle += cell + "fr ";
                }
                return gridTemplateStyle;
            }
            if (this.dndEvent.lineHorizontal !== false) {
                const movedX = (clientX - this.dndEvent.eventOriginPos.clientX) * colFactor;
                gridHTMLContainer.style.gridTemplateColumns = updateSize(this.dndEvent.columnsClone, gridTemplate.columns, movedX, this.dndEvent.lineHorizontal);
            }
            if (this.dndEvent.lineVertical !== false) {
                const movedY = (clientY - this.dndEvent.eventOriginPos.clientY) * rowFactor;
                gridHTMLContainer.style.gridTemplateRows = updateSize(this.dndEvent.rowsClone, gridTemplate.rows, movedY, this.dndEvent.lineVertical);
            }
        };
        this.setDraggedGridLine = (isHorizontal, isVertical, isTop, isLeft) => {
            const { currentElement } = this.dndEvent;
            if (!currentElement)
                return;
            let lineHorizontal = false;
            let lineVertical = false;
            if (isHorizontal) {
                if (isLeft) {
                    lineHorizontal = currentElement.column.start - 2;
                }
                else {
                    lineHorizontal = currentElement.column.end - 2;
                }
            }
            if (isVertical) {
                if (isTop) {
                    lineVertical = currentElement.row.start - 2;
                }
                else {
                    lineVertical = currentElement.row.end - 2;
                }
            }
            this.dndEvent.lineHorizontal = lineHorizontal;
            this.dndEvent.lineVertical = lineVertical;
        };
        this.gridManager = gridManager;
    }
    get dndEvent() {
        return this._dndEvent;
    }
}
/**
 * Default grid cell size in fr units
 */
GridEvents.GRID_FR_SIZE = 1000;
GridEvents.GRID_MIN_SIZE = GridEvents.GRID_FR_SIZE * .025;
GridEvents.RESIZE_TRIGGER_DISTANCE = 30;

class index_es_GridFrame extends external_React_["Component"] {
    constructor(props) {
        super(props);
        this.setContext = () => {
            this.gridFrameContext = {
                gridElements: this.state.gridElements,
                gridTemplate: this.state.gridTemplate,
                components: this.props.components,
                joinDirection: this.state.joinDirection,
                showPanel: this.state.showPanel,
                config: this.props.config,
                clearDNDState: this.clearDNDState,
                setElementComponent: index_es_GridFrame.setElementComponent,
                getDndEvent: this.getDndEvent,
                setDndEvent: this.setDndEvent,
                getWorkArea: this.getWorkArea,
                setWorkArea: this.setWorkArea,
                setDnDActive: this.setDnDActive,
                setFrameElements: this.setFrameElements,
                changeComponentId: this.changeComponentId
            };
        };
        this.setFrameElements = (newElements) => {
            this.setState({ gridElements: newElements });
            this.onUpdateGrid();
        };
        this.processGridId = (id, idPrefix) => {
            if (!id)
                id = index_es_GridFrame.defaultProps.gridId;
            if (idPrefix)
                id = idPrefix + id;
            const MAX_CYCLE = 100;
            let cycle = 0;
            function getValidGridId(proposedId) {
                if (++cycle >= MAX_CYCLE)
                    return proposedId;
                if (index_es_GridFrame.USED_IDS.includes(proposedId)) {
                    const matches = proposedId.match(/\d+$/);
                    if (matches) {
                        proposedId = proposedId.replace(/\d+$/, "");
                        proposedId += Number(matches[0]) + 1;
                    }
                    else {
                        proposedId += "2";
                    }
                    return getValidGridId(proposedId);
                }
                return proposedId;
            }
            id = getValidGridId(id);
            index_es_GridFrame.USED_IDS.push(id);
            return id;
        };
        this.setDnDActive = (newStatus) => {
            this.setState({ dndActive: newStatus });
        };
        this.getDndEvent = () => {
            return this.events.dndEvent;
        };
        this.setDndEvent = (newDnDEvent) => {
            for (const item in newDnDEvent) {
                if (this.events.dndEvent.hasOwnProperty(item))
                    this.events.dndEvent[item] = newDnDEvent[item];
            }
        };
        this.getWorkArea = () => {
            return this.gridManager.workArea;
        };
        this.setWorkArea = (newWorkArea) => {
            for (const item in newWorkArea) {
                if (this.gridManager.workArea.hasOwnProperty(item))
                    this.gridManager.workArea[item] = newWorkArea[item];
            }
        };
        this.changeComponentId = (elementId, componentId) => {
            const gridElements = this.state.gridElements;
            gridElements.some(element => {
                if (element.id === elementId) {
                    element.componentId = componentId;
                    return true;
                }
                return false;
            });
            this.setFrameElements(gridElements);
        };
        this.renderGrid = () => {
            const { gridAreaId, defaultComponent, gridIdPrefix } = this.gridManager.workArea;
            const elements = [];
            this.events.dndEvent.joinTargetElement = undefined;
            const components = this.props.components ? Object.assign({}, this.props.components) : {};
            if (this.props.config && this.props.config.allowSubGrid && !components[index_es_GridElement.SUBGRID_ID]) {
                const props = {
                    gridId: gridAreaId,
                    config: {
                        idPrefix: "sub",
                        customStyling: this.props.config.customStyling,
                        allowSubGrid: true,
                        isSubGrid: true,
                        hidePanel: this.props.config.hidePanel,
                        lockGrid: this.props.config.lockGrid
                    },
                    components: this.props.components,
                    template: { columns: [1000], rows: [1000] },
                    elements: [{
                            column: { start: 1, end: 2 },
                            row: { start: 1, end: 2 },
                            componentId: false,
                            id: 0,
                            props: {},
                        }]
                };
                components[index_es_GridElement.SUBGRID_ID] = {
                    body: index_es_GridFrame,
                    props,
                    name: "Sub Grid"
                };
            }
            for (const element of this.state.gridElements) {
                let component = undefined;
                if (element.componentId && this.props.components) {
                    component = this.props.components[element.componentId];
                }
                else if (defaultComponent) {
                    component = defaultComponent.container;
                }
                //move this methods to contex api
                elements.push(Object(external_React_["createElement"])(index_es_GridElement, { key: `${gridIdPrefix}cell-${element.id}`, element: element, component: component }));
            }
            return elements;
        };
        /**
         * Sends grid state to hosting component on its change.
         */
        this.onUpdateGrid = () => {
            const { onGridUpdate } = this.props;
            const { gridElements, gridTemplate } = this.state;
            onGridUpdate && onGridUpdate({
                template: gridTemplate,
                elements: gridElements
            });
        };
        this.onGridMouseUp = (e) => {
            if (this.events.dndEvent.type === "inactive")
                return;
            const { joinDirection, gridElements, gridTemplate } = this.state;
            const newGridState = this.events.onUpdateGrid({ joinDirection, gridElements, gridTemplate });
            this.onUpdateGrid();
            this.clearDNDState(newGridState);
        };
        this.clearDNDState = (newState) => {
            if (!newState)
                newState = {};
            this.events.dndEvent.lineHorizontal = false;
            this.events.dndEvent.lineVertical = false;
            this.events.dndEvent.joinTargetElement = undefined;
            this.events.dndEvent.targetOfDraggable = undefined;
            this.events.dndEvent.madeDNDSnapshot = false;
            this.events.dndEvent.type = "inactive";
            if (this.state.dndActive)
                newState.dndActive = false;
            if (this.state.joinDirection !== "none")
                newState.joinDirection = "none";
            this.setState(newState, () => {
                if (this.events.dndEvent.currentContainer) {
                    this.events.dndEvent.currentContainerRect = this.events.dndEvent.currentContainer.getBoundingClientRect();
                }
            });
        };
        this.onGridMouseDown = (e) => {
            const { allowGridResize } = this.gridManager.workArea;
            if (!allowGridResize)
                return;
            if (this.events.dndEvent.lineHorizontal !== false || this.events.dndEvent.lineVertical !== false) {
                const { clientX, clientY, pageX, pageY } = e;
                this.events.dndEvent.eventOriginPos = {
                    clientX, clientY, pageX, pageY
                };
                this.events.dndEvent.type = "resize";
                this.gridManager.setContainersActualSizes(this.state.gridTemplate);
                this.events.dndEvent.columnsClone = this.state.gridTemplate.columns.slice();
                this.events.dndEvent.rowsClone = this.state.gridTemplate.rows.slice();
                this.setState({ dndActive: true });
            }
        };
        this.onCellSplit = (direction) => {
            if (!direction.isSplit || !this.events.dndEvent.currentElement)
                return;
            const { gridTemplate, gridElements } = this.events.onCellSplit({
                direction,
                gridTemplate: this.state.gridTemplate,
                gridElements: this.state.gridElements
            });
            this.setState({ dndActive: false, gridTemplate, gridElements });
        };
        this.setCellJoinDirection = (movedVertical, movedHorizontal) => {
            let direction = "none";
            if (Math.abs(movedVertical) > Math.abs(movedHorizontal)) {
                direction = movedVertical > 0 ? "top" : "bottom";
            }
            else {
                direction = movedHorizontal > 0 ? "left" : "right";
            }
            if (this.state.joinDirection !== direction) {
                this.setState({ joinDirection: direction });
            }
        };
        this.onDNDActiveMove = (e) => {
            const { pageX, pageY, clientX, clientY } = e;
            if (this.events.dndEvent.type === "grabber") {
                const direction = GridUtils.checkSplitDirection(pageX, pageY, this.events.dndEvent.eventOriginPos);
                this.onCellSplit(direction);
            }
            if (this.events.dndEvent.type === "join") {
                const movedVertical = this.events.dndEvent.eventOriginPos.clientY - clientY;
                const movedHorizontal = this.events.dndEvent.eventOriginPos.clientX - clientX;
                this.setCellJoinDirection(movedVertical, movedHorizontal);
            }
            if (this.events.dndEvent.type === "resize") {
                this.events.onCellResize({ clientX, clientY, gridTemplate: this.state.gridTemplate });
                this.gridManager.checkContainersBreakpoints();
            }
        };
        this.onGridMouseMove = (e) => {
            const { allowGridResize } = this.gridManager.workArea;
            if (this.state.dndActive) {
                this.onDNDActiveMove(e);
            }
            else {
                if (!this.events.dndEvent.currentContainerRect || !this.events.dndEvent.currentContainer || !this.events.dndEvent.currentElement)
                    return;
                if (!allowGridResize)
                    return;
                if (e.target.dataset.grabber) {
                    this.events.dndEvent.currentContainer.style.removeProperty("cursor");
                    this.events.dndEvent.lineHorizontal = false;
                    this.events.dndEvent.lineVertical = false;
                    return;
                }
                const { clientX, clientY } = e;
                const { gridTemplate } = this.state;
                this.events.onGridMouseMove({ clientX, clientY, gridTemplate });
            }
        };
        //TODO: make keybinding configurable
        this.onKeyUp = (e) => {
            if (e.keyCode === 73 && e.ctrlKey === true) {
                this.setState({
                    showPanel: !this.state.showPanel
                });
            }
            if (e.keyCode === 81 && e.ctrlKey === true) {
                this.gridManager.workArea.allowGridResize = !this.gridManager.workArea.allowGridResize;
            }
        };
        this.updateGridElementsList = () => {
            const { gridAreaId, classPrefix, gridHTMLContainer } = this.gridManager.workArea;
            if (gridHTMLContainer) {
                const selector = `#${gridAreaId} > .${classPrefix}container`;
                this.gridManager.workArea.gridHTMLElements = document.querySelectorAll(selector);
                this.gridManager.checkContainersBreakpoints();
            }
        };
        this.getGridAreaStyle = () => {
            const gridAreaStyle = this.props.config && this.props.config.customStyling ? {} : Object.assign({}, styleGridArea);
            const { columns, rows } = this.state.gridTemplate;
            let gridTemplateColumns = "";
            let gridTemplateRows = "";
            for (const col of columns) {
                gridTemplateColumns += col + "fr ";
            }
            for (const row of rows) {
                gridTemplateRows += row + "fr ";
            }
            gridAreaStyle.gridTemplateColumns = gridTemplateColumns;
            gridAreaStyle.gridTemplateRows = gridTemplateRows;
            if (this.state.dndActive) {
                gridAreaStyle.userSelect = "none";
            }
            return gridAreaStyle;
        };
        this.gridManager = new GridManager(props);
        this.events = new GridEvents(this.gridManager);
        this.gridManager.workArea.gridAreaId = this.processGridId(this.props.gridId, this.gridManager.workArea.gridIdPrefix);
        index_es_GridFrame.EXEMPLARS.push({
            id: this.gridManager.workArea.gridAreaId,
            exemplar: this
        });
        this.state = {
            gridTemplate: props.template,
            gridElements: props.elements,
            dndActive: false,
            joinDirection: "none",
            showPanel: props.config && props.config.hidePanel ? false : true,
        };
        this.setContext();
    }
    render() {
        const { gridAreaClassName, classPrefix, gridAreaId } = this.gridManager.workArea;
        //TODO: huh? should this be here?
        this.setContext();
        const gridContainerStyle = this.getGridAreaStyle();
        let className = gridAreaClassName;
        if (this.props.config && this.props.config.isSubGrid) {
            className += " " + classPrefix + "frame_subgrid";
        }
        return (Object(external_React_["createElement"])(GridContext.Provider, { value: this.gridFrameContext },
            Object(external_React_["createElement"])("div", { id: gridAreaId, className: className, style: gridContainerStyle, onMouseDown: this.onGridMouseDown, onMouseUp: this.onGridMouseUp, onMouseMove: this.onGridMouseMove }, this.renderGrid())));
    }
    componentDidMount() {
        const { gridAreaId } = this.gridManager.workArea;
        this.gridManager.workArea.gridHTMLContainer = document.getElementById(gridAreaId) || undefined;
        this.gridManager.setContainersActualSizes(this.state.gridTemplate);
        this.updateGridElementsList();
        const ro = new ResizeObserver_es["a" /* default */]((entries, observer) => {
            this.gridManager.checkContainersBreakpoints();
        });
        this.gridManager.workArea.gridHTMLContainer && ro.observe(this.gridManager.workArea.gridHTMLContainer);
        document.addEventListener("keyup", this.onKeyUp);
    }
    componentDidUpdate() {
        this.updateGridElementsList();
    }
    componentWillUnmount() {
        const { gridAreaId } = this.gridManager.workArea;
        document.removeEventListener("keyup", this.onKeyUp);
        index_es_GridFrame.USED_IDS = index_es_GridFrame.USED_IDS.filter(id => id !== gridAreaId);
        //TODO: check that it is deleted correctly
        index_es_GridFrame.EXEMPLARS = index_es_GridFrame.EXEMPLARS.filter(instance => instance.id !== gridAreaId);
    }
}
index_es_GridFrame.defaultProps = {
    gridId: "main",
    template: { columns: [1000], rows: [1000] },
    elements: [{
            column: { start: 1, end: 2 },
            row: { start: 1, end: 2 },
            componentId: false,
            id: 0,
            props: {},
        }],
    components: {},
    config: {
        customStyling: false,
        allowSubGrid: false,
        hidePanel: false,
        lockGrid: false
    }
};
/**
 * Array of the used ids. Used to make sure that no grid areas with the same ids would be created.
 */
index_es_GridFrame.USED_IDS = [];
index_es_GridFrame.EXEMPLARS = [];
index_es_GridFrame.getFrameTemplate = (frameId) => {
    const targetExemplar = index_es_GridFrame.EXEMPLARS.find(exemplar => exemplar.id === frameId);
    if (targetExemplar) {
        return targetExemplar.exemplar.state.gridTemplate;
    }
    return false;
};
index_es_GridFrame.getFrameElements = (frameId) => {
    const targetExemplar = index_es_GridFrame.EXEMPLARS.find(exemplar => exemplar.id === frameId);
    if (targetExemplar) {
        return targetExemplar.exemplar.state.gridElements;
    }
    return false;
};
index_es_GridFrame.setElementComponent = (areaId, elementId, componentId) => {
    index_es_GridFrame.EXEMPLARS.some(exemplar => {
        if (exemplar.id === areaId) {
            const gridAreaExemplar = exemplar.exemplar;
            const elements = gridAreaExemplar.state.gridElements;
            elements.some(elem => {
                if (elem.id === elementId) {
                    elem.componentId = componentId;
                    return true;
                }
                return false;
            });
            gridAreaExemplar.setState({ gridElements: elements });
            return true;
        }
        return false;
    });
};

/* harmony default export */ var index_es = (index_es_GridFrame);

// CONCATENATED MODULE: ./demo/src/components/MockSimple.tsx

class MockSimple_MockSimple extends external_React_["Component"] {
    constructor(props) {
        super(props);
    }
    render() {
        return (external_React_["createElement"]("div", { className: 'mock' }, "I am Simple Mock Component."));
    }
}

// CONCATENATED MODULE: ./demo/src/components/Application.tsx



class Application_Application extends external_React_["Component"] {
    constructor(props) {
        super(props);
        this.config = {
            customStyling: false,
            allowSubGrid: true,
            hidePanel: false
        };
        this.onGridFrameUpdate = (updation) => {
            if (!updation)
                return;
            console.log(updation);
            /* const {gridTemplateStorage, gridElementsStorage} = this;
            const {template, elements} = updation;
    
            if(template && template.columns && template.rows && elements) {
                localStorage.setItem(gridTemplateStorage, JSON.stringify(template));
                localStorage.setItem(gridElementsStorage, JSON.stringify(elements));
            } */
        };
    }
    render() {
        const components = {
            mockSimple: {
                name: "Simple Mock",
                body: MockSimple_MockSimple,
                props: {},
                observe: {
                    adaptive: {
                        resizeTrackStep: 25
                    }
                }
            }
        };
        const template = {
            columns: [1000],
            rows: [1000, 1000]
        };
        const elements = [
            {
                column: { start: 1, end: 2 },
                row: { start: 1, end: 2 },
                componentId: "mockSimple",
                id: 0,
                props: {}
            },
            {
                column: { start: 1, end: 2 },
                row: { start: 2, end: 3 },
                componentId: "mockSimple",
                id: 1,
                props: {}
            }
        ];
        return (external_React_["createElement"](index_es, { onGridUpdate: this.onGridFrameUpdate, gridId: "main", components: components, template: template, elements: elements, config: this.config }));
    }
}

// CONCATENATED MODULE: ./demo/src/index.tsx



external_ReactDOM_["render"]((external_React_["createElement"](Application_Application, null)), document.getElementById('wrapper'));


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/*! exports used: Component, createContext, createElement */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/*! exports used: render */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map