from flask import Flask, jsonify, request

app = Flask(__name__)

# Creo una pequeña base de datos simulada en memoria
posts = [
    {"id": 1, "titulo": "Mi primer post", "contenido": "Hola desde Flask!"},
    {"id": 2, "titulo": "Otro post", "contenido": "Más contenido del blog..."}
]

# Empezamos con las rutas CRUD de mi api
@app.route('/posts', methods=['GET'])
def obtener_posts():
    return jsonify(posts)

@app.route('/posts/<int:post_id>', methods=['GET'])
def obtener_post(post_id):
    post = next((p for p in posts if p['id'] == post_id), None)
    return jsonify(post) if post else ("Post no encontrado", 404)

@app.route('/posts', methods=['POST'])
def crear_post():
    nuevo = request.get_json()
    nuevo['id'] = len(posts) + 1
    posts.append(nuevo)
    return jsonify(nuevo), 201

@app.route('/posts/<int:post_id>', methods=['PUT'])
def actualizar_post(post_id):
    data = request.get_json()
    for post in posts:
        if post['id'] == post_id:
            post.update(data)
            return jsonify(post)
    return ("Post no encontrado", 404)

@app.route('/posts/<int:post_id>', methods=['DELETE'])
def borrar_post(post_id):
    global posts
    posts = [p for p in posts if p['id'] != post_id]
    return ("", 204)

if __name__ == '__main__':
    app.run(debug=True)