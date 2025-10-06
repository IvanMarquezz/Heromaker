from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import random # Importamos a biblioteca 'random' do Python

app = Flask(__name__)
CORS(app)

# (Sua estrutura de dados USERS e as rotas de login/cadastro/fichas permanecem as mesmas)
USERS = {
    "luigi@email.com": {
        "senha": "luigi123", 
        "nome": "luigi",
        "fichas": [] 
    }
}
# ... (rotas /login, /cadastrar, /salvar-ficha, /fichas, /ficha/<id> ficam aqui) ...
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")
    if email in USERS and USERS[email]["senha"] == senha:
        return jsonify({"success": True, "message": "Login válido", "nome": USERS[email]["nome"]})
    else:
        return jsonify({"success": False, "message": "E-mail ou senha incorretos"}), 401

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

@app.route("/fichas/<email>", methods=["GET"])
def get_fichas(email):
    if email in USERS:
        return jsonify({"success": True, "fichas": USERS[email]["fichas"]})
    return jsonify({"success": False, "message": "Usuário não encontrado"}), 404

@app.route("/ficha/<ficha_id>", methods=["GET"])
def get_ficha(ficha_id):
    for user_data in USERS.values():
        for ficha in user_data["fichas"]:
            if ficha["id"] == ficha_id:
                return jsonify({"success": True, "ficha": ficha})
    return jsonify({"success": False, "message": "Ficha não encontrada"}), 404


# --- NOVA ROTA PARA A "IA" ---
@app.route("/gerar-ficha-ia", methods=["GET"])
def gerar_ficha_ia():
    # 1. Define as opções possíveis para cada campo
    generos = ["homem", "mulher"]
    racas = ["humano", "elfo", "anão"]
    classes = ["atirador", "tank", "assasino"]
    nomes_atributos = ["nivel", "forca", "defesa", "inteligencia", "agilidade", "carisma"]

    ficha_gerada = {
        "genero": random.choice(generos),
        "raca": random.choice(racas),
        "classe": random.choice(classes)
    }

    # 2. Lógica de balanceamento para os atributos numéricos
    atributos_valores = []
    # Decide aleatoriamente se um atributo será 20 (25% de chance)
    if random.random() < 0.25:
        # Um atributo será 20, os outros serão no máximo 16
        atributo_max = random.choice(nomes_atributos)
        for nome in nomes_atributos:
            if nome == atributo_max:
                ficha_gerada[nome] = 20
            else:
                ficha_gerada[nome] = random.randint(5, 16) # Números de 5 a 16
    else:
        # Nenhum atributo será 20, todos podem ir até 18
        for nome in nomes_atributos:
            ficha_gerada[nome] = random.randint(8, 18) # Números de 8 a 18

    # 3. Retorna a ficha completa como JSON
    return jsonify({"success": True, "ficha": ficha_gerada})


if __name__ == "__main__":
    app.run(debug=True)
