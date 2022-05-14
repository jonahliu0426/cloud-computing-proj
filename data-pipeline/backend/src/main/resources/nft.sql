CREATE TABLE IF NOT EXISTS `user` (
    `username` varchar(50) NOT NULL,
    `balance` int NOT NULL,
    `create_time` datetime NOT NULL,
    `update_time` datetime NOT NULL,
    PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `nft` (
    `id` varchar(50) NOT NULL,
    `price` int NOT NULL,
    `owner` varchar(50) NOT NULL,
    `create_time` datetime NOT NULL,
    `update_time` datetime NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;