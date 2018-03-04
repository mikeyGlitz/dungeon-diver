/* eslint-disable import/prefer-default-export */
/**
 * Initializes a HTTP request
 * @param {function} dispatch The redux dispatch function
 * @return {function} a function which performs the HTTP request
 */
export const sendRequest = dispatch =>
  /**
   * Performs a HTTP request and dispatches the appropriate actions
   * @param {string} url The url to send the request to
   * @param {Object} opts Request options (i.e. headers, body, content-type)
   * @param {function} loadAction The action to dispatch to indicate to the user
   * that their request is loading
   * @param {function} successAction The action which gets dispatched as part of
   * a successful request
   * @param {function} failAction The action which gets dispatched if the request
   * fails. This function accepts an error as a parameter
   */
  (url, opts, loadAction, successAction, failAction) => {
    dispatch(loadAction());
    fetch(url, opts)
      .then(req => req.json())
      .then(data => dispatch(successAction(data)))
      .catch((err) => {
        if (failAction && typeof failAction === 'function') dispatch(failAction(err));
      });
  };
/* eslint-enable */
