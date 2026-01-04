'use strict';

import utils from './utils.js';

// Factory to bind yell to a gene context
export function createYell(gene) {
  return async function yell(uri, postData, successCB, errorCB, type = 'POST', hideLoadAnim = false, opts = {}) {
    const options = (typeof type === 'object' && type !== null) ? type : opts;
    const method = (typeof type === 'string') ? type : (options.method || 'POST');
    const fullUri = uri.includes('://') ? uri : gene.apiUri + uri;

    const mergedHeaders = { ...(options.headers || {}) };
    let body = postData;

    const isPlainObject = postData && typeof postData === 'object' && !(postData instanceof FormData) && !(postData instanceof Blob);
    if (isPlainObject) {
      body = JSON.stringify(postData);
      if (!mergedHeaders['Content-Type']) mergedHeaders['Content-Type'] = 'application/json';
    }

    const showLoading = options.hideLoadAnim !== undefined ? !options.hideLoadAnim : !hideLoadAnim;
    if (showLoading) {
      gene.loadAnim && gene.loadAnim('show');
    }

    const fetchOptions = {
      method,
      body,
      headers: mergedHeaders,
      credentials: options.credentials || 'same-origin',
      mode: options.mode || 'cors'
    };

    if (options.signal) fetchOptions.signal = options.signal;

    let normalized = { ok: false, code: 0, data: null, error: null, status: 0 };

    try {
      const res = await fetch(fullUri, fetchOptions);
      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      const payload = data || {};
      const code = utils.isDefined(payload.code) ? payload.code : (res.ok ? 1 : res.status);
      const msg = payload.msg || payload.error || res.statusText || 'Server Error';
      const isErrorPayload = utils.isDefined(payload.errorCode) || (!res.ok);

      normalized = {
        ok: res.ok && !isErrorPayload,
        code,
        data: payload.data !== undefined ? payload.data : payload,
        error: isErrorPayload ? msg : null,
        status: res.status
      };

      if (!normalized.ok) {
        if (typeof errorCB === 'function') {
          errorCB.call(normalized);
        } else if (gene.alert) {
          gene.alert({ title: 'Error!', txt: msg + '(' + code + ')' });
        }
        return normalized;
      }

      if (typeof successCB === 'function') {
        successCB.call(normalized);
      }
      return normalized;
    } catch (error) {
      normalized = { ok: false, code: 0, data: null, error: error.message, status: 0 };
      gene.err && gene.err('ajax fail(' + error.message + ')!!');
      if (typeof errorCB === 'function') {
        errorCB.call(normalized);
      }
      return normalized;
    } finally {
      utils.logDebug('ajax complete', gene.debug);
      if (showLoading && gene.loadAnim) {
        gene.loadAnim('hide');
      }
    }
  };
}

export default createYell;
