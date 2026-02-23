const API_URL = "https://script.google.com/macros/s/AKfycbz04_0fW7IpiAQgMOh1FqG_H70egqm0TTjWZw462dnMf_y4h4Z5bHLjjHCjD9dwbff1/exec";

function post(data){
  return fetch(API_URL,{
    method:"POST",
    body: JSON.stringify(data)
  }).then(res=>res.json());
}
