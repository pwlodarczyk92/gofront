module HTTP {

  export type Method = "GET" | "PUT" | "POST" | "DELETE";
  export interface Response { 
    "text": string;
    "code": number;
  }

  function encodeQueryData(dict: Object): string {
    if (dict === undefined) return "";
    var ret = [];
    for (var d in dict) {
      if (dict.hasOwnProperty(d)) {
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(dict[d]));
      }
    }
    console.log("query string: " + ret.join("&"));
    return "?"+ret.join("&");
  }

  export var http = (url: string, querydict: Object, method: Method): Response => {
    var query = encodeQueryData(querydict);
    var xhr = new XMLHttpRequest();
        xhr.open(method, url + query, false); // false for synchronous request
        xhr.send(null);
        return {"text": xhr.responseText, "code": xhr.status};
  }

  export var httpPost = (url: string, querydict: Object, formdict: Object): Response => {
    var query = encodeQueryData(querydict);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url + query, false);
    xhr.send(JSON.stringify(formdict));
    return { "text": xhr.responseText, "code": xhr.status };
  }

  export var httpAsync = (url: string, querydict: Object, method: Method, callback: (response: Response) => any) => {
    var query = encodeQueryData(querydict);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        console.log("get response: " + xhr.responseText);
        callback({"text": xhr.responseText, "code": xhr.status});
      }
    };
    console.log("url get:" + url + query);
    xhr.open(method, url + query, true); // true for asynchronous
    xhr.send(null);
  }

  export var httpPostAsync = (url: string, querydict: Object, formdict: Object, callback: (response: Response) => any) => {
    var query = encodeQueryData(querydict);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        console.log("post response: " + xhr.responseText);
        callback({"text": xhr.responseText, "code": xhr.status});
      }
    };
    console.log("url post:" + url + query);
    xhr.open("POST", url + query, true); // true for asynchronous
    xhr.send(JSON.stringify(formdict));
  }

};

