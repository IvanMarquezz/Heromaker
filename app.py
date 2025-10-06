from flask import Flask, request, jsonify #Cria o server web, pega os dados ebiados pelo usuario e tranforma eles em JSON
from flask_cors import CORS #Permite que o servidor aceite requisições de outros sites ou apps
import uuid #Faz IDs unicos pras fichas
import random #Gera números e escolhas random

#Cria o app e ativa o CORS pro server funcionar com frontend
app = Flask(__name__)
CORS(app)

USERS = {
    "luigi@email.com": {
        "senha": "luigi123", 
        "nome": "luigi",
        "fichas": [] 
    }
}

#Recebe email e senha do usuário
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")
    if email in USERS and USERS[email]["senha"] == senha:
        return jsonify({"success": True, "message": "Login válido", "nome": USERS[email]["nome"]})
    else:
        return jsonify({"success": False, "message": "E-mail ou senha incorretos"}), 401


#Recebe nome, email e senha
@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    data = request.get_json()
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")
    if email in USERS:
        return jsonify({"success": False, "message": "Este e-mail já está cadastrado"}), 409
    USERS[email] = {"senha": senha, "nome": nome, "fichas": []}
    return jsonify({"success": True, "message": "Cadastro realizado com sucesso"})


#Recebe email e os dados da ficha
@app.route("/salvar-ficha", methods=["POST"])
def salvar_ficha():
    data = request.get_json()
    email_usuario = data.get("email")
    ficha_data = data.get("ficha")
    ficha_id = ficha_data.get("id")
    if email_usuario not in USERS:
        return jsonify({"success": False, "message": "Usuário não encontrado"}), 404
    if ficha_id: 
        for i, ficha in enumerate(USERS[email_usuario]["fichas"]):
            if ficha["id"] == ficha_id:
                USERS[email_usuario]["fichas"][i] = ficha_data
                return jsonify({"success": True, "message": "Ficha atualizada com sucesso", "ficha": ficha_data})
        return jsonify({"success": False, "message": "Ficha não encontrada para atualização"}), 404
    else:
        ficha_data["id"] = str(uuid.uuid4())
        USERS[email_usuario]["fichas"].append(ficha_data)
        return jsonify({"success": True, "message": "Ficha salva com sucesso", "ficha": ficha_data})

#Busca todas as fichas de um email específico
@app.route("/fichas/<email>", methods=["GET"])
def get_fichas(email):
    if email in USERS:
        return jsonify({"success": True, "fichas": USERS[email]["fichas"]})
    return jsonify({"success": False, "message": "Usuário não encontrado"}), 404

#Busca uma ficha específica pelo ID
@app.route("/ficha/<ficha_id>", methods=["GET"])
def get_ficha(ficha_id):
    for user_data in USERS.values():
        for ficha in user_data["fichas"]:
            if ficha["id"] == ficha_id:
                return jsonify({"success": True, "ficha": ficha})
    return jsonify({"success": False, "message": "Ficha não encontrada"}), 404


# --- IA ---
@app.route("/gerar-ficha-ia", methods=["GET"])
def gerar_ficha_ia():
    generos = ["homem", "mulher"]
    racas = ["humano", "elfo", "anão"]
    classes = ["atirador", "tank", "assasino"]
    nomes_atributos = ["nivel", "forca", "defesa", "inteligencia", "agilidade", "carisma"]

    ficha_gerada = {
        "genero": random.choice(generos),
        "raca": random.choice(racas),
        "classe": random.choice(classes)
    }

    atributos_valores = []
   
    if random.random() < 0.25:
        atributo_max = random.choice(nomes_atributos)
        for nome in nomes_atributos:
            if nome == atributo_max:
                ficha_gerada[nome] = 20
            else:
                ficha_gerada[nome] = random.randint(5, 16)
    else:
        for nome in nomes_atributos:
            ficha_gerada[nome] = random.randint(8, 18)

    return jsonify({"success": True, "ficha": ficha_gerada})


if __name__ == "__main__":
    app.run(debug=True)
