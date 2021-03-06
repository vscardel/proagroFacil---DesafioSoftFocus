list_of_commom_valid_domains = ['gmail','hotmail','yahoo','aol','msn',
'mail','uol','ig','outlook'];

list_of_commom_valid_tld = ['com','net','org','gov','edu','info','mil'];

//retorna lista com os inputs do formulario
function return_input_list() {
	let name = document.getElementById('fname');
	let email = document.getElementById('femail');
	let cpf = document.getElementById('fcpf');
	let lat = document.getElementById('flat');
	let long = document.getElementById('flong');
	let lavoura = document.getElementById('flav');
	let ocorrencia = document.getElementById('focorr');
	let date = document.getElementById('fdate');
	let list_of_form_inputs = [name,email,cpf,lat,long,lavoura,ocorrencia,date];
	return list_of_form_inputs;
}

//checa se uma string eh composta pelo mesmo caractere
function check_same_char(my_str) {
	let first_char = my_str[0];
	for(let i=1; i < my_str.length; i++) {
		if(my_str[i] != first_char) {
			return false;
		}
	}
	return true;
}

//segue o algoritmo padrão de verificação de cpf
function validate_cpf(e) {
	let cpf_entrada = document.getElementById('fcpf').value;
	let cpf = "";

	//tira pontos e hífens se houver
	for(let i=0;i<cpf_entrada.length; i++) {
		if (cpf_entrada[i] == '.' || cpf_entrada[i] == '-') {
			continue;
		}
		cpf += cpf_entrada[i];
	}

	// tamanho invalido
	if(cpf.length != 11) {
		return false;
	}
	//cpf com os mesmos caracteres
	else if(check_same_char(cpf)) {
		return false;
	}
	else {
		//algoritmo de verificacao
		let first_digit = cpf[9];
		let second_digit = cpf[10];
		//verificacao do primeiro digito
		let cont = 10;
		let sum = 0;
		for(let i=0;i<9;i++) {
			sum += (cont*parseInt(cpf[i]));
			cont--;
		}
		let first_verification_result = (sum*10) % 11;
		if(first_verification_result == 10) {
			first_verification_result = 0;
		}
		if(first_verification_result != first_digit) {
			return false;
		}
		//verificacao do primeiro digito
		cont = 11;
		sum = 0;
		for(let i=0;i<10;i++) {
			sum += (cont*parseInt(cpf[i]));
			cont--;
		}
		let second_verification_result = (sum*10) % 11;
		if(second_verification_result == 10) {
			second_verification_result = 0;
		}
		if(second_verification_result != second_digit) {
			return false;
		}
		return true;
	}
}

//simplificações: checa por dominios e TLDs mais comuns.
//se nenhum bater, retorna false. Não será verificado se
//a parte local do endereço de e-mail é válida para evitar
//o uso de regex e verificações muito complicadas
function validate_email(e) {
	email = document.getElementById('femail').value;
	if(email.length > 255) {
		return false;
	}
	let domain = "";
	let cont_arroba = 0;
	let tld = "";
	let cont_ponto = 0;
	//escaneia a string e separa o domain do tld
	for(let i=0;i<email.length; i++) {
		if(email[i] == '@') {
			cont_arroba += 1;
		}
		if(email[i] == '.') {
			cont_ponto += 1;
		}
		if(cont_arroba == 1 && cont_ponto == 0) {
			//primeiro @ encontrado
			if(email[i] == '@')
				continue;
			domain += email[i];
		}
		if(cont_ponto == 1) {
			//primeiro ponto encontrado
			if(email[i] == '.')
				continue;
			tld += email[i];
		}
	}
	if(list_of_commom_valid_domains.includes(domain) && 
		list_of_commom_valid_tld.includes(tld)) {
		return true;
	}
	else {
		return false;
	}
	
}

//retorna a parte de um número de ponto flutuante
//antes do ponto
function get_prefix_float(number) {
	var prefix = "";
	var find_point = false;
	for(i=0;i<number.length;i++) {
		//desconsidera o sinal para montar o prefixo
		if(number[i] == '.' ) {
			find_point = true;
		}
		if(!find_point) {
			prefix += number[i];
		}
		else {
			break;
		}
	}
	return prefix;
}

function validate_lat_long(e) {
	let latitude = document.getElementById('flat').value;
	let longitude = document.getElementById('flong').value;
	//desconsidera o '-' em casos de números negativos
	if(latitude[0] == '-')
		latitude = latitude.slice(1);
	if(longitude[0] == '-')
		longitude = longitude.slice(1);
	//latitude possui no maximo 8 digitos e a longitude
	//no maximo 9, a checagem considera a presença do '.'
	//na string
	if(latitude.length > 9 || longitude.length > 10) {
		return false;
	}
	prefix_lat = get_prefix_float(latitude);
	prefix_long = get_prefix_float(longitude);

	//a latitude vai de -90 à 90 e a longitude de -180 à 180
	if(prefix_lat.length > 2 || prefix_long.length > 3) {
		return false;
	}
	
}

function validate_form(e) {
	var cpf,email;
	list_of_form_inputs = return_input_list();
	//assume q nao ocorreram erros
	let flag_input_error = true;
	for (let i=0;i<list_of_form_inputs.length;i++) {
		input = list_of_form_inputs[i];
		if (input.name == 'cpf')
			cpf = input;
		if(input.name == 'email')
			email = input;
		if(input.name == 'latitude')
			latitude = input;
		if(input.name == 'longitude')
			longitude = input;
		if (input.value == '') {
			//borda do input setada como vermelha para indicar erro
			input.style.borderColor = "rgb(236, 19, 19)";
			input.style.borderWidth = "3px";
			flag_input_error = false;
		}
	}
	//validação de email e cpf
	bool_cpf = validate_cpf();
	bool_email = validate_email();
	bool_lat_long = validate_lat_long();
	if(bool_cpf == false) {
		cpf.style.borderColor = "rgb(236, 19, 19)";
		cpf.style.borderWidth = "3px";
		flag_input_error = false;
	}
	if(bool_email == false) {
		email.style.borderColor = "rgb(236, 19, 19)";
		email.style.borderWidth = "3px";
		flag_input_error = false;
	}
	if(bool_lat_long == false) {
		latitude.style.borderColor = "rgb(236, 19, 19)";
		latitude.style.borderWidth = "3px";
		longitude.style.borderColor = "rgb(236, 19, 19)";
		longitude.style.borderWidth = "3px";
		flag_input_error = false;
	}
	return flag_input_error;
}
//
function validate(e) {
	val_form = validate_form();
	if (!val_form) {
		alert("Alguma informação está incorreta.");
		return false;
	}
	return true;
}