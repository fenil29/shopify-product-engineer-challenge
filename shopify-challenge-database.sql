PGDMP     8    .                 z           shopify-challenge-2    14.2 (Debian 14.2-1.pgdg110+1)    14.2     ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    16394    shopify-challenge-2    DATABASE     i   CREATE DATABASE "shopify-challenge-2" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';
 %   DROP DATABASE "shopify-challenge-2";
                postgres    false            ?            1259    16395    item    TABLE     ?   CREATE TABLE public.item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying,
    quantity bigint,
    date_created date DEFAULT CURRENT_TIMESTAMP,
    location character varying,
    price bigint,
    image character varying
);
    DROP TABLE public.item;
       public         heap    postgres    false            ?          0    16395    item 
   TABLE DATA           X   COPY public.item (id, name, quantity, date_created, location, price, image) FROM stdin;
    public          postgres    false    209   ?       a           2606    16403    item items_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.item
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);
 9   ALTER TABLE ONLY public.item DROP CONSTRAINT items_pkey;
       public            postgres    false    209            ?      x?????? ? ?     