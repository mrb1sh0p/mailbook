-- user overlord
insert into users ("name", cpf, last_name, email, username, "password", "role") 
values ('João Gustavo', '17472884707', 'Soares Bispo', 'jgbispo20@gmail.com', 'joao.bispo', '2708@Bispo', 'overlord');

-- user comum
insert into users ("name", cpf, last_name, email, username, "password", "role") 
values ('Alexia', '17472884727', 'Venturin', 'venturinale@gmail.com', 'alexia.venturin', '2708@alexia', 'user');

INSERT INTO users ("name", cpf, last_name, email, username, "password", "role") 
VALUES ('Bruno', '25896314785', 'Silva', 'bruno.silva@email.com', 'bruno.silva', 'bruno@1234', 'user');

INSERT INTO users ("name", cpf, last_name, email, username, "password", "role") 
VALUES ('Camila', '36985214796', 'Souza', 'camila.souza@email.com', 'camila.souza', 'souza@9876', 'user');

-- Inserção de um exemplo com CNPJ
INSERT INTO orgs ("name", address, phone, email, cnpj)
VALUES ('Empresa Exemplo Ltda', 'Rua das Flores, 123', '11987654321', 'contato@exemplo.com', '12345678000195');

-- Inserção de um exemplo sem CNPJ
INSERT INTO orgs ("name", address, phone, email)
VALUES ('Startup ABC', 'Avenida Principal, 456', '21976543210', 'suporte@startupabc.com');

-- inserindo funcionario (alexia admin)
insert into user_is_orgs (user_id, org_id, "role") 
values ('4dc2f141-23f5-4c21-977d-7dc36f4b96df','f3c9b1f8-6387-4e8d-9b7a-86e2ea92278a', 'admin');

-- inserindo funcionario (Camila e Bruno admin)
insert into user_is_orgs (user_id, org_id, "role") 
values ('f7ab452b-6b6b-4e89-828e-3ffb681f1929','f3c9b1f8-6387-4e8d-9b7a-86e2ea92278a', 'admin');
insert into user_is_orgs (user_id, org_id, "role") 
values ('97183628-7a8b-4188-8f07-6c3195dab563','f3c9b1f8-6387-4e8d-9b7a-86e2ea92278a', 'admin');

select * from users;
select * from orgs;

select * from user_is_orgs;

SELECT 
    u.id AS user_id,
    u.name AS user_name,
	u.role AS user_role,
    o.name AS org_name,
    uo.role AS user_org_role,
    uo.utc_created_on AS user_joined_at
FROM users u
JOIN user_is_orgs uo ON u.id = uo.user_id
JOIN orgs o ON uo.org_id = o.id;

