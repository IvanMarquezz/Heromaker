from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- ESTRUTURA DE DADOS ATUALIZADA ---
# Agora, vamos guardar um dicionário para cada usuário, contendo a senha e o nome.
USERS = {
    "teste@email.com": {"senha": "12345", "nome": "Tester"},
    "ivan@heromaker.com": {"senha": "senha123", "nome": "Ivan"}
}

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    # Verifica se o email existe E se a senha dentro do dicionário do usuário está correta
    if email in USERS and USERS[email]["senha"] == senha:
        # Retorna também o nome do usuário, se quiser usar no front-end depois
        return jsonify({"success": True, "message": "Login válido", "nome": USERS[email]["nome"]})
    else:
        return jsonify({"success": False, "message": "E-mail ou senha incorretos"}), 401

@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    data = request.get_json()
    # Pega os três campos vindos do JavaScript
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    # Validação simples no backend
    if not nome or not email or not senha:
        return jsonify({"success": False, "message": "Todos os campos são obrigatórios"}), 400

    if email in USERS:
        return jsonify({"success": False, "message": "Este e-mail já está cadastrado"}), 409

    # Adiciona o novo usuário à nossa estrutura de dados
    USERS[email] = {"senha": senha, "nome": nome}
    print("--- NOVO USUÁRIO CADASTRADO ---")
    print(USERS) # Mostra no terminal a lista de usuários atualizada

    return jsonify({"success": True, "message": "Cadastro realizado com sucesso"})

if __name__ == "__main__":
    app.run(debug=True)
