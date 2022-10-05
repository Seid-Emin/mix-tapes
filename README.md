# mix-tapes

Roadtrip mixtape CRUD api

base url - 'http://localhost:5000/api/v1/mix-tapes/'

To start server: 1.cd to server 2.npm install 3.npm start or npm run start-nodemon

endpoints:

- GET:
    - all - ''
    - byId - ?id=id

- FILTER: 
    - bySongName - ?name=name
    - bySongArtist - ?artist=artist
    - bySongGenre - ?genre=genre
    - bySongTags - ?tag=tag&tag=tag1 //optiona
        

- DELETE:
    - id - 'id'
    - name - 'null/name'
    - artist - 'null/null/artist'

- PUT:
    - id - 'id' (changes to artist, name, genre, list ot tags or []

- POST: by providing name, artist, genre and optional list of tags

    {
        name: 'name',
        artist: 'artist',
        genre: 'genre',
        tag: ['tag'] - optional
    }
