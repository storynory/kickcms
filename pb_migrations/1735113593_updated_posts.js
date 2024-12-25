/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1125843985")

  // remove field
  collection.fields.removeById("file2736772668")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1125843985")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "file2736772668",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp"
    ],
    "name": "featuredImage",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "200x200",
      "300x300"
    ],
    "type": "file"
  }))

  return app.save(collection)
})
