import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createQuestion, deleteAllQuesions } from "~/models/question.server";

type ActionErrors = {
  pronto?: string;
};

const questions = [
  {
    "QUESTÃO": "São fundamentos da LGPD:",
    "A": "a autodeterminação informativa;a livre iniciativa, a livre concorrência e a defesa do consumidor;",
    "B": "O lucro empresarial e a soberania nacional acima da privacidade.",
    "C": "A exclusividade da exploração de dados pelo Poder Público.",
    "D": "O sigilo absoluto das operações de tratamento frente ao titular.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos:\nI - o respeito à privacidade;\nII - a autodeterminação informativa;@\nIII - a liberdade de expressão, de informação, de comunicação e de opinião;\nIV - a inviolabilidade da intimidade, da honra e da imagem;\nV - o desenvolvimento econômico e tecnológico e a inovação;\nVI - a livre iniciativa, a livre concorrência e a defesa do consumidor;@ e\nVII - os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania pelas pessoas naturais."
  },
  {
    "QUESTÃO": "São fundamentos da LGPD:",
    "A": "o respeito à privacidade;a inviolabilidade da intimidade, da honra e da imagem;",
    "B": "A padronização internacional de dados e a reserva de mercado.",
    "C": "A eficiência administrativa e a supremacia do interesse estatal.",
    "D": "A imutabilidade do dado pessoal após a coleta inicial.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos:\nI - o respeito à privacidade;\nII - a autodeterminação informativa;\nIII - a liberdade de expressão, de informação, de comunicação e de opinião;\nIV - a inviolabilidade da intimidade, da honra e da imagem;\nV - o desenvolvimento econômico e tecnológico e a inovação;\nVI - a livre iniciativa, a livre concorrência e a defesa do consumidor; e\nVII - os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania pelas pessoas naturais."
  },
  {
    "QUESTÃO": "São fundamentos da LGPD:",
    "A": "os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania pelas pessoas naturais.",
    "B": "O direito ao esquecimento absoluto e a exclusão automática de logs.",
    "C": "A monetização compulsória de dados sensíveis para fins de pesquisa.",
    "D": "A vedação ao tratamento de dados por pessoas jurídicas estrangeiras.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos:\nI - o respeito à privacidade;\nII - a autodeterminação informativa;\nIII - a liberdade de expressão, de informação, de comunicação e de opinião;\nIV - a inviolabilidade da intimidade, da honra e da imagem;\nV - o desenvolvimento econômico e tecnológico e a inovação;\nVI - a livre iniciativa, a livre concorrência e a defesa do consumidor; e\nVII - os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania pelas pessoas naturais.@"
  },
  {
    "QUESTÃO": "São fundamentos da LGPD:",
    "A": "o desenvolvimento econômico e tecnológico e a inovação; a liberdade de expressão, de informação, de comunicação e de opinião;",
    "B": "A centralização de dados em órgãos de segurança pública.",
    "C": "A obrigatoriedade de consentimento para todo e qualquer tratamento.",
    "D": "A eliminação de dados de menores de idade sem exceções legais.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos:\nI - o respeito à privacidade;\nII - a autodeterminação informativa;\nIII - a liberdade de expressão, de informação, de comunicação e de opinião;@\nIV - a inviolabilidade da intimidade, da honra e da imagem;\nV - o desenvolvimento econômico e tecnológico e a inovação;@\nVI - a livre iniciativa, a livre concorrência e a defesa do consumidor; e\nVII - os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania pelas pessoas naturais."
  },
  {
    "QUESTÃO": "São fundamentos da LGPD:",
    "A": "a livre iniciativa, a livre concorrência e a defesa do consumidor; o desenvolvimento econômico e tecnológico e a inovação;",
    "B": "A prioridade do desenvolvimento econômico sobre os direitos humanos.",
    "C": "A liberdade de comercialização de dados sensíveis sem restrições.",
    "D": "A presunção de veracidade de todos os dados coletados em rede.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos:\nI - o respeito à privacidade;\nII - a autodeterminação informativa;\nIII - a liberdade de expressão, de informação, de comunicação e de opinião;\nIV - a inviolabilidade da intimidade, da honra e da imagem;\nV - o desenvolvimento econômico e tecnológico e a inovação;\nVI - a livre iniciativa, a livre concorrência e a defesa do consumidor; e@\nVII - os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania pelas pessoas naturais."
  },
  {
    "QUESTÃO": "A LGPD aplica-se a operações de tratamento privado realizado por:",
    "A": "pessoa natural e pessoa jurídica de direito público ou privado;",
    "B": "Apenas a operações realizadas por órgãos da administração direta.",
    "C": "Exclusivamente a dados coletados por meios digitais ou eletrônicos.",
    "D": "Somente a operações de tratamento que visem ao lucro financeiro.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento realizada por pessoa natural ou por pessoa jurídica de direito público ou privado, independentemente do meio, do país de sua sede ou do país onde estejam localizados os dados, desde que:@\nI - a operação de tratamento seja realizada no território nacional;\nII - a atividade de tratamento tenha por objetivo a oferta ou o fornecimento de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional; ou (Redação dada pela Lei nº 13.853, de 2019) Vigência\nIII - os dados pessoais objeto do tratamento tenham sido coletados no território nacional.\n§ 1º Consideram-se coletados no território nacional os dados pessoais cujo titular nele se encontre no momento da coleta.\n§ 2º Excetua-se do disposto no inciso I deste artigo o tratamento de dados previsto no inciso IV do caput do art. 4º desta Lei."
  },
  {
    "QUESTÃO": "A LGPD aplica-se a operações de tratamento privado realizado por:",
    "A": "empresas, independente do país de sua sede desde que a operação de tratamento seja realizada no território nacional;",
    "B": "Empresas com sede no exterior que tratam dados de estrangeiros.",
    "C": "Tratamento de dados realizado para fins puramente militares e de defesa.",
    "D": "Operações de tratamento realizadas exclusivamente em trânsito internacional.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento realizada por pessoa natural ou por pessoa jurídica de direito público ou privado, independentemente do meio, do país de sua sede ou do país onde estejam localizados os dados, desde que:@\nI - a operação de tratamento seja realizada no território nacional;\nII - a atividade de tratamento tenha por objetivo a oferta ou o fornecimento de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional; ou (Redação dada pela Lei nº 13.853, de 2019) Vigência\nIII - os dados pessoais objeto do tratamento tenham sido coletados no território nacional.\n§ 1º Consideram-se coletados no território nacional os dados pessoais cujo titular nele se encontre no momento da coleta.\n§ 2º Excetua-se do disposto no inciso I deste artigo o tratamento de dados previsto no inciso IV do caput do art. 4º desta Lei."
  },
  {
    "QUESTÃO": "A LGPD aplica-se a operações de tratamento privado realizado por:",
    "A": "empresas, independente do país de sua sede desde que a atividade de tratamento tenha por objetivo a oferta ou o fornecimento de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional;",
    "B": "Apenas empresas privadas que possuam mais de 50 funcionários ativos.",
    "C": "Tratamento realizado em território estrangeiro para fins acadêmicos.",
    "D": "Operações de tratamento de dados que não envolvam dados sensíveis.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento realizada por pessoa natural ou por pessoa jurídica de direito público ou privado, independentemente do meio, do país de sua sede ou do país onde estejam localizados os dados, desde que:@\nI - a operação de tratamento seja realizada no território nacional;\nII - a atividade de tratamento tenha por objetivo a oferta ou o fornecimento de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional; ou (Redação dada pela Lei nº 13.853, de 2019) Vigência\nIII - os dados pessoais objeto do tratamento tenham sido coletados no território nacional.\n§ 1º Consideram-se coletados no território nacional os dados pessoais cujo titular nele se encontre no momento da coleta.\n§ 2º Excetua-se do disposto no inciso I deste artigo o tratamento de dados previsto no inciso IV do caput do art. 4º desta Lei."
  },
  {
    "QUESTÃO": "A LGPD aplica-se a operações de tratamento privado realizado por:",
    "A": "empresas, independente do país de sua sede desde que os dados pessoais objeto do tratamento tenham sido coletados no território nacional;",
    "B": "Dados cujos titulares sejam exclusivamente de nacionalidade brasileira.",
    "C": "Dados armazenados em servidores físicos localizados fora do país.",
    "D": "Dados coletados via satélite sem intermédio de infraestrutura nacional.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento realizada por pessoa natural ou por pessoa jurídica de direito público ou privado, independentemente do meio, do país de sua sede ou do país onde estejam localizados os dados, desde que:@\nI - a operação de tratamento seja realizada no território nacional;\nII - a atividade de tratamento tenha por objetivo a oferta ou o fornecimento de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional; ou (Redação dada pela Lei nº 13.853, de 2019) Vigência\nIII - os dados pessoais objeto do tratamento tenham sido coletados no território nacional.\n§ 1º Consideram-se coletados no território nacional os dados pessoais cujo titular nele se encontre no momento da coleta.\n§ 2º Excetua-se do disposto no inciso I deste artigo o tratamento de dados previsto no inciso IV do caput do art. 4º desta Lei."
  },
  {
    "QUESTÃO": "Consideram-se coletados no território nacional os dados pessoais cujo",
    "A": "titular nele se encontre no momento da coleta;",
    "B": "Titular resida em território nacional há mais de dois anos.",
    "C": "Controlador possua representante legal em todos os estados da federação.",
    "D": "Dados sejam criptografados com chaves geradas em solo brasileiro.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento realizada por pessoa natural ou por pessoa jurídica de direito público ou privado, independentemente do meio, do país de sua sede ou do país onde estejam localizados os dados, desde que:\nI - a operação de tratamento seja realizada no território nacional;\nII - a atividade de tratamento tenha por objetivo a oferta ou o fornecimento de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional; ou (Redação dada pela Lei nº 13.853, de 2019) Vigência\nIII - os dados pessoais objeto do tratamento tenham sido coletados no território nacional.\n§ 1º Consideram-se coletados no território nacional os dados pessoais cujo titular nele se encontre no momento da coleta.@\n§ 2º Excetua-se do disposto no inciso I deste artigo o tratamento de dados previsto no inciso IV do caput do art. 4º desta Lei."
  },
  {
    "QUESTÃO": "A LGPD não se aplica ao tratamento de dados pessoais:",
    "A": "realizado por pessoa natural para fins exclusivamente particulares e não econômicos",
    "B": "Realizado por pessoa jurídica para fins de marketing e publicidade.",
    "C": "Realizado por órgãos de segurança pública em investigações sigilosas.",
    "D": "Realizado por instituições financeiras para análise de score de crédito.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais:\nI - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;@\nII - realizado para fins exclusivamente:\na) jornalístico e artísticos; ou\nb) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;\nIII - realizado para fins exclusivos de:\na) segurança pública;\nb) defesa nacional;\nc) segurança do Estado; ou\nd) atividades de investigação e repressão de infrações penais; ou\nIV - provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de proveniência, desde que o país de proveniência proporcione grau de proteção de dados pessoais adequado ao previsto nesta Lei.\n§ 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica, que deverá prever medidas proporcionais e estritamente necessárias ao atendimento do interesse público, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular previstos nesta Lei.\n§ 2º É vedado o tratamento dos dados a que se refere o inciso III do caput deste artigo por pessoa de direito privado, exceto em procedimentos sob tutela de pessoa jurídica de direito público, que serão objeto de informe específico à autoridade nacional e que deverão observar a limitação imposta no § 4º deste artigo.\n§ 3º A autoridade nacional emitirá opiniões técnicas ou recomendações referentes às exceções previstas no inciso III do caput deste artigo e deverá solicitar aos responsáveis relatórios de impacto à proteção de dados pessoais.\n§ 4º Em nenhum caso a totalidade dos dados pessoais de banco de dados de que trata o inciso III do caput deste artigo poderá ser tratada por pessoa de direito privado, salvo por aquela que possua capital integralmente constituído pelo poder público."
  },
  {
    "QUESTÃO": "A LGPD não se aplica ao tratamento de dados pessoais:",
    "A": "realizado para fins exclusivamente jornalístico e artísticos;",
    "B": "Realizado para fins exclusivamente comerciais e de prospecção.",
    "C": "Realizado para fins de segurança do Estado e defesa nacional.",
    "D": "Realizado por hospitais privados para fins de prontuário médico.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais:\nI - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;\nII - realizado para fins exclusivamente:@\na) jornalístico e artísticos; ou@\nb) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;\nIII - realizado para fins exclusivos de:\na) segurança pública;\nb) defesa nacional;\nc) segurança do Estado; ou\nd) atividades de investigação e repressão de infrações penais; ou\nIV - provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de proveniência, desde que o país de proveniência proporcione grau de proteção de dados pessoais adequado ao previsto nesta Lei.\n§ 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica, que deverá prever medidas proporcionais e estritamente necessárias ao atendimento do interesse público, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular previstos nesta Lei.\n§ 2º É vedado o tratamento dos dados a que se refere o inciso III do caput deste artigo por pessoa de direito privado, exceto em procedimentos sob tutela de pessoa jurídica de direito público, que serão objeto de informe específico à autoridade nacional e que deverão observar a limitação imposta no § 4º deste artigo.\n§ 3º A autoridade nacional emitirá opiniões técnicas ou recomendações referentes às exceções previstas no inciso III do caput deste artigo e deverá solicitar aos responsáveis relatórios de impacto à proteção de dados pessoais.\n§ 4º Em nenhum caso a totalidade dos dados pessoais de banco de dados de que trata o inciso III do caput deste artigo poderá ser tratada por pessoa de direito privado, salvo por aquela que possua capital integralmente constituído pelo poder público."
  },
  {
    "QUESTÃO": "A LGPD não se aplica ao tratamento de dados pessoais:",
    "A": "realizado para fins exclusivamente jornalístico e artísticos;",
    "B": "Realizado para fins de fiscalização tributária e aduaneira.",
    "C": "Realizado para fins de repressão a infrações penais pela polícia.",
    "D": "Realizado por instituições de ensino para fins de matrícula escolar.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais:\nI - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;\nII - realizado para fins exclusivamente:\na) jornalístico e artísticos; ou\nb) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;\nIII - realizado para fins exclusivos de:\na) segurança pública;\nb) defesa nacional;\nc) segurança do Estado; ou\nd) atividades de investigação e repressão de infrações penais; ou\nIV - provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de proveniência, desde que o país de proveniência proporcione grau de proteção de dados pessoais adequado ao previsto nesta Lei.\n§ 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica, que deverá prever medidas proporcionais e estritamente necessárias ao atendimento do interesse público, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular previstos nesta Lei.\n§ 2º É vedado o tratamento dos dados a que se refere o inciso III do caput deste artigo por pessoa de direito privado, exceto em procedimentos sob tutela de pessoa jurídica de direito público, que serão objeto de informe específico à autoridade nacional e que deverão observar a limitação imposta no § 4º deste artigo.\n§ 3º A autoridade nacional emitirá opiniões técnicas ou recomendações referentes às exceções previstas no inciso III do caput deste artigo e deverá solicitar aos responsáveis relatórios de impacto à proteção de dados pessoais.\n§ 4º Em nenhum caso a totalidade dos dados pessoais de banco de dados de que trata o inciso III do caput deste artigo poderá ser tratada por pessoa de direito privado, salvo por aquela que possua capital integralmente constituído pelo poder público."
  },
  {
    "QUESTÃO": "A LGPD não se aplica ao tratamento de dados pessoais:",
    "A": "realizado para fins exclusivos de segurança pública;",
    "B": "Realizado para fins de inteligência policial e segurança pública.",
    "C": "Realizado para fins de execução de contratos de compra e venda.",
    "D": "Realizado para fins de proteção ao crédito por birôs de dados.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais:\nI - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;\nII - realizado para fins exclusivamente:\na) jornalístico e artísticos; ou\nb) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;\nIII - realizado para fins exclusivos de:@\na) segurança pública;@\nb) defesa nacional;\nc) segurança do Estado; ou\nd) atividades de investigação e repressão de infrações penais; ou\nIV - provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de proveniência, desde que o país de proveniência proporcione grau de proteção de dados pessoais adequado ao previsto nesta Lei.\n§ 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica, que deverá prever medidas proporcionais e estritamente necessárias ao atendimento do interesse público, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular previstos nesta Lei.\n§ 2º É vedado o tratamento dos dados a que se refere o inciso III do caput deste artigo por pessoa de direito privado, exceto em procedimentos sob tutela de pessoa jurídica de direito público, que serão objeto de informe específico à autoridade nacional e que deverão observar a limitação imposta no § 4º deste artigo.\n§ 3º A autoridade nacional emitirá opiniões técnicas ou recomendações referentes às exceções previstas no inciso III do caput deste artigo e deverá solicitar aos responsáveis relatórios de impacto à proteção de dados pessoais.\n§ 4º Em nenhum caso a totalidade dos dados pessoais de banco de dados de que trata o inciso III do caput deste artigo poderá ser tratada por pessoa de direito privado, salvo por aquela que possua capital integralmente constituído pelo poder público."
  },
  {
    "QUESTÃO": "A LGPD não se aplica ao tratamento de dados pessoais:",
    "A": "realizado para fins exclusivos de defesa nacional;",
    "B": "Realizado por partidos políticos para fins de propaganda eleitoral.",
    "C": "Realizado para fins de atividades de investigação de infrações penais.",
    "D": "Realizado por sindicatos para controle de filiação e contribuição.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais:\nI - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;\nII - realizado para fins exclusivamente:\na) jornalístico e artísticos; ou\nb) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;\nIII - realizado para fins exclusivos de:@\na) segurança pública;\nb) defesa nacional;@\nc) segurança do Estado; ou\nd) atividades de investigação e repressão de infrações penais; ou\nIV - provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de proveniência, desde que o país de proveniência proporcione grau de proteção de dados pessoais adequado ao previsto nesta Lei.\n§ 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica, que deverá prever medidas proporcionais e estritamente necessárias ao atendimento do interesse público, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular previstos nesta Lei.\n§ 2º É vedado o tratamento dos dados a que se refere o inciso III do caput deste artigo por pessoa de direito privado, exceto em procedimentos sob tutela de pessoa jurídica de direito público, que serão objeto de informe específico à autoridade nacional e que deverão observar a limitação imposta no § 4º deste artigo.\n§ 3º A autoridade nacional emitirá opiniões técnicas ou recomendações referentes às exceções previstas no inciso III do caput deste artigo e deverá solicitar aos responsáveis relatórios de impacto à proteção de dados pessoais.\n§ 4º Em nenhum caso a totalidade dos dados pessoais de banco de dados de que trata o inciso III do caput deste artigo poderá ser tratada por pessoa de direito privado, salvo por aquela que possua capital integralmente constituído pelo poder público."
  },
  {
    "QUESTÃO": "A LGPD não se aplica ao tratamento de dados pessoais:",
    "A": "realizado para fins exclusivos de segurança do Estado;",
    "B": "Realizado para fins de defesa nacional e segurança do Estado.",
    "C": "Realizado por empresas de tecnologia para o desenvolvimento de IA.",
    "D": "Realizado por farmácias para fins de programas de fidelidade.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais:\nI - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;\nII - realizado para fins exclusivamente:\na) jornalístico e artísticos; ou\nb) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;\nIII - realizado para fins exclusivos de:@\na) segurança pública;\nb) defesa nacional;\nc) segurança do Estado; ou@\nd) atividades de investigação e repressão de infrações penais; ou\nIV - provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de proveniência, desde que o país de proveniência proporcione grau de proteção de dados pessoais adequado ao previsto nesta Lei.\n§ 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica, que deverá prever medidas proporcionais e estritamente necessárias ao atendimento do interesse público, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular previstos nesta Lei.\n§ 2º É vedado o tratamento dos dados a que se refere o inciso III do caput deste artigo por pessoa de direito privado, exceto em procedimentos sob tutela de pessoa jurídica de direito público, que serão objeto de informe específico à autoridade nacional e que deverão observar a limitação imposta no § 4º deste artigo.\n§ 3º A autoridade nacional emitirá opiniões técnicas ou recomendações referentes às exceções previstas no inciso III do caput deste artigo e deverá solicitar aos responsáveis relatórios de impacto à proteção de dados pessoais.\n§ 4º Em nenhum caso a totalidade dos dados pessoais de banco de dados de que trata o inciso III do caput deste artigo poderá ser tratada por pessoa de direito privado, salvo por aquela que possua capital integralmente constituído pelo poder público."
  },
  {
    "QUESTÃO": "A LGPD não se aplica ao tratamento de dados pessoais:",
    "A": "realizado para fins exclusivos de atividades de investigação e repressão de infrações penais;",
    "B": "Realizado para fins de repressão de infrações penais e segurança.",
    "C": "Realizado por plataformas de streaming para recomendação de conteúdo.",
    "D": "Realizado por órgãos de pesquisa sem a devida anonimização.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais:\nI - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;\nII - realizado para fins exclusivamente:\na) jornalístico e artísticos; ou\nb) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;\nIII - realizado para fins exclusivos de:@\na) segurança pública;\nb) defesa nacional;\nc) segurança do Estado; ou\nd) atividades de investigação e repressão de infrações penais; ou@\nIV - provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de proveniência, desde que o país de proveniência proporcione grau de proteção de dados pessoais adequado ao previsto nesta Lei.\n§ 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica, que deverá prever medidas proporcionais e estritamente necessárias ao atendimento do interesse público, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular previstos nesta Lei.\n§ 2º É vedado o tratamento dos dados a que se refere o inciso III do caput deste artigo por pessoa de direito privado, exceto em procedimentos sob tutela de pessoa jurídica de direito público, que serão objeto de informe específico à autoridade nacional e que deverão observar a limitação imposta no § 4º deste artigo.\n§ 3º A autoridade nacional emitirá opiniões técnicas ou recomendações referentes às exceções previstas no inciso III do caput deste artigo e deverá solicitar aos responsáveis relatórios de impacto à proteção de dados pessoais.\n§ 4º Em nenhum caso a totalidade dos dados pessoais de banco de dados de que trata o inciso III do caput deste artigo poderá ser tratada por pessoa de direito privado, salvo por aquela que possua capital integralmente constituído pelo poder público."
  },
  {
    "QUESTÃO": "Segundo a LGPD o tratamento de dados para fins exclusivos de segurança pública é:",
    "A": "vedado, exceto em procedimentos sob tutela de pessoa jurídica de direito público;",
    "B": "Permitido livremente, desde que haja contrato de confidencialidade.",
    "C": "Autorizado para empresas privadas com capital majoritariamente público.",
    "D": "Obrigatório para todas as empresas que tratam dados sensíveis.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais:\nI - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;\nII - realizado para fins exclusivamente:\na) jornalístico e artísticos; ou\nb) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;\nIII - realizado para fins exclusivos de:\na) segurança pública;\nb) defesa nacional;\nc) segurança do Estado; ou\nd) atividades de investigação e repressão de infrações penais; ou\nIV - provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de proveniência, desde que o país de proveniência proporcione grau de proteção de dados pessoais adequado ao previsto nesta Lei.\n§ 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica, que deverá prever medidas proporcionais e estritamente necessárias ao atendimento do interesse público, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular previstos nesta Lei.\n§ 2º É vedado o tratamento dos dados a que se refere o inciso III do caput deste artigo por pessoa de direito privado, exceto em procedimentos sob tutela de pessoa jurídica de direito público, que serão objeto de informe específico à autoridade nacional e que deverão observar a limitação imposta no § 4º deste artigo.@\n§ 3º A autoridade nacional emitirá opiniões técnicas ou recomendações referentes às exceções previstas no inciso III do caput deste artigo e deverá solicitar aos responsáveis relatórios de impacto à proteção de dados pessoais.\n§ 4º Em nenhum caso a totalidade dos dados pessoais de banco de dados de que trata o inciso III do caput deste artigo poderá ser tratada por pessoa de direito privado, salvo por aquela que possua capital integralmente constituído pelo poder público."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se dado pessoal:",
    "A": "informação relacionada a pessoa natural identificada ou identificável;",
    "B": "Informação que permita identificar o endereço de IP do dispositivo.",
    "C": "Apenas dados biométricos e genéticos de pessoas naturais vivas.",
    "D": "Informação relacionada a pessoa jurídica identificada ou identificável.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;@\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se dado pessoal sensível:",
    "A": "dado pessoal sobre origem racial ou étnica, filiação a sindicato ou a organização de caráter religioso;",
    "B": "Dado que não pode ser associado a um indivíduo em nenhuma hipótese.",
    "C": "Informação sobre a vida financeira e histórico de compras do titular.",
    "D": "Dado pessoal que já foi objeto de transferência internacional anterior.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;@\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se dado anonimizado:",
    "A": "dado relativo a titular que não possa ser identificado;",
    "B": "Conjunto de dados que foram criptografados para impedir a leitura.",
    "C": "Dado que foi excluído do servidor original, mas permanece em backup.",
    "D": "Informação sobre hábitos de consumo e navegação em redes sociais.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;@\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se banco de dados:",
    "A": "conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;",
    "B": "Sistema de software utilizado para o processamento de Big Data.",
    "C": "Repositório de informações exclusivas de funcionários de uma empresa.",
    "D": "Conjunto de dados anonimizados para fins de estatísticas públicas.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;@\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se titular:",
    "A": "pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;",
    "B": "Pessoa jurídica que fornece os dados para a realização do tratamento.",
    "C": "Qualquer indivíduo que acesse a internet em território nacional.",
    "D": "Entidade responsável por fiscalizar o cumprimento da lei (ANPD).",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;@\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se controlador:",
    "A": "a quem competem as decisões referentes ao tratamento de dados pessoais;",
    "B": "Pessoa física que realiza o tratamento em nome próprio e exclusivo.",
    "C": "Órgão governamental que detém o monopólio das decisões de dados.",
    "D": "Profissional responsável por atuar como canal de comunicação (DPO).",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;@\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se operador:",
    "A": "quem realiza o tratamento de dados pessoais em nome do controlador;",
    "B": "Pessoa jurídica que decide sobre a finalidade do tratamento de dados.",
    "C": "Entidade que apenas armazena os dados sem realizar qualquer operação.",
    "D": "Autoridade nacional responsável pela fiscalização das infrações.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;@\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se encarregado:",
    "A": "pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);",
    "B": "Responsável por indicar as medidas de segurança ao controlador.",
    "C": "Pessoa que responde judicialmente por vazamentos de dados de terceiros.",
    "D": "O próprio titular quando decide compartilhar seus dados na internet.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);@\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se agentes de tratamento:",
    "A": "o controlador e o operador",
    "B": "O titular dos dados e a autoridade nacional de proteção de dados.",
    "C": "O encarregado (DPO) e os funcionários que acessam o banco de dados.",
    "D": "O desenvolvedor do software e o provedor de infraestrutura de nuvem.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;@\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se tratamento:",
    "A": "toda operação realizada com dados pessoais;",
    "B": "Apenas o ato de coletar e armazenar informações em meio digital.",
    "C": "A transmissão de dados via fibra óptica entre dois computadores.",
    "D": "A venda de bases de dados para fins de publicidade segmentada.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;@\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se anonimização:",
    "A": "utilização de meios técnicos por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;",
    "B": "Processo de deletar informações que não são mais úteis ao sistema.",
    "C": "Criptografia de dados que impede o acesso por terceiros não autorizados.",
    "D": "Técnica de compressão de arquivos para otimização de espaço em disco.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;@\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se consentimento:",
    "A": "manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;",
    "B": "Acordo verbal entre o titular e o operador sobre o uso de cookies.",
    "C": "Contrato de adesão assinado pelo titular para utilizar um serviço.",
    "D": "Autorização implícita concedida ao navegar em um site da internet.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;@\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se bloqueio:",
    "A": "suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;",
    "B": "Acesso restrito aos dados por um período de vinte e quatro meses.",
    "C": "Exclusão definitiva de todos os dados do controlador e do operador.",
    "D": "Impedimento de transferência de dados para outros países (offshoring).",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;@\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se eliminação:",
    "A": "exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;",
    "B": "Modificação dos dados para corrigir informações imprecisas ou falsas.",
    "C": "Transferência dos dados para um banco de dados de acesso público.",
    "D": "Substituição dos dados originais por nomes fictícios (pseudonimização).",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;@\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se transferência internacional de dados:",
    "A": "transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;",
    "B": "Comunicação de dados entre dois titulares de forma privada e direta.",
    "C": "Backup de dados realizado em servidores localizados no mesmo país.",
    "D": "Publicação de dados pessoais em diários oficiais do governo federal.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;@\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se uso compartilhado de dados:",
    "A": "comunicação, difusão, transferência internacional, interconexão de dados pessoais;",
    "B": "Conjunto de e-mails trocados entre funcionários de uma mesma empresa.",
    "C": "Protocolo de segurança que impede o vazamento de dados sensíveis.",
    "D": "Divulgação de dados de indivíduos que possuem cargo público eletivo.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;@\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se uso compartilhado de dados:",
    "A": "tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais;",
    "B": "Relatório de auditoria externa sobre a saúde financeira da empresa.",
    "C": "Documento que lista todos os titulares que retiraram o consentimento.",
    "D": "Manual de instruções para o uso de softwares de proteção de dados.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;@\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se relatório de impacto à proteção de dados pessoais:",
    "A": "documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;",
    "B": "Instituição de ensino privado que visa ao lucro através de cursos.",
    "C": "Laboratório farmacêutico que realiza testes clínicos de novos remédios.",
    "D": "Organização não governamental que defende direitos de consumidores.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;@\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se órgão de pesquisa:",
    "A": "órgão ou entidade da administração pública ou privada sem fins lucrativos, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico;",
    "B": "Órgão do Poder Judiciário que julga crimes contra a honra na web.",
    "C": "Conselhos de classe (como OAB e CRM) que regulam as profissões.",
    "D": "Divisão do Ministério Público que atua na defesa dos dados coletados.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico;@\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional."
  },
  {
    "QUESTÃO": "Para fisn da LGPD, considera-se autoridade nacional:",
    "A": "entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional;",
    "B": "Eficiência: busca pela máxima produtividade com o mínimo de dados.",
    "C": "Lucratividade: direito de explorar comercialmente os dados coletados.",
    "D": "Publicidade: dever de publicar todos os dados tratados em portal aberto.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se:\nI - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;\nII - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;\nIII - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;\nIV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;\nV - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;\nVI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;\nVII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;\nVIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Agência Nacional de Proteção de Dados (ANPD);\nIX - agentes de tratamento: o controlador e o operador;\nX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;\nXI - anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;\nXII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;\nXIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;\nXIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;\nXV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;\nXVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;\nXVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;\nXVIII - órgão de pesquisa: órgão ou entidade da administração pública direta ou indireta ou pessoa jurídica de direito privado sem fins lucrativos legalmente constituída sob as leis brasileiras, com sede e foro no País, que inclua em sua missão institucional ou em seu objetivo social ou estatutário a pesquisa básica ou aplicada de caráter histórico, científico, tecnológico ou estatístico; e (Redação dada pela Lei nº 13.853, de 2019) Vigência\nXIX - autoridade nacional: entidade da administração pública responsável por zelar, implementar e fiscalizar o cumprimento desta Lei em todo o território nacional.@"
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "finalidade",
    "B": "Discricionariedade: liberdade do agente para tratar dados como quiser.",
    "C": "Hierarquia: subordinação do tratamento às ordens superiores do Estado.",
    "D": "Economicidade: redução de custos operacionais no tratamento de dados.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;@\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "adequação",
    "B": "Generalidade: tratamento de dados de forma ampla para várias funções.",
    "C": "Conveniência: realização do tratamento conforme o interesse do operador.",
    "D": "Celeridade: rapidez no processamento de dados para fins de marketing.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;@\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "necessidade",
    "B": "Acesso restrito: garantia de que ninguém poderá ver os próprios dados.",
    "C": "Sigilo: dever de esconder a forma de tratamento para proteger o negócio.",
    "D": "Exclusividade: garantia de que apenas o controlador pode acessar o dado.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;@\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "livre acesso",
    "B": "Quantidade: garantia de que o controlador coletará o máximo de dados.",
    "C": "Complexidade: utilização de termos técnicos para dificultar a leitura.",
    "D": "Variedade: coleta de diversos tipos de dados para cruzamentos futuros.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;@\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "qualidade dos dados",
    "B": "Opacidade: direito de omitir os agentes de tratamento para segurança.",
    "C": "Secrecia: manutenção de processos internos ocultos ao titular e à ANPD.",
    "D": "Blindagem: proteção contra qualquer fiscalização da autoridade nacional.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;@\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "transparência",
    "B": "Reatividade: adoção de medidas apenas após a ocorrência de incidentes.",
    "C": "Punibilidade: aplicação imediata de multas sem direito à defesa prévia.",
    "D": "Compensação: pagamento financeiro por cada dado coletado do titular.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;@\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "segurança",
    "B": "Mitigação: redução dos impactos financeiros em caso de vazamento.",
    "C": "Negligência: isenção de culpa por erros técnicos de terceiros contratados.",
    "D": "Omissão: direito de não informar incidentes que não gerem prejuízo real.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;@\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "prevenção",
    "B": "Discriminação positiva: tratamento para excluir grupos específicos.",
    "C": "Segmentação: divisão de titulares por classe social para fins abusivos.",
    "D": "Exclusão: tratamento para impedir o acesso de minorias a bens básicos.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;@\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "não discriminação",
    "B": "Autodeclaração: aceitação da palavra do agente sem necessidade de prova.",
    "C": "Formalismo: cumprimento de exigências burocráticas sem eficácia real.",
    "D": "Centralização: dever de manter todas as provas em um único servidor físico.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;@\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "É um princípio da LGPD:",
    "A": "responsabilização e prestação de contas",
    "B": "Tratamento para fins de pesquisa de mercado sem aviso ao consumidor.",
    "C": "Processamento de dados para fins de entretenimento e jogos online.",
    "D": "Utilização de dados para cobrança de dívidas prescritas judicialmente.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas.@"
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da finalidade significa:",
    "A": "realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;",
    "B": "Escolha do software de tratamento baseado no menor preço de mercado.",
    "C": "Tratamento de dados de forma idêntica para todos os fins solicitados.",
    "D": "Adaptação do sistema para aceitar apenas dados de redes sociais.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;@\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da adequação significa:",
    "A": "compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;",
    "B": "Coleta de dados excedentes para prevenir necessidades futuras de uso.",
    "C": "Tratamento de dados de toda a família do titular por conveniência técnica.",
    "D": "Armazenamento de dados por tempo indeterminado para fins históricos.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;@\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da necessidade significa:",
    "A": "limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;",
    "B": "Cobrança de taxa administrativa para o titular consultar seus dados.",
    "C": "Acesso concedido apenas por meio de ordem judicial fundamentada.",
    "D": "Consulta permitida apenas pessoalmente na sede física do controlador.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;@\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da livre acesso significa:",
    "A": "garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;",
    "B": "Garantia de que os dados nunca serão alterados, mesmo se incorretos.",
    "C": "Utilização de algoritmos de inteligência artificial para prever o futuro.",
    "D": "Exclusão de dados que não sejam do interesse comercial do controlador.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;@\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da qualidade dos dados significa:",
    "A": "garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;",
    "B": "Publicação dos algoritmos de criptografia utilizados para proteção.",
    "C": "Garantia de que o titular nunca será incomodado por e-mails de aviso.",
    "D": "Divulgação de dados sensíveis para fins de transparência democrática.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;@\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da transparência significa:",
    "A": "garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;",
    "B": "Utilização de antivírus gratuito para proteger bases de dados do governo.",
    "C": "Delegar a segurança exclusivamente ao provedor de acesso à internet.",
    "D": "Manter as senhas de acesso anotadas em local físico próximo ao servidor.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;@\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da segurança significa:",
    "A": "utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;",
    "B": "Ignorar vulnerabilidades do sistema que sejam de baixo risco técnico.",
    "C": "Aguardar a notificação da ANPD para implementar barreiras de segurança.",
    "D": "Corrigir erros apenas quando houver reclamação direta do titular lesado.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;@\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da prevenção significa:",
    "A": "adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;",
    "B": "Criar perfis de usuários para oferecer produtos com preços abusivos.",
    "C": "Utilizar dados de saúde para negar contratação em processos seletivos.",
    "D": "Impedir a contratação de seguros baseado em convicção religiosa.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;@\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da não discriminação significa:",
    "A": "impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;",
    "B": "Apresentação de relatórios trimestrais de lucros para os acionistas.",
    "C": "Declaração de conformidade assinada por empresa de auditoria externa.",
    "D": "Registro de todas as atividades em livro físico autenticado em cartório.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;@\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas."
  },
  {
    "QUESTÃO": "Conforme a LGPD o princípio da responsabilização e prestação de contas significa:",
    "A": "demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas.",
    "B": "Declaração de conformidade assinada por empresa de auditoria externa.",
    "C": "Adaptação do sistema para aceitar apenas dados de redes sociais.",
    "D": "Garantia de que os dados nunca serão alterados, mesmo se incorretos.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:\nI - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;\nII - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;\nIII - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;\nIV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;\nV - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;\nVI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;\nVII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;\nVIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;\nIX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;\nX - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas.@"
  },
  {
    "QUESTÃO": "A LGPD aplica-se a qualquer operação de tratamento realizada por pessoa natural ou jurídica, independentemente de onde esteja sediada, desde que:",
    "A": "A operação de tratamento seja realizada no território nacional.",
    "B": "O titular dos dados seja estrangeiro.",
    "C": "Os dados sejam processados apenas em nuvens internacionais.",
    "D": "A empresa tenha capital social superior a um milhão.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento realizada por pessoa natural ou jurídica de direito público ou privado, independentemente do meio, do país de sua sede ou do país onde estejam localizados os dados, desde que: I - a operação de tratamento seja realizada no território nacional;@"
  },
  {
    "QUESTÃO": "A LGPD NÃO se aplica ao tratamento de dados pessoais realizado:",
    "A": "Para fins exclusivamente particulares e não econômicos.",
    "B": "Por empresas do setor bancário.",
    "C": "Para fins de marketing direto.",
    "D": "Por plataformas de redes sociais.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais: I - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;@"
  },
  {
    "QUESTÃO": "Como a LGPD define \"\"dado pessoal\"\"?",
    "A": "Informação relacionada a pessoa natural identificada ou identificável.",
    "B": "Qualquer dado que pertença a uma empresa jurídica.",
    "C": "Informações públicas extraídas do Diário Oficial.",
    "D": "Apenas o nome completo e o CPF.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se: I - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;@"
  },
  {
    "QUESTÃO": "O que é considerado um \"\"dado pessoal sensível\"\" segundo a lei?",
    "A": "Dado sobre origem racial ou étnica e convicção religiosa.",
    "B": "Número da conta corrente e agência bancária.",
    "C": "Endereço residencial e CEP.",
    "D": "Histórico de compras em sites de e-commerce.",
    "BASE": "Art. 5º (...) II - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;@"
  },
  {
    "QUESTÃO": "O que caracteriza o \"\"dado anonimizado\"\"?",
    "A": "Dado cujo titular não pode ser identificado, considerando meios técnicos razoáveis.",
    "B": "Dado que foi criptografado, mas possui chave de reversão.",
    "C": "Informação que foi excluída do banco de dados.",
    "D": "Dados protegidos por senha de acesso.",
    "BASE": "Art. 5º (...) III - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;@"
  },
  {
    "QUESTÃO": "Na LGPD, quem é o \"\"controlador\"\"?",
    "A": "Pessoa a quem competem as decisões sobre o tratamento de dados.",
    "B": "Aquele que realiza o tratamento em nome de outrem.",
    "C": "O titular que fornece os dados.",
    "D": "O órgão do governo que fiscaliza a lei.",
    "BASE": "Art. 5º (...) VI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;@"
  },
  {
    "QUESTÃO": "Quem é o \"\"operador\"\" no contexto do tratamento de dados?",
    "A": "Pessoa que realiza o tratamento de dados em nome do controlador.",
    "B": "O dono dos dados pessoais.",
    "C": "O firewall que protege a rede.",
    "D": "A pessoa responsável por apagar os dados.",
    "BASE": "Art. 5º (...) VII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;@"
  },
  {
    "QUESTÃO": "Qual o papel do \"\"encarregado\"\" (DPO) na LGPD?",
    "A": "Atuar como canal de comunicação entre controlador, titulares e a ANPD.",
    "B": "Decidir quais dados devem ser coletados.",
    "C": "Processar os dados em nome de terceiros.",
    "D": "Desenvolver os sistemas de criptografia.",
    "BASE": "Art. 5º (...) VIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD);@"
  },
  {
    "QUESTÃO": "O que é o \"\"consentimento\"\" na visão da lei?",
    "A": "Manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento.",
    "B": "Aceitação tácita ao navegar em um site.",
    "C": "A assinatura de um contrato de adesão sem leitura prévia.",
    "D": "A permissão dada por telefone sem gravação.",
    "BASE": "Art. 5º (...) XII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"finalidade\"\" exige que o tratamento seja realizado para:",
    "A": "Propósitos legítimos, específicos e informados ao titular.",
    "B": "Fins lucrativos em qualquer circunstância.",
    "C": "Uso futuro, mesmo que não especificado agora.",
    "D": "Atendimento exclusivo de interesses do controlador.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios: I - finalidade: realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular, sem possibilidade de tratamento posterior de forma incompatível com essas finalidades;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"necessidade\"\" estabelece que o tratamento deve:",
    "A": "Limitar-se ao mínimo necessário para a realização de suas finalidades.",
    "B": "Abranger o máximo de dados possível para Big Data.",
    "C": "Ocorrer apenas se o dado for sensível.",
    "D": "Ser realizado apenas por empresas públicas.",
    "BASE": "Art. 6º (...) III - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;@"
  },
  {
    "QUESTÃO": "O princípio do \"\"livre acesso\"\" garante ao titular:",
    "A": "Consulta facilitada e gratuita sobre a forma e duração do tratamento.",
    "B": "Acesso aos segredos comerciais da empresa controladora.",
    "C": "Alterar os dados de outros titulares.",
    "D": "Excluir dados de terceiros sem autorização.",
    "BASE": "Art. 6º (...) IV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;@"
  },
  {
    "QUESTÃO": "O que garante o princípio da \"\"qualidade dos dados\"\"?",
    "A": "Exatidão, clareza, relevância e atualização dos dados.",
    "B": "Que todos os dados sejam armazenados em alta resolução.",
    "C": "Que os dados nunca sejam apagados.",
    "D": "A obrigatoriedade de backup diário.",
    "BASE": "Art. 6º (...) V - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"transparência\"\" assegura aos titulares informações sobre:",
    "A": "A realização do tratamento e os respectivos agentes de tratamento.",
    "B": "Os salários dos diretores da empresa.",
    "C": "A lista de todos os outros clientes da base.",
    "D": "O código-fonte dos algoritmos de segurança.",
    "BASE": "Art. 6º (...) VI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"prevenção\"\" na LGPD foca em:",
    "A": "Adotar medidas para prevenir a ocorrência de danos.",
    "B": "Cobrar multas antes do vazamento de dados.",
    "C": "Impedir que o titular acesse seus próprios dados.",
    "D": "Evitar a contratação de funcionários novos.",
    "BASE": "Art. 6º (...) VIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;@"
  },
  {
    "QUESTÃO": "É vedado o tratamento de dados para fins:",
    "A": "Discriminatórios ilícitos ou abusivos.",
    "B": "Publicitários autorizados.",
    "C": "De pesquisa acadêmica.",
    "D": "De proteção ao crédito.",
    "BASE": "Art. 6º (...) IX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;@"
  },
  {
    "QUESTÃO": "A LGPD aplica-se ao tratamento de dados de pessoas localizadas no Brasil, mesmo que:",
    "A": "O tratamento ocorra fora do território nacional.",
    "B": "O dado seja anônimo desde a coleta.",
    "C": "A empresa não tenha site em português.",
    "D": "O titular tenha menos de 18 anos.",
    "BASE": "Art. 3º (...) II - a atividade de tratamento tenha por objetivo a oferta ou o fornecimento de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional;@"
  },
  {
    "QUESTÃO": "O tratamento de dados para fins jornalísticos e artísticos:",
    "A": "Não é regido pela LGPD.",
    "B": "Exige consentimento prévio e escrito em todos os casos.",
    "C": "Só pode ser feito pelo Governo.",
    "D": "É proibido se envolver dados sensíveis.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais: (...) II - realizado para fins exclusivamente: a) jornalístico e artístico;@"
  },
  {
    "QUESTÃO": "O que define o conceito de \"\"bloqueio\"\" na lei?",
    "A": "Suspensão temporária de qualquer operação de tratamento.",
    "B": "Desligamento do servidor de internet.",
    "C": "Exclusão definitiva dos dados do banco.",
    "D": "Impedimento de acesso físico ao prédio.",
    "BASE": "Art. 5º (...) XIII - bloqueio: suspensão temporária de qualquer operação de tratamento, mediante guarda do dado pessoal ou do banco de dados;@"
  },
  {
    "QUESTÃO": "O que é a \"\"eliminação\"\" de dados para a LGPD?",
    "A": "Exclusão de dado ou de conjunto de dados armazenados em banco de dados.",
    "B": "Mudança dos dados para uma pasta oculta.",
    "C": "Envio dos dados para o arquivo morto físico.",
    "D": "Venda dos dados para outra empresa.",
    "BASE": "Art. 5º (...) XIV - eliminação: exclusão de dado ou de conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;@"
  },
  {
    "QUESTÃO": "Os fundamentos da LGPD incluem o desenvolvimento econômico e:",
    "A": "A inovação e o desenvolvimento tecnológico.",
    "B": "O monopólio de dados por empresas nacionais.",
    "C": "A restrição ao comércio internacional.",
    "D": "A redução dos direitos do consumidor.",
    "BASE": "Art. 2º (...) V - o desenvolvimento econômico e tecnológico e a inovação;@"
  },
  {
    "QUESTÃO": "A LGPD aplica-se se os dados pessoais forem coletados:",
    "A": "No território nacional.",
    "B": "Apenas em formulários de papel.",
    "C": "Exclusivamente por redes Wi-Fi públicas.",
    "D": "Por empresas que não possuem CNPJ.",
    "BASE": "Art. 3º (...) III - os dados pessoais objeto do tratamento tenham sido coletados no território nacional.@"
  },
  {
    "QUESTÃO": "Consideram-se coletados no território nacional os dados cujos titulares:",
    "A": "Estejam no Brasil no momento da coleta.",
    "B": "Sejam brasileiros natos vivendo no exterior.",
    "C": "Tenham CPF, mesmo morando em outro país.",
    "D": "Utilizem servidores localizados em Brasília.",
    "BASE": "Art. 3º § 1º Consideram-se coletados no território nacional os dados pessoais cujo titular nele se encontre no momento da coleta.@"
  },
  {
    "QUESTÃO": "O tratamento de dados para fins de segurança pública e defesa nacional:",
    "A": "Possui legislação específica e exceção na LGPD.",
    "B": "É livre de qualquer fiscalização.",
    "C": "Deve seguir todas as regras da LGPD integralmente.",
    "D": "Só pode ser feito com autorização do titular.",
    "BASE": "Art. 4º (...) III - realizado para fins exclusivamente de: a) segurança pública; b) defesa nacional; c) segurança do Estado; ou d) atividades de investigação e repressão de infrações penais;@"
  },
  {
    "QUESTÃO": "Qual princípio exige a utilização de medidas técnicas para proteger dados de acessos não autorizados?",
    "A": "Segurança.",
    "B": "Livre acesso.",
    "C": "Finalidade.",
    "D": "Transparência.",
    "BASE": "Art. 6º (...) VII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"responsabilização e prestação de contas\"\" exige:",
    "A": "Demonstração de medidas eficazes para cumprir as normas.",
    "B": "Pagamento antecipado de taxas à ANPD.",
    "C": "Que o controlador seja sempre uma pessoa física.",
    "D": "A publicação mensal de todos os dados tratados.",
    "BASE": "Art. 6º (...) X - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas.@"
  },
  {
    "QUESTÃO": "No fundamento de \"\"liberdade de expressão\"\", a LGPD protege:",
    "A": "A informação, a comunicação e a opinião.",
    "B": "A censura de dados críticos à empresa.",
    "C": "A venda de mailing para fins políticos.",
    "D": "O anonimato em casos de crimes virtuais.",
    "BASE": "Art. 2º (...) III - a liberdade de expressão, de informação, de comunicação e de opinião;@"
  },
  {
    "QUESTÃO": "O tratamento de dados provenientes de fora do território nacional que não sejam objeto de comunicação:",
    "A": "É uma das exceções de aplicação da lei.",
    "B": "Deve seguir a LGPD obrigatoriamente.",
    "C": "É proibido de transitar por servidores brasileiros.",
    "D": "Exige que o operador seja brasileiro.",
    "BASE": "Art. 4º § 4º Não se submetem às obrigações previstas nesta Lei os dados provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de origem... @"
  },
  {
    "QUESTÃO": "A LGPD define \"\"Banco de Dados\"\" como:",
    "A": "Conjunto estruturado de dados pessoais, estabelecido em um ou vários locais.",
    "B": "Qualquer arquivo de Excel salvo no computador.",
    "C": "Apenas servidores de grande porte (Data Centers).",
    "D": "Uma coleção física de documentos em papel.",
    "BASE": "Art. 5º (...) IV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;@"
  },
  {
    "QUESTÃO": "Além da privacidade, qual destes é um fundamento da proteção de dados na LGPD?",
    "A": "Os direitos humanos e o livre desenvolvimento da personalidade.",
    "B": "A supremacia do interesse comercial sobre o individual.",
    "C": "A centralização de dados em órgãos de inteligência.",
    "D": "A proibição total de transferência internacional de dados.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos: (...) VII - os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania pelas pessoas naturais.@"
  },
  {
    "QUESTÃO": "A LGPD aplica-se ao tratamento de dados, independentemente do país da sede da empresa, desde que:",
    "A": "Os dados tenham sido coletados no território nacional.",
    "B": "O tratamento seja realizado exclusivamente em servidores físicos.",
    "C": "A empresa possua mais de mil funcionários no Brasil.",
    "D": "Os dados sejam apenas de pessoas jurídicas.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento (...) desde que: III - os dados pessoais objeto do tratamento tenham sido coletados no território nacional.@"
  },
  {
    "QUESTÃO": "Segundo a LGPD, considera-se que os dados foram coletados no território nacional quando:",
    "A": "O titular se encontrar no Brasil no momento da coleta.",
    "B": "O servidor de backup estiver em Brasília.",
    "C": "O controlador tiver nacionalidade brasileira.",
    "D": "O dado for transmitido via satélite brasileiro.",
    "BASE": "Art. 3º § 1º Consideram-se coletados no território nacional os dados pessoais cujo titular nele se encontre no momento da coleta.@"
  },
  {
    "QUESTÃO": "A LGPD não se aplica ao tratamento de dados pessoais para fins exclusivamente:",
    "A": "De segurança pública ou atividades de investigação criminal.",
    "B": "De marketing e análise de perfil de consumo.",
    "C": "De gestão de recursos humanos em empresas privadas.",
    "D": "De atendimento ao cliente em plataformas de e-commerce.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais: (...) III - realizado para fins exclusivamente de: a) segurança pública; d) atividades de investigação e repressão de infrações penais;@"
  },
  {
    "QUESTÃO": "Como a LGPD define o \"\"titular\"\" dos dados?",
    "A": "Pessoa natural a quem se referem os dados pessoais.",
    "B": "Qualquer empresa que armazene informações de clientes.",
    "C": "O funcionário responsável por proteger o banco de dados.",
    "D": "A autoridade pública que fiscaliza o uso de informações.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se: V - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;@"
  },
  {
    "QUESTÃO": "Na definição de tratamento, qual destas atividades está incluída?",
    "A": "Classificação, utilização, acesso, processamento e arquivamento.",
    "B": "Apenas a venda de informações para terceiros.",
    "C": "Somente a coleta inicial do dado pessoal.",
    "D": "Apenas a exclusão definitiva dos dados por ordem judicial.",
    "BASE": "Art. 5º (...) X - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;@"
  },
  {
    "QUESTÃO": "O que é o \"\"relatório de impacto à proteção de dados pessoais\"\" (RIPD)?",
    "A": "Documento com a descrição dos processos de tratamento que podem gerar riscos às liberdades civis.",
    "B": "Um balanço financeiro anual das multas pagas à ANPD.",
    "C": "O registro de todos os logins e senhas dos usuários.",
    "D": "Um certificado de qualidade emitido pelo Inmetro.",
    "BASE": "Art. 5º (...) XVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco;@"
  },
  {
    "QUESTÃO": "Qual princípio define a compatibilidade do tratamento com as finalidades informadas ao titular?",
    "A": "Adequação.",
    "B": "Segurança.",
    "C": "Livre acesso.",
    "D": "Prevenção.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios: II - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;@"
  },
  {
    "QUESTÃO": "O princípio da necessidade determina que o tratamento de dados deve ser:",
    "A": "Proporcional e não excessivo em relação às finalidades pretendidas.",
    "B": "Realizado com o maior volume de dados possível para precisão.",
    "C": "Exclusivo para dados de titulares com alto poder aquisitivo.",
    "D": "Restrito apenas a dados coletados por meios biométricos.",
    "BASE": "Art. 6º (...) III - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;@"
  },
  {
    "QUESTÃO": "O princípio do livre acesso garante que o titular consulte seus dados:",
    "A": "De forma facilitada e gratuita.",
    "B": "Mediante pagamento de taxa administrativa por consulta.",
    "C": "Apenas através de requisição judicial específica.",
    "D": "Uma única vez ao ano, sem direito a cópia.",
    "BASE": "Art. 6º (...) IV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;@"
  },
  {
    "QUESTÃO": "A garantia de exatidão e atualização dos dados para o cumprimento da finalidade refere-se ao princípio da:",
    "A": "Qualidade dos dados.",
    "B": "Transparência.",
    "C": "Não discriminação.",
    "D": "Segurança.",
    "BASE": "Art. 6º (...) V - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;@"
  },
  {
    "QUESTÃO": "O princípio da transparência garante informações aos titulares, observados:",
    "A": "Os segredos comercial e industrial.",
    "B": "A vontade exclusiva do operador do sistema.",
    "C": "O sigilo imposto por contratos entre empresas.",
    "D": "A impossibilidade de acesso a dados antigos.",
    "BASE": "Art. 6º (...) VI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;@"
  },
  {
    "QUESTÃO": "O princípio da segurança exige medidas técnicas aptas a proteger os dados de:",
    "A": "Acessos não autorizados e situações acidentais de perda.",
    "B": "Atualizações automáticas do sistema operacional.",
    "C": "Consultas realizadas pelo próprio titular dos dados.",
    "D": "Pesquisas de satisfação realizadas pela própria empresa.",
    "BASE": "Art. 6º (...) VII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;@"
  },
  {
    "QUESTÃO": "A adoção de medidas para evitar a ocorrência de danos no tratamento de dados é o princípio da:",
    "A": "Prevenção.",
    "B": "Finalidade.",
    "C": "Adequação.",
    "D": "Livre acesso.",
    "BASE": "Art. 6º (...) VIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;@"
  },
  {
    "QUESTÃO": "O tratamento de dados para fins de repressão de infrações penais:",
    "A": "Não é regido por esta Lei, mas por legislação específica.",
    "B": "Deve seguir rigorosamente o princípio do livre acesso gratuito.",
    "C": "Exige consentimento por escrito do investigado.",
    "D": "É proibido se envolver dados sensíveis de terceiros.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais: (...) III - realizado para fins exclusivamente de (...) d) atividades de investigação e repressão de infrações penais; (...) § 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica;@"
  },
  {
    "QUESTÃO": "Sobre os fundamentos da LGPD, a \"\"inviolabilidade\"\" aplica-se a quais itens?",
    "A": "Da intimidade, da honra e da imagem.",
    "B": "Dos contratos, do lucro e das patentes.",
    "C": "Das senhas, dos servidores e dos firewalls.",
    "D": "Das fronteiras, do território e da soberania.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos: (...) IV - a inviolabilidade da intimidade, da honra e da imagem;@"
  },
  {
    "QUESTÃO": "No contexto da LGPD, o que se entende por \"\"uso compartilhado de dados\"\"?",
    "A": "Comunicação ou transferência de dados entre órgãos e entidades.",
    "B": "Publicação de dados pessoais em redes sociais de livre acesso.",
    "C": "Venda de bancos de dados no mercado informal de marketing.",
    "D": "Compartilhamento de senhas entre funcionários de uma empresa.",
    "BASE": "Art. 5º (...) XVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais;@"
  },
  {
    "QUESTÃO": "A disciplina da proteção de dados tem como fundamento a livre iniciativa e:",
    "A": "A livre concorrência e a defesa do consumidor.",
    "B": "O controle estatal de preços de serviços digitais.",
    "C": "A reserva de mercado para empresas nacionais.",
    "D": "O fim do segredo industrial em prol da transparência.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos: (...) VI - a livre iniciativa, a livre concorrência e a defesa do consumidor;@"
  },
  {
    "QUESTÃO": "A LGPD define o dado como \"\"identificável\"\" quando:",
    "A": "Pode ser associado a uma pessoa através de meios razoáveis.",
    "B": "É composto apenas por números aleatórios e sem nexo.",
    "C": "Está criptografado com tecnologia militar impenetrável.",
    "D": "Pertence a uma pessoa que já faleceu há mais de dez anos.",
    "BASE": "Art. 5º (...) I - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;@"
  },
  {
    "QUESTÃO": "O princípio da não discriminação veda o tratamento para fins:",
    "A": "Discriminatórios ilícitos ou abusivos.",
    "B": "Estatísticos realizados pelo IBGE.",
    "C": "De concessão de benefícios sociais pelo governo.",
    "D": "De identificação de perfis para oferta de empregos.",
    "BASE": "Art. 6º (...) IX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;@"
  },
  {
    "QUESTÃO": "De acordo com os fundamentos da LGPD, a disciplina da proteção de dados visa assegurar:",
    "A": "O exercício da cidadania pelas pessoas naturais.",
    "B": "A centralização de informações no poder executivo.",
    "C": "A padronização de perfis de consumo obrigatória.",
    "D": "O fim do sigilo bancário para fins de fiscalização.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos: (...) VII - os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania pelas pessoas naturais.@"
  },
  {
    "QUESTÃO": "A LGPD aplica-se ao tratamento de dados pessoais quando o objetivo da atividade seja:",
    "A": "A oferta ou o fornecimento de bens ou serviços a indivíduos no Brasil.",
    "B": "Apenas a exportação de dados para países da União Europeia.",
    "C": "O armazenamento de dados de pessoas jurídicas estrangeiras.",
    "D": "A vigilância de fronteiras terrestres por países vizinhos.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento (...) desde que: II - a atividade de tratamento tenha por objetivo a oferta ou o fornecimento de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional;@"
  },
  {
    "QUESTÃO": "O tratamento de dados para fins de segurança pública, defesa nacional ou segurança do Estado:",
    "A": "Será regido por legislação específica, não se submetendo integralmente à LGPD.",
    "B": "É totalmente proibido pela nova regulamentação de proteção de dados.",
    "C": "Exige autorização prévia de cada titular de dados envolvido.",
    "D": "Deve seguir as mesmas regras aplicadas ao marketing comercial.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais: (...) III - realizado para fins exclusivamente de: a) segurança pública; b) defesa nacional; c) segurança do Estado; (...) § 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica;@"
  },
  {
    "QUESTÃO": "Segundo a LGPD, o dado pessoal sobre filiação a sindicato ou a organização de caráter religioso é classificado como:",
    "A": "Dado pessoal sensível.",
    "B": "Dado público de livre acesso.",
    "C": "Dado anonimizado irreversível.",
    "D": "Dado estritamente profissional.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se: (...) II - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural;@"
  },
  {
    "QUESTÃO": "Na definição de tratamento de dados, qual destas ações é explicitamente mencionada na lei?",
    "A": "Produção, recepção, transmissão e distribuição.",
    "B": "Apenas a venda e comercialização direta.",
    "C": "Somente a criptografia de alto nível.",
    "D": "Exclusivamente a coleta via formulários digitais.",
    "BASE": "Art. 5º (...) X - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;@"
  },
  {
    "QUESTÃO": "O que caracteriza o \"\"uso compartilhado de dados\"\" segundo o Artigo 5.º?",
    "A": "Comunicação ou interconexão de dados entre órgãos e entidades públicos.",
    "B": "O ato de o titular postar os seus dados em redes sociais.",
    "C": "O envio de e-mails entre funcionários da mesma equipa.",
    "D": "A partilha de senhas de acesso entre o controlador e o operador.",
    "BASE": "Art. 5º (...) XVI - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"adequação\"\" exige que o tratamento seja compatível com:",
    "A": "As finalidades informadas ao titular, de acordo com o contexto do tratamento.",
    "B": "O lucro esperado pela empresa no final do exercício fiscal.",
    "C": "As normas internacionais de contabilidade e auditoria.",
    "D": "A capacidade de armazenamento do servidor de banco de dados.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios: (...) II - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;@"
  },
  {
    "QUESTÃO": "Sobre o princípio da \"\"qualidade dos dados\"\", o que deve ser garantido aos titulares?",
    "A": "Exatidão, clareza, relevância e atualização dos dados.",
    "B": "Que os dados sejam armazenados em formato PDF.",
    "C": "Acesso vitalício aos dados de terceiros.",
    "D": "O sigilo da identidade dos agentes de tratamento.",
    "BASE": "Art. 6º (...) V - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"segurança\"\" foca na proteção dos dados contra:",
    "A": "Acessos não autorizados e situações acidentais ou ilícitas.",
    "B": "O uso dos dados pelo titular para fins de reclamação.",
    "C": "A atualização periódica de sistemas de software.",
    "D": "A consulta pública realizada pela Autoridade Nacional.",
    "BASE": "Art. 6º (...) VII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"responsabilização e prestação de contas\"\" exige que o agente:",
    "A": "Demonstre a adoção de medidas eficazes e capazes de comprovar o cumprimento das normas.",
    "B": "Pague uma taxa anual de conformidade ao Governo Federal.",
    "C": "Contrate uma empresa de auditoria externa a cada seis meses.",
    "D": "Publique no jornal oficial todos os dados que foram tratados.",
    "BASE": "Art. 6º (...) X - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas.@"
  },
  {
    "QUESTÃO": "A disciplina da proteção de dados pessoais tem como um de seus fundamentos a inviolabilidade da:",
    "A": "Intimidade, da honra e da imagem.",
    "B": "Propriedade privada dos bancos de dados pelas empresas.",
    "C": "Liberdade de contratar sem restrições legais.",
    "D": "Soberania absoluta do controlador sobre o dado.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos: (...) IV - a inviolabilidade da intimidade, da honra e da imagem;@"
  },
  {
    "QUESTÃO": "A LGPD não se aplica ao tratamento de dados provenientes de fora do território nacional quando:",
    "A": "Não sejam objeto de comunicação ou uso compartilhado com agentes brasileiros.",
    "B": "O titular for estrangeiro, mesmo que resida permanentemente no Brasil.",
    "C": "A empresa estrangeira possuir sede física em São Paulo.",
    "D": "Os dados forem tratados por meios exclusivamente analógicos.",
    "BASE": "Art. 4º § 4º Não se submetem às obrigações previstas nesta Lei os dados provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de origem... @"
  },
  {
    "QUESTÃO": "Como a lei define \"\"consentimento\"\"?",
    "A": "Manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento.",
    "B": "Aceitação automática ao clicar em qualquer link de um site.",
    "C": "Silêncio do titular após 30 dias do recebimento de uma notificação.",
    "D": "Assinatura de um termo de uso redigido em língua estrangeira.",
    "BASE": "Art. 5º (...) XII - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;@"
  },
  {
    "QUESTÃO": "O princípio do \"\"livre acesso\"\" é uma garantia de consulta:",
    "A": "Facilitada e gratuita sobre a forma e a duração do tratamento.",
    "B": "Mediante o pagamento de custas de processamento digital.",
    "C": "Apenas para titulares que possuam assinatura digital certificada.",
    "D": "Restrita a uma vez por ano, para evitar sobrecarga no sistema.",
    "BASE": "Art. 6º (...) IV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"transparência\"\" garante aos titulares informações claras sobre:",
    "A": "A realização do tratamento e os respectivos agentes de tratamento.",
    "B": "O código-fonte proprietário dos sistemas de segurança.",
    "C": "A lista de todos os funcionários que possuem acesso físico ao servidor.",
    "D": "O histórico de crédito de todos os outros clientes da empresa.",
    "BASE": "Art. 6º (...) VI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"não discriminação\"\" proíbe o tratamento de dados para fins:",
    "A": "Discriminatórios ilícitos ou abusivos.",
    "B": "Estatísticos para políticas públicas de saúde.",
    "C": "De oferta de produtos baseada na idade do titular.",
    "D": "De verificação de identidade em transações financeiras.",
    "BASE": "Art. 6º (...) IX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;@"
  },
  {
    "QUESTÃO": "O conceito de \"\"dado anonimizado\"\" leva em conta a utilização de:",
    "A": "Meios técnicos razoáveis e disponíveis na ocasião do tratamento.",
    "B": "Criptografia que não possa ser quebrada por computadores quânticos.",
    "C": "Senhas com mais de 20 caracteres e caracteres especiais.",
    "D": "Apenas o armazenamento em discos rígidos sem ligação à internet.",
    "BASE": "Art. 5º (...) III - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento;@"
  },
  {
    "QUESTÃO": "Um dos fundamentos da LGPD é o desenvolvimento:",
    "A": "Económico e tecnológico e a inovação.",
    "B": "De mercados monopolistas de informação.",
    "C": "De técnicas de rastreio oculto de utilizadores.",
    "D": "De perfis de crédito sem transparência para o titular.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos: (...) V - o desenvolvimento econômico e tecnológico e a inovação;@"
  },
  {
    "QUESTÃO": "A LGPD aplica-se se a operação de tratamento for realizada:",
    "A": "No território nacional, independentemente do meio ou país da sede.",
    "B": "Apenas por empresas que possuam capital 100% brasileiro.",
    "C": "Exclusivamente por meios eletrónicos e digitais.",
    "D": "Somente por órgãos da administração pública federal.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento realizada por pessoa natural ou jurídica de direito público ou privado, independentemente do meio, do país de sua sede ou do país onde estejam localizados os dados, desde que: I - a operação de tratamento seja realizada no território nacional;@"
  },
  {
    "QUESTÃO": "Na estrutura da LGPD, quem é o \"\"titular\"\"?",
    "A": "Pessoa natural a quem se referem os dados pessoais.",
    "B": "O proprietário da empresa que coleta os dados.",
    "C": "O servidor onde as informações estão hospedadas.",
    "D": "A autoridade governamental que fiscaliza a lei.",
    "BASE": "Art. 5º (...) V - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;@"
  },
  {
    "QUESTÃO": "A LGPD fundamenta-se no respeito à privacidade e também na:",
    "A": "Inviolabilidade da intimidade, da honra e da imagem.",
    "B": "Divulgação irrestrita de dados para fins de transparência pública.",
    "C": "Prioridade do interesse comercial sobre a vida privada.",
    "D": "Obrigatoriedade de compartilhamento de dados entre empresas.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos: (...) IV - a inviolabilidade da intimidade, da honra e da imagem;@"
  },
  {
    "QUESTÃO": "Conforme o Art. 3.º, a LGPD aplica-se ao tratamento de dados sempre que:",
    "A": "A atividade tenha por objetivo a oferta ou o fornecimento de bens ou serviços no Brasil.",
    "B": "A sede da empresa esteja obrigatoriamente localizada em território brasileiro.",
    "C": "O titular dos dados possua exclusivamente a nacionalidade brasileira.",
    "D": "Os dados sejam armazenados apenas em servidores de propriedade estatal.",
    "BASE": "Art. 3º Esta Lei aplica-se a qualquer operação de tratamento (...) desde que: II - a atividade de tratamento tenha por objetivo a oferta ou o fornecimento de bens ou serviços ou o tratamento de dados de indivíduos localizados no território nacional;@"
  },
  {
    "QUESTÃO": "De acordo com o Art. 4.º, a LGPD NÃO se aplica ao tratamento de dados pessoais realizado para fins exclusivamente:",
    "A": "Acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei.",
    "B": "De marketing direto por empresas de tecnologia estrangeiras.",
    "C": "De recrutamento e seleção de funcionários por pessoas jurídicas.",
    "D": "Estatísticos para fins de venda de perfis de consumo a terceiros.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais: (...) II - realizado para fins exclusivamente: b) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;@"
  },
  {
    "QUESTÃO": "Como a LGPD define o processo de \"\"anonymização\"\"?",
    "A": "Utilização de meios técnicos razoáveis e disponíveis pelos quais um dado perde a possibilidade de associação direta ou indireta a um indivíduo.",
    "B": "Exclusão definitiva de todos os registros de um banco de dados físico ou digital.",
    "C": "Criptografia dos dados que permite a reversão mediante uso de chave mestra.",
    "D": "Alteração do nome do titular por um apelido ou código numérico secreto.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se: XI - anonimização: utilização de meios técnicos razoáveis e disponíveis na ocasião do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;@"
  },
  {
    "QUESTÃO": "No contexto da LGPD, o que se entende por \"\"transferência internacional de dados\"\"?",
    "A": "Transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro.",
    "B": "Envio de e-mails corporativos entre funcionários de diferentes filiais no Brasil.",
    "C": "Publicação de dados pessoais em redes sociais acessíveis apenas em território nacional.",
    "D": "Backup de arquivos em discos rígidos externos transportados entre estados brasileiros.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se: XV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"adequação\"\" refere-se à:",
    "A": "Compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto.",
    "B": "Necessidade de utilizar apenas as tecnologias mais caras do mercado.",
    "C": "Obrigação de adaptar o site da empresa às normas de acessibilidade.",
    "D": "Garantia de que todos os dados sejam apagados após 24 horas de uso.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios: II - adequação: compatibilidade do tratamento com as finalidades informadas ao titular, de acordo com o contexto do tratamento;@"
  },
  {
    "QUESTÃO": "Um dos fundamentos da proteção de dados é a defesa do consumidor e a:",
    "A": "Livre iniciativa e a livre concorrência.",
    "B": "Estatização dos meios de comunicação digital.",
    "C": "Proibição de lucros oriundos de serviços tecnológicos.",
    "D": "Censura prévia de opiniões contrárias ao controlador.",
    "BASE": "Art. 2º A disciplina da proteção de dados pessoais tem como fundamentos: VI - a livre iniciativa, a livre concorrência e a defesa do consumidor;@"
  },
  {
    "QUESTÃO": "Para fins de aplicação da LGPD, considera-se que os dados foram coletados no Brasil se o titular:",
    "A": "Estiver no território nacional no momento da coleta.",
    "B": "Tiver nascido no Brasil, independentemente de onde resida.",
    "C": "Utilizar um dispositivo fabricado por empresa brasileira.",
    "D": "Acessar um site cujo domínio termine obrigatoriamente em \"\".br\"\".",
    "BASE": "Art. 3º § 1º Consideram-se coletados no território nacional os dados pessoais cujo titular nele se encontre no momento da coleta.@"
  },
  {
    "QUESTÃO": "O tratamento de dados para fins de segurança do Estado e defesa nacional é regido por:",
    "A": "Legislação específica, que deve prever medidas proporcionais e estritas ao interesse público.",
    "B": "Pelas mesmas regras aplicadas às redes sociais de entretenimento.",
    "C": "Pela vontade exclusiva e soberana do Diretor de Tecnologia da informação.",
    "D": "Por tratados internacionais que anulam a validade da LGPD no Brasil.",
    "BASE": "Art. 4º (...) § 1º O tratamento de dados pessoais previsto no inciso III [segurança pública, defesa nacional, etc] será regido por legislação específica... @"
  },
  {
    "QUESTÃO": "O que a LGPD define como \"\"relatório de impacto à proteção de dados pessoais\"\"?",
    "A": "Documentação do controlador com a descrição dos processos que podem gerar riscos às liberdades civis.",
    "B": "Balanço contábil que detalha o investimento em antivírus e firewalls.",
    "C": "Lista pública contendo o nome de todos os titulares que pediram exclusão de dados.",
    "D": "Registro de todas as vezes que o servidor ficou offline por problemas técnicos.",
    "BASE": "Art. 5º (...) XVII - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais... @"
  },
  {
    "QUESTÃO": "O princípio da \"\"necessidade\"\" estabelece que o tratamento deve ser limitado ao:",
    "A": "Mínimo necessário para a realização de suas finalidades, com abrangência de dados pertinentes.",
    "B": "Máximo de informações que o controlador conseguir extrair do titular.",
    "C": "Uso de dados sensíveis apenas, descartando-se os dados pessoais comuns.",
    "D": "Período de tempo em que a empresa mantiver o seu registro comercial ativo.",
    "BASE": "Art. 6º (...) III - necessidade: limitação do tratamento ao mínimo necessário para a realização de suas finalidades, com abrangência dos dados pertinentes, proporcionais e não excessivos em relação às finalidades do tratamento de dados;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"qualidade dos dados\"\" garante ao titular a:",
    "A": "Relevância e atualização dos dados de acordo com a finalidade do tratamento.",
    "B": "Possibilidade de vender os seus próprios dados para outras empresas.",
    "C": "Certeza de que seus dados nunca serão vistos por nenhum ser humano.",
    "D": "Garantia de que os dados serão convertidos em moedas digitais.",
    "BASE": "Art. 6º (...) V - qualidade dos dados: garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados, de acordo com a necessidade e para o cumprimento da finalidade de seu tratamento;@"
  },
  {
    "QUESTÃO": "A disciplina da proteção de dados pessoais tem como fundamento os direitos humanos e:",
    "A": "O livre desenvolvimento da personalidade e a dignidade.",
    "B": "A obrigatoriedade de identificação biométrica em locais públicos.",
    "C": "O fim do direito ao anonimato em qualquer circunstância digital.",
    "D": "A subordinação da ética aos avanços da inteligência artificial.",
    "BASE": "Art. 2º (...) VII - os direitos humanos, o livre desenvolvimento da personalidade, a dignidade e o exercício da cidadania pelas pessoas naturais.@"
  },
  {
    "QUESTÃO": "A LGPD NÃO se aplica a dados provenientes de fora do território nacional quando:",
    "A": "Não forem objeto de comunicação ou uso compartilhado com agentes brasileiros.",
    "B": "O tratamento for realizado por empresa com menos de 10 funcionários.",
    "C": "Os dados se referirem a transações financeiras internacionais.",
    "D": "O titular dos dados for uma autoridade pública de outro país.",
    "BASE": "Art. 4º (...) § 4º Não se submetem às obrigações previstas nesta Lei os dados provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de origem... @"
  },
  {
    "QUESTÃO": "Segundo a LGPD, o \"\"controlador\"\" e o \"\"operador\"\" são referidos conjuntamente como:",
    "A": "Agentes de tratamento.",
    "B": "Fiscais de dados.",
    "C": "Gestores de privacidade.",
    "D": "Autoridades de controle.",
    "BASE": "Art. 5º (...) IX - agentes de tratamento: o controlador e o operador;@"
  },
  {
    "QUESTÃO": "O princípio do \"\"livre acesso\"\" permite ao titular consultar:",
    "A": "A integralidade de seus dados pessoais de forma facilitada e gratuita.",
    "B": "Os dados pessoais de seus familiares sem autorização prévia.",
    "C": "Os lucros líquidos da empresa obtidos com o uso de seus dados.",
    "D": "A lista de todos os outros usuários que utilizam o mesmo serviço.",
    "BASE": "Art. 6º (...) IV - livre acesso: garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento, bem como sobre a integralidade de seus dados pessoais;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"prevenção\"\" exige a adoção de medidas para:",
    "A": "Prevenir a ocorrência de danos em virtude do tratamento de dados pessoais.",
    "B": "Impedir que novos concorrentes entrem no mercado de tecnologia.",
    "C": "Bloquear o acesso do titular aos seus próprios dados sensíveis.",
    "D": "Evitar que o governo fiscalize as operações de tratamento de dados.",
    "BASE": "Art. 6º (...) VIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;@"
  },
  {
    "QUESTÃO": "Conforme o Art. 2.º, a proteção de dados também se fundamenta na liberdade de:",
    "A": "Expressão, de informação, de comunicação e de opinião.",
    "B": "Alterar o nome civil sem necessidade de processo judicial.",
    "C": "Recusar a entrega de qualquer documento a autoridades policiais.",
    "D": "Criar perfis falsos em redes sociais para fins de pesquisa de mercado.",
    "BASE": "Art. 2º (...) III - a liberdade de expressão, de informação, de comunicação e de opinião;@"
  },
  {
    "QUESTÃO": "A LGPD define o \"\"encarregado\"\" como a pessoa indicada pelo controlador para:",
    "A": "Atuar como canal de comunicação entre controlador, titulares e a ANPD.",
    "B": "Realizar a manutenção física dos servidores e cabos de rede.",
    "C": "Decidir sozinho sobre a exclusão de dados sensíveis da empresa.",
    "D": "Representar legalmente os titulares em processos contra o Estado.",
    "BASE": "Art. 5º (...) VIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD);@"
  },
  {
    "QUESTÃO": "O princípio da \"\"não discriminação\"\" veda o tratamento para fins:",
    "A": "Discriminatórios ilícitos ou abusivos.",
    "B": "De personalização de ofertas com base em compras anteriores.",
    "C": "De segmentação de público por localização geográfica permitida.",
    "D": "De identificação de riscos de saúde para tratamentos médicos autorizados.",
    "BASE": "Art. 6º (...) IX - não discriminação: impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos;@"
  },
  {
    "QUESTÃO": "De acordo com o Art. 4.º, a LGPD não se aplica ao tratamento de dados realizado para fins exclusivamente:",
    "A": "Jornalísticos e artísticos.",
    "B": "Publicitários e de propaganda política.",
    "C": "De análise de crédito e gestão de riscos.",
    "D": "De histórico de navegação para fins de e-commerce.",
    "BASE": "Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais: (...) II - realizado para fins exclusivamente: a) jornalístico e artístico;@"
  },
  {
    "QUESTÃO": "Conforme as definições da LGPD, o que é um \"\"banco de dados\"\"?",
    "A": "Conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrónico ou físico.",
    "B": "Um software de processamento de texto utilizado para redigir contratos.",
    "C": "Apenas a coleção de dados sensíveis armazenada em servidores governamentais.",
    "D": "Qualquer arquivo digital protegido obrigatoriamente por criptografia de ponta a ponta.",
    "BASE": "Art. 5º Para os fins desta Lei, considera-se: (...) IV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;@"
  },
  {
    "QUESTÃO": "O princípio da \"\"transparência\"\" garante aos titulares informações sobre a realização do tratamento, desde que observados:",
    "A": "Os segredos comercial e industrial.",
    "B": "Os interesses financeiros dos investidores da empresa.",
    "C": "A conveniência administrativa do controlador dos dados.",
    "D": "O sigilo imposto por códigos de conduta internos não públicos.",
    "BASE": "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios: (...) VI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;@"
  }
]

export const action = async ({ request }: ActionFunctionArgs) => {
  await deleteAllQuesions()
  for (let question of questions) {
    await createQuestion({ question: question.QUESTÃO, alternativaA: question.A, alternativaB: question.B, alternativaC: question.C, alternativaD: question.D, base: question.BASE });
  }
  return json({ errors: { pronto: "Pronto!!!" } });
};

export default function NewQuestionPage() {
  const actionData = useActionData<{ errors: ActionErrors }>();
  return (
    <Form
      method="post"
    >
      <div className="text-center text-2xl font-bold">Criar Questão</div>
      {actionData?.errors.pronto && (
        <div className="rounded bg-green-100 p-4 text-green-700">
          {actionData.errors.pronto}
        </div>
      )}
      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
