import bcrypt from 'bcrypt';

export async function up(knex) {
  const hashPassword = async (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(password, salt);
  };

  const senhaJoao = await hashPassword('2708@Joao');
  const senhaAlexia = await hashPassword('2708@Alexia');
  const senhaBruno = await hashPassword('2708@Bruno');
  const senhaCamila = await hashPassword('2708@Camila');

  return knex.raw(`
    -- Inserir usuário overlord
    insert into users ("name", cpf, last_name, email, username, "password", "role") 
    values ('João Gustavo', '17472884707', 'Soares Bispo', 'jgbispo20@gmail.com', 'joao.bispo', '${senhaJoao}', 'overlord');

    -- Inserir usuário comum
    insert into users ("name", cpf, last_name, email, username, "password", "role") 
    values ('Alexia', '17472884727', 'Venturin', 'venturinale@gmail.com', 'alexia.venturin', '${senhaAlexia}', 'user');

    -- Inserir usuário Bruno
    insert into users ("name", cpf, last_name, email, username, "password", "role") 
    values ('Bruno', '25896314785', 'Silva', 'bruno.silva@email.com', 'bruno.silva', '${senhaBruno}', 'user');

    -- Inserir usuário Camila
    insert into users ("name", cpf, last_name, email, username, "password", "role") 
    values ('Camila', '36985214796', 'Souza', 'camila.souza@email.com', 'camila.souza', '${senhaCamila}', 'user');
  `);
}

export function down(knex) {
  return knex.raw(`
    -- Remover registros das tabelas users
    DELETE FROM users WHERE cpf IN ('17472884707', '17472884727', '25896314785', '36985214796');
  `);
}
