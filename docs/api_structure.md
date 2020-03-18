# RESTful API design

## Users

| Purpose              | Request                     |
| :------------------- | :-------------------------- |
| Create user          | `POST /users`               |
| Read user            | `GET /users/{id}`           |
| Update user          | `PUT /users/{id}`           |
| Delete user          | `DELETE /users/{id}`        |
| Get user's playlists | `GET /users/{id}/playlists` |

## Sessions

| Purpose             | Request         |
| :------------------ | :-------------- |
| Create user session | `POST /session` |

## Playlists

| Purpose         | Request                  |
| :-------------- | :----------------------- |
| Create playlist | `POST /playlists`        |
| Read playlists  | `GET /playlists/`        |
| Read playlist   | `GET /playlists/{id}`    |
| Update playlist | `PUT /playlists/{id}`    |
| Delete playlist | `DELETE /playlists/{id}` |

## PlaylistItems

| Purpose              | Request                                               |
| :------------------- | :---------------------------------------------------- |   
| Create playlist item | `POST /playlists/{id}/playlistitems`                  |
| Read playlist items  | `GET /playlistitems`                                  |
| Read playlist item   | `GET /playlistitems/{id}`                             |
| Update playlist item | `PUT /playlistitems/{id}`                             |
| Delete platlist item | `DELETE /playlistitems/{id}`                          |                                         

## Tracks

| Purpose      | Request               |
| :----------- | :-------------------- |
| Create track | `POST /tracks`        |
| Read track   | `GET /tracks/{id}`    |
| Update track | `PUT /tracks/{id}`    |
| Delete track | `DELETE /tracks/{id}` |
