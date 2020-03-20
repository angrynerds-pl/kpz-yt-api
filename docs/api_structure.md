# RESTful API design

## Users

| Purpose              | Request                     |
| :------------------- | :-------------------------- |
| Read users           | `GET /users`                |
| Read user            | `GET /users/{id}`           |
| Get user's playlists | `GET /users/{id}/playlists` |
| Create user          | `POST /users`               |
| Update user          | `PUT /users/{id}`           |
| Delete user          | `DELETE /users/{id}`        |

## Sessions

| Purpose             | Request         |
| :------------------ | :-------------- |
| Create user session | `POST /session` |

## Playlists

| Purpose             | Request                              |
| :------------------ | :----------------------------------- |
| Read playlists      | `GET /playlists`                     |
| Read playlist       | `GET /playlists/{id}`                |
| Read playlist items | `GET /playlists/{id}/playlist-items` |
| Create playlist     | `POST /playlists`                    |
| Update playlist     | `PUT /playlists/{id}`                |
| Delete playlist     | `DELETE /playlists/{id}`             |

## Playlist items

| Purpose               | Request                       |
| :-------------------- | :---------------------------- |
| Read playlist items   | `GET /playlist-items/{id}`    |
| Create Playlist items | `POST /playlist-items`        |
| Update Playlist items | `PUT /playlist-items/{id}`    |
| Delete Playlist items | `DELETE /playlist-items/{id}` |
