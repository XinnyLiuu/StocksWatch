--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: stockswatch; Type: SCHEMA; Schema: -; Owner: xinnyliuu
--

CREATE SCHEMA stockswatch;


ALTER SCHEMA stockswatch OWNER TO xinnyliuu;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: user_stocks; Type: TABLE; Schema: stockswatch; Owner: xinnyliuu
--

CREATE TABLE stockswatch.user_stocks (
    symbol character varying(5) NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE stockswatch.user_stocks OWNER TO xinnyliuu;

--
-- Name: users; Type: TABLE; Schema: stockswatch; Owner: xinnyliuu
--

CREATE TABLE stockswatch.users (
    user_id integer NOT NULL,
    username character varying(50),
    firstname character varying(100),
    lastname character varying(100),
    password character varying(200),
    salt character varying(200)
);


ALTER TABLE stockswatch.users OWNER TO xinnyliuu;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: stockswatch; Owner: xinnyliuu
--

CREATE SEQUENCE stockswatch.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE stockswatch.users_user_id_seq OWNER TO xinnyliuu;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: stockswatch; Owner: xinnyliuu
--

ALTER SEQUENCE stockswatch.users_user_id_seq OWNED BY stockswatch.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: stockswatch; Owner: xinnyliuu
--

ALTER TABLE ONLY stockswatch.users ALTER COLUMN user_id SET DEFAULT nextval('stockswatch.users_user_id_seq'::regclass);


--
-- Data for Name: user_stocks; Type: TABLE DATA; Schema: stockswatch; Owner: xinnyliuu
--

COPY stockswatch.user_stocks (symbol, user_id) FROM stdin;
HUBS	3
MSFT	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: stockswatch; Owner: xinnyliuu
--

COPY stockswatch.users (user_id, username, firstname, lastname, password, salt) FROM stdin;
3	xinnyliuu	Xin	Liu	4a32e50006a57656a9bd8dd342e8e08b7fd04d89e7723084b772bd216b58053f28bc1b2e1c7b3f1ae62bc779f97e2c62ef660550c6faf556b855eb978ea545a1	f0a596d05fbb6b27df6d42c0f624b7c76adf37773500f26de6cae7f8f4d8592e
\.


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: stockswatch; Owner: xinnyliuu
--

SELECT pg_catalog.setval('stockswatch.users_user_id_seq', 3, true);


--
-- Name: users idx_16547_primary; Type: CONSTRAINT; Schema: stockswatch; Owner: xinnyliuu
--

ALTER TABLE ONLY stockswatch.users
    ADD CONSTRAINT idx_16547_primary PRIMARY KEY (user_id);


--
-- Name: user_stocks idx_16551_primary; Type: CONSTRAINT; Schema: stockswatch; Owner: xinnyliuu
--

ALTER TABLE ONLY stockswatch.user_stocks
    ADD CONSTRAINT idx_16551_primary PRIMARY KEY (symbol, user_id);


--
-- Name: idx_16551_user_id; Type: INDEX; Schema: stockswatch; Owner: xinnyliuu
--

CREATE INDEX idx_16551_user_id ON stockswatch.user_stocks USING btree (user_id);


--
-- Name: user_stocks user_stocks_ibfk_1; Type: FK CONSTRAINT; Schema: stockswatch; Owner: xinnyliuu
--

ALTER TABLE ONLY stockswatch.user_stocks
    ADD CONSTRAINT user_stocks_ibfk_1 FOREIGN KEY (user_id) REFERENCES stockswatch.users(user_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

