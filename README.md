# API Basejump: Image Search Abstraction Layer

Pass a search string and an optional offset query in the [URL](https://img-search-al-cs.heroku.com/) to get a set of image information relating to your search string. Image information includes title, URL, text snippet, thumbnail image URL, and the page's URL.

Paginate through the responses by adding a `?offset=num` parameter to the URL, where num is a multiple of 10.

Get a list of the 10 most recently searched strings by hitting the [img-search-al-cs.heroku.com/api/latest](https://img-search-al-cs.heroku.com/api/latest) endpoint.
