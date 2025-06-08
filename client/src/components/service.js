// src/services/ApiService.js
class ApiService {
  static async getJson(url) {
    return this._sendRequest(url, 'GET');
  }

  static async postJson(url, data) {
    return this._sendRequest(url, 'POST', data);
  }

  static async putJson(url, data) { 
    return this._sendRequest(url, 'PUT', data);
  }

  static async deleteJson(url) {
    return this._sendRequest(url, 'DELETE');
  }

  static async _sendRequest(url, method, data = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      console.log("options : " , options)
      
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) { // No Content
        return null;
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`ApiService.${method} error:`, error);
      throw error;
    }
  }
}

export default ApiService;
