Tayara.Tn API
=============================
The Tayara.tn API is a search API that returns Ads and their details. 
You can define filters to narrow your search results with region,min and max price.
Note: It can take up to a few minutes for an advanced search.
This API is written in JS.



**Show Article Informations**
----
  Returns json data about a Ads.

* **URL**

https://tayaratn.herokuapp.com/search

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `region=[region]&product=[product&keywords]&min=[minprice]&max=[maxprice]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"articles":[{"price":"1 000DT","link":"https://www.tayara.tn/fr/tunis/téléphones/iphone-6s_8268836.htm","title":"iphone 6s"},{"price":"1 000DT","link":"https://www.tayara.tn/fr/tunis/téléphones/iphone-6s_8268801.htm","title":"iphone 6s"},{...}`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ status : "error" }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "https://tayaratn.herokuapp.com/search?min=1000&max=1000&region=tunis&product=iphone",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```


# Author

kerim selmi <a href="http://www.karimation.com">karimation</a>

# License

<a href="LICENSE">MIT License</a>
