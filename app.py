from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import uuid
import random

# ============================================================
# CONFIG
# ============================================================

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ============================================================
# MODELOS DO BANCO
# ============================================================

class Usuario(db.Model):
    email = db.Column(db.String, primary_key=True)
    nome = db.Column(db.String, nullable=False)
    senha = db.Column(db.String, nullable=False)
    foto_perfil = db.Column(db.Text, default="")
    fichas = db.relationship("Ficha", backref="usuario", cascade="all, delete")

class Ficha(db.Model):
    id = db.Column(db.String, primary_key=True)
    email_usuario = db.Column(db.String, db.ForeignKey("usuario.email"), nullable=False)
    dados = db.Column(db.JSON, nullable=False)


# ============================================================
# CRIAR BANCO AUTOMATICAMENTE
# ============================================================

with app.app_context():
    db.create_all()


# ============================================================
# ENDPOINTS
# ============================================================

# -----------------------
# LOGIN
# -----------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    user = Usuario.query.filter_by(email=email, senha=senha).first()

    if user:
        return jsonify({
            "success": True,
            "message": "Login válido",
            "nome": user.nome,
            "foto_perfil": user.foto_perfil
        })
    return jsonify({"success": False, "message": "E-mail ou senha incorretos"}), 401


# -----------------------
# CADASTRAR
# -----------------------
@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    data = request.get_json()
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    if Usuario.query.get(email):
        return jsonify({"success": False, "message": "Este e-mail já está cadastrado"}), 409

    novo_user = Usuario(email=email, nome=nome, senha=senha)
    db.session.add(novo_user)
    db.session.commit()

    return jsonify({"success": True, "message": "Cadastro realizado com sucesso"})


# -----------------------
# SALVAR FOTO PERFIL
# -----------------------
@app.route("/salvar-foto-perfil", methods=["POST"])
def salvar_foto_perfil():
    data = request.get_json()
    email = data.get("email")
    foto_data = data.get("foto_base64")

    user = Usuario.query.get(email)

    if not user:
        return jsonify({"success": False, "message": "Usuário não encontrado"}), 404

    user.foto_perfil = foto_data
    db.session.commit()

    return jsonify({"success": True, "message": "Foto de perfil salva com sucesso."})


# -----------------------
# SALVAR FICHA
# -----------------------
@app.route("/salvar-ficha", methods=["POST"])
def salvar_ficha():
    data = request.get_json()
    email = data.get("email")
    ficha_data = data.get("ficha")
    ficha_id = ficha_data.get("id")

    user = Usuario.query.get(email)
    if not user:
        return jsonify({"success": False, "message": "Usuário não encontrado"}), 404

    # Atualizar
    if ficha_id:
        ficha = Ficha.query.get(ficha_id)
        if ficha:
            ficha.dados = ficha_data
            db.session.commit()
            return jsonify({"success": True, "message": "Ficha atualizada", "ficha": ficha_data})
        return jsonify({"success": False, "message": "Ficha não encontrada"}), 404

    # Criar nova ficha
    nova_id = str(uuid.uuid4())
    ficha_data["id"] = nova_id

    nova_ficha = Ficha(id=nova_id, email_usuario=email, dados=ficha_data)
    db.session.add(nova_ficha)
    db.session.commit()

    return jsonify({"success": True, "message": "Ficha salva", "ficha": ficha_data})


# -----------------------
# LISTAR FICHAS POR USUÁRIO
# -----------------------
@app.route("/fichas/<email>", methods=["GET"])
def get_fichas(email):
    user = Usuario.query.get(email)
    if not user:
        return jsonify({"success": False, "message": "Usuário não encontrado"}), 404

    fichas = [f.dados for f in user.fichas]
    return jsonify({"success": True, "fichas": fichas})


# -----------------------
# OBTER UMA FICHA ESPECÍFICA
# -----------------------
@app.route("/ficha/<ficha_id>", methods=["GET"])
def get_ficha(ficha_id):
    ficha = Ficha.query.get(ficha_id)

    if ficha:
        return jsonify({"success": True, "ficha": ficha.dados})

    return jsonify({"success": False, "message": "Ficha não encontrada"}), 404


# ============================================================
# IA — D&D
# ============================================================
@app.route("/gerar-ficha-ia", methods=["GET"])
def gerar_ficha_ia():

    generos = ["homem", "mulher"]
    racas = ["humano", "elfo", "anão"]
    classes = ["atirador", "tank", "assassino"]

    atributos = ["nivel", "forca", "defesa", "inteligencia", "agilidade", "carisma"]

    ficha = {
        "genero": random.choice(generos),
        "raca": random.choice(racas),
        "classe": random.choice(classes)
    }

    for atr in atributos:
        ficha[atr] = random.randint(1, 20)

    return jsonify({"success": True, "ficha": ficha})


# ============================================================
# IA — Cyberpunk
# ============================================================
@app.route("/gerar-ficha-ia-cyberpunk", methods=["GET"])
def gerar_ficha_ia_cyberpunk():

    profissoes = ["policial", "mercenário", "detetive", "médico", "mercado"]

    ficha = {
        "ciborguizacao": random.randint(0, 20),
        "profissao": random.choice(profissoes),
        "pontos_vida": random.randint(0, 20),
        "forca": random.randint(0, 20),
        "reflexo": random.randint(0, 20),
        "tecnologia": random.randint(0, 20),
        "agilidade": random.randint(0, 20),
        "carisma": random.randint(0, 20)
    }

    return jsonify({"success": True, "ficha": ficha})


# ============================================================
# IA — Ordem Paranormal
# ============================================================
@app.route("/gerar-ficha-ia-op", methods=["GET"])
def gerar_ficha_ia_op():

    ficha = {
        "nivel": random.randint(0, 20),
        "forca": random.randint(0, 20),
        "presenca": random.randint(0, 20),
        "intelecto": random.randint(0, 20),
        "agilidade": random.randint(0, 20),
        "vigor": random.randint(0, 20),
        "origem": random.choice(["comum", "desconhecida"]),
        "trilha": random.choice(["possuido", "religioso", "paranormal", "medico"]),
    }

    return jsonify({"success": True, "ficha": ficha})


# ============================================================
# START SERVER
# ============================================================
if __name__ == "__main__":
    app.run(debug=True)
