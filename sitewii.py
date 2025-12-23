
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__, static_folder='.')
CORS(app)

# Pasta onde os arquivos serão salvos
SAVE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/api/pedido', methods=['POST'])
def salvar_pedido():
	data = request.get_json()
	if not data:
		return jsonify({'error': 'JSON inválido'}), 400

	nome = data.get('nome')
	email = data.get('email')
	pendrive = data.get('pendrive')
	jogos = data.get('jogos')
	datahora = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

	if not (nome and email and pendrive and jogos):
		return jsonify({'error': 'Campos obrigatórios faltando'}), 400

	# Salva apenas o nome dos jogos
	nomes_jogos = [j['title'] for j in jogos if 'title' in j]
	pedido = {
		'nome': nome,
		'email': email,
		'pendrive': pendrive,
		'datahora': datahora,
		'jogos': nomes_jogos
	}

	filename = f"pedido_wii_{nome.replace(' ', '_')}_{datahora}.json"
	filepath = os.path.join(SAVE_DIR, filename)
	with open(filepath, 'w', encoding='utf-8') as f:
		json.dump(pedido, f, ensure_ascii=False, indent=2)

	return jsonify({'success': True, 'filename': filename})

# Servir arquivos estáticos (HTML, CSS, JS)
@app.route('/<path:filename>')
def serve_static(filename):
	return send_from_directory(SAVE_DIR, filename)

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5000, debug=True)
