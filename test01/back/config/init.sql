DROP TABLE IF EXISTS item_pedido;
DROP TABLE IF EXISTS pedido;
DROP TABLE IF EXISTS vendedor;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS cliente;

CREATE TABLE cliente
(
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    email      VARCHAR(100),
    telefone   VARCHAR(20),
    cidade     VARCHAR(50),
    estado     VARCHAR(2)
);

CREATE TABLE produto
(
    id             SERIAL PRIMARY KEY,
    nome           VARCHAR(100) NOT NULL,
    categoria      VARCHAR(50),
    preco_unitario DECIMAL(10, 2) NOT NULL,
    estoque        INT DEFAULT 0
);

CREATE TABLE vendedor
(
    id     SERIAL PRIMARY KEY,
    nome   VARCHAR(100) NOT NULL,
    regiao VARCHAR(50)
);

CREATE TABLE pedido
(
    id          SERIAL PRIMARY KEY,
    id_cliente  INT  NOT NULL,
    id_vendedor INT  NOT NULL,
    data_pedido DATE NOT NULL,
    valor_total DECIMAL(10, 2),
    FOREIGN KEY (id_cliente) REFERENCES cliente (id) ON DELETE CASCADE,
    FOREIGN KEY (id_vendedor) REFERENCES vendedor (id) ON DELETE CASCADE
);

CREATE TABLE item_pedido
(
    id             SERIAL PRIMARY KEY,
    id_pedido      INT            NOT NULL,
    id_produto     INT            NOT NULL,
    quantidade     INT            NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido (id) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produto(id) ON DELETE CASCADE
);

INSERT INTO cliente (nome, email, telefone, cidade, estado)
VALUES ('Maria Souza', 'maria@gmail.com', '11912345678', 'São Paulo', 'SP'),
       ('João Oliveira', 'joao@yahoo.com', '21987654321', 'Rio de Janeiro', 'RJ'),
       ('Ana Lima', 'ana@outlook.com', '31999999999', 'Belo Horizonte', 'MG'),
       ('Lucas Pereira', 'lucas@gmail.com', '11987654321', 'Campinas', 'SP'),
       ('Mariana Costa', 'mariana@gmail.com', '21912345678', 'Niterói', 'RJ'),
       ('Pedro Santos', 'pedro@gmail.com', '31987654321', 'Uberlândia', 'MG'),
       ('Juliana Alves', 'juliana@gmail.com', '41912345678', 'Curitiba', 'PR'),
       ('Rafael Lima', 'rafael@gmail.com', '51987654321', 'Porto Alegre', 'RS');

INSERT INTO produto (nome, categoria, preco_unitario, estoque)
VALUES ('Notebook Dell', 'Informática', 3500.00, 10),
       ('Mouse Logitech', 'Periféricos', 120.00, 50),
       ('Monitor LG 24"', 'Informática', 800.00, 20),
       ('Teclado Mecânico', 'Periféricos', 250.00, 30),
       ('Cadeira Gamer', 'Móveis', 1200.00, 15),
       ('Headset HyperX', 'Periféricos', 350.00, 25),
       ('Placa de Vídeo RTX 3060', 'Hardware', 2500.00, 10),
       ('SSD 1TB', 'Armazenamento', 500.00, 50);

INSERT INTO vendedor (nome, regiao)
VALUES ('Carlos Mendes', 'Sudeste'),
       ('Fernanda Silva', 'Sul'),
       ('Gabriel Souza', 'Centro-Oeste'),
       ('Carla Mendes', 'Norte'),
       ('Thiago Oliveira', 'Nordeste'),
       ('Fernanda Lima', 'Sul'),
       ('Rodrigo Silva', 'Sudeste');

INSERT INTO pedido (id_cliente, id_vendedor, data_pedido, valor_total)
VALUES (1, 1, '2025-05-13', 3620.00),
       (2, 2, '2025-05-14', 800.00),
       (3, 3, '2025-05-15', 1500.00),
       (4, 4, '2025-05-16', 2000.00),
       (5, 5, '2025-05-17', 3000.00),
       (1, 2, '2025-05-18', 4000.00),
       (2, 1, '2025-05-19', 5000.00);

INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario)
VALUES (1, 1, 1, 3500.00),
       (1, 2, 1, 120.00),
       (2, 3, 1, 800.00),
       (3, 4, 1, 2500.00),
       (3, 5, 2, 500.00),
       (4, 1, 1, 3500.00),
       (4, 2, 1, 120.00),
       (5, 3, 1, 800.00);