<?php

namespace Sae\Service;

use Core\Service\ServiceException;
use Sae\Entity\DisciplinaHorario as DisciplinaHorarioEntity;
use Sae\Entity\Espaco as EspacoEntity;

/**
 * Classe responsável por gerenciar disciplinas e seus horários no sistema acadêmico
 * Sistema legado de 2008 - SAE (Sistema de Alocação de Espaços)
 */
class DisciplinaHorario extends Service
{

    /**
     * Salva informações de uma disciplina horário (alunos matriculados)
     * Utilizado para atualizar quantidade de alunos em disciplinas já existentes
     * 
     * @param array $valuesPost Dados vindos do formulário POST
     * @return array Resposta da operação (vazio por padrão)
     */
    public function saveDisciplinaHorario($valuesPost)
    {
        $resposta = array();

        // Busca a disciplina horário pelo ID fornecido
        $disciplina_horario = $this->getObjectManager()->getRepository('\Sae\Entity\DisciplinaHorario')
        ->find(array('id' => $valuesPost[0]['cod_disciplina_horario']));

        // Se encontrou a disciplina, atualiza os dados de alunos
        if (isset($disciplina_horario)) {
            // Atualiza lista de alunos se fornecida
            if(isset($valuesPost[0]['alunos'])){
                $disciplina_horario->setAlunos($valuesPost[0]['alunos']);
            }
            // Atualiza número total de alunos se fornecido
            if(isset($valuesPost[0]['n_alunos'])){
                $disciplina_horario->setNAlunos($valuesPost[0]['n_alunos']);
            }
            // Prepara a entidade para ser salva no banco
            $this->getObjectManager()->persist($disciplina_horario);
        }
        // Executa todas as operações pendentes no banco de dados
        $this->getObjectManager()->flush();

        return $resposta;
    }    /**
     * Vincula/compartilha duas disciplinas com horários similares
     * Permite que disciplinas compartilhem o mesmo espaço físico quando têm horários compatíveis
     * 
     * @param array $values Dados das disciplinas (principal e secundária)
     * @return bool True se conseguiu vincular, False caso contrário
     */
    public function vinculaDisciplinaHorario($values)
    {
        $return = false;
        
        // Busca o processo de alocação ativo no sistema
        $processoAlocacao = $this->getObjectManager()
            ->getRepository('\Sae\Entity\ProcessoAlocacao')
            ->findOneBy(array('status_parametro' => 1), array('id' => 'desc'));
            
        // Obtém o ano e período base para as consultas
        $anoPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')
            ->getAnoEPeriodoBase();
            
        // Monta array com dados da disciplina principal (que já tem espaço alocado)
        $arrayDisciplinaPrincipal = array(
            'coddisc' => $values['cod_disc_principal'],
            'codturma' => $values['cod_turma_principal'],
            'codgrade' => $values['cod_grade_principal'],
            'anobase' => $anoPeriodoBase['anobase'],
            'periodobase' => $anoPeriodoBase['periodobase']
        );
        
        // Monta array com dados da disciplina secundária (que será compartilhada)
        $arrayDisciplinaSecundaria = array(
            'coddisc' => $values['disciplina'],
            'codturma' => trim($values['cod_turma']),            'codgrade' => $values['grade'],
            'anobase' => $anoPeriodoBase['anobase'],
            'periodobase' => $anoPeriodoBase['periodobase']
        );

        // Validação: impede que uma disciplina seja compartilhada consigo mesma
        if (!array_diff($arrayDisciplinaPrincipal, $arrayDisciplinaSecundaria))
            throw new ServiceException("Não é possível compartilhar a disciplina com ela mesma");

            // Busca todos os horários da disciplina principal
            $disciplina_principal = $this->getObjectManager()
                ->getRepository('\Sae\Entity\DisciplinaHorario')
                ->findBy($arrayDisciplinaPrincipal);

            // Busca todos os horários da disciplina secundária
            $disciplina_secundaria = $this->getObjectManager()
                ->getRepository('\Sae\Entity\DisciplinaHorario')
                ->findBy($arrayDisciplinaSecundaria);

            // Loop através de todos os horários das disciplinas
            foreach ($disciplina_principal as $dp) {
                foreach ($disciplina_secundaria as $ds) {

                    // Verifica se as disciplinas têm a mesma data inicial (mesmo dia)
                    if ($dp->getDataInicial() == $ds->getDataInicial()) {

                        // Verifica se a disciplina secundária ainda não está compartilhada com a principal
                        if (!$dp->getFinalidadesCompartilhadas()->contains($ds)) {
                            // Adiciona a disciplina secundária como compartilhada da principal
                            $dp->getFinalidadesCompartilhadas()->add($ds);
                            $this->getObjectManager()->persist($dp);

                            // Se a disciplina principal já tem espaço alocado, compartilha com a secundária
                            if (count($dp->getEspacoFinalidadeAlocado()) > 0) {
                                $espaco = $dp->getEspacoFinalidadeAlocado()[0]->getEspaco();
                                $this->compartilhaDisciplinaHorario($dp, $espaco, $processoAlocacao);
                            }

                            $return = true;
                        }
                    }
                }
            }        // Salva todas as alterações no banco de dados
        $this->getObjectManager()->flush();

        return $return;
    }

    /**
     * Vincula múltiplas disciplinas de turmas diferentes com uma disciplina principal
     * Versão estendida do método anterior para trabalhar com várias disciplinas simultaneamente
     * 
     * @param array $values Dados da disciplina principal e array de disciplinas secundárias
     * @return bool True se conseguiu vincular pelo menos uma, False caso contrário
     */
    public function vinculaDisciplinasHorariosTurmasDiferentes($values)
    {
        $return = false;
        
        // Busca processo de alocação ativo
        $processoAlocacao = $this->getObjectManager()->getRepository('\Sae\Entity\ProcessoAlocacao')
            ->findOneBy(array('status_parametro' => 1), array('id' => 'desc'));
            
        // Obtém ano e período base
        $anoPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')->getAnoEPeriodoBase();
        
        // Dados da disciplina principal (que já tem espaço)
        $arrayDisciplinaPrincipal = array(
            'coddisc' => $values['cod_disc_principal'],
            'codturma' => $values['cod_turma_principal'],
            'codgrade' => $values['cod_grade_principal'],
            'anobase' => $anoPeriodoBase['anobase'],
            'periodobase' => $anoPeriodoBase['periodobase']
        );

        $arrayDisciplinasSecundarias = array();

        // Processa cada disciplina secundária fornecida
        foreach ($values['outras_disciplinas'] as $key => $outra_disciplina) {
            if (isset($outra_disciplina['cod_disc'])) {
                // Monta array de dados para cada disciplina secundária
                $arrayDisciplinasSecundarias[$key] = array(
                    'coddisc' => $outra_disciplina['cod_disc'],
                    'codturma' => trim($outra_disciplina['cod_turma']),
                    'codgrade' => $outra_disciplina['cod_grade'],
                    'anobase' => $anoPeriodoBase['anobase'],
                    'periodobase' => $anoPeriodoBase['periodobase']
                );

                // Validação: impede auto-compartilhamento
                if (!array_diff($arrayDisciplinaPrincipal, $arrayDisciplinasSecundarias[$key]))
                    throw new ServiceException("Não é possível compartilhar a disciplina com ela mesma");
            }
        }

        // Busca disciplina principal ordenada por data e hora
        $disciplina_principal = $this->getObjectManager()
            ->getRepository('\Sae\Entity\DisciplinaHorario')
            ->findBy($arrayDisciplinaPrincipal, array('data_inicial' => 'ASC', 'hora_inicio' => 'ASC'));

        // Processa cada disciplina secundária
        foreach ($arrayDisciplinasSecundarias as $arrayDisciplinaSecundaria){
            // Busca horários da disciplina secundária atual
            $disciplina_secundaria = $this->getObjectManager()
                ->getRepository('\Sae\Entity\DisciplinaHorario')
                ->findBy($arrayDisciplinaSecundaria,array('data_inicial' => 'ASC', 'hora_inicio' => 'ASC'));

            // Compara cada horário da principal com cada horário da secundária
            foreach ($disciplina_principal as $dp) {
                    foreach ($disciplina_secundaria as $ds) {
                        // Se têm a mesma data, podem compartilhar espaço
                        if ($dp->getDataInicial() == $ds->getDataInicial()) {

                            // Verifica se ainda não estão compartilhadas
                            if (!$dp->getFinalidadesCompartilhadas()->contains($ds)) {
                                    // Adiciona compartilhamento
                                    $dp->getFinalidadesCompartilhadas()->add($ds);
                                    $this->getObjectManager()->persist($dp);

                                    // Se principal tem espaço, compartilha com secundária
                                    if (count($dp->getEspacoFinalidadeAlocado()) > 0) {
                                        $espaco = $dp->getEspacoFinalidadeAlocado()[0]->getEspaco();
                                        $this->compartilhaDisciplinaHorario($dp, $espaco, $processoAlocacao);
                                    }

                                    $return = true;
                            }
                        }
                    }
                }
        }        // Salva alterações no banco
        $this->getObjectManager()->flush();

        return $return;
    }

     /**
     * Vincula disciplinas da mesma fase/período acadêmico
     * Permite compartilhamento baseado em turnos (manhã, tarde, noite) da mesma fase curricular
     * 
     * @param array $values Dados da disciplina principal e disciplinas da mesma fase
     * @return bool True se conseguiu vincular, False caso contrário
     */
    public function vinculaDisciplinasMesmaFase($values)
    {
        $return = false;
        
        // Busca processo de alocação ativo
        $processoAlocacao = $this->getObjectManager()->getRepository('\Sae\Entity\ProcessoAlocacao')
            ->findOneBy(array('status_parametro' => 1), array('id' => 'desc'));
            
        $anoPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')->getAnoEPeriodoBase();
        
        // Dados da disciplina principal
        $arrayDisciplinaPrincipal = array(
            'coddisc' => $values['cod_disc_principal'],
            'codturma' => $values['cod_turma_principal'],
            'codgrade' => $values['cod_grade_principal'],
            'anobase' => $anoPeriodoBase['anobase'],
            'periodobase' => $anoPeriodoBase['periodobase']
        );

        $arrayDisciplinasSecundarias = array();

        // Processa disciplinas da mesma fase
        foreach ($values['outras_disciplinas_fase'] as $key => $outra_disciplina) {
            if (isset($outra_disciplina['cod_disc'])) {
                $arrayDisciplinasSecundarias[$key] = array(
                    'coddisc' => $outra_disciplina['cod_disc'],
                    'codturma' => trim($outra_disciplina['cod_turma']),
                    'codgrade' => $outra_disciplina['cod_grade'],
                    'anobase' => $anoPeriodoBase['anobase'],
                    'periodobase' => $anoPeriodoBase['periodobase']
                );

                // Validação contra auto-compartilhamento
                if (!array_diff($arrayDisciplinaPrincipal, $arrayDisciplinasSecundarias[$key]))
                    throw new ServiceException("Não é possível compartilhar a disciplina com ela mesma");
            }
        }

        // Para cada disciplina secundária da mesma fase
        foreach ($arrayDisciplinasSecundarias as $arrayDisciplinaSecundaria){
            $disciplina_secundaria = $this->getObjectManager()
                ->getRepository('\Sae\Entity\DisciplinaHorario')
                ->findBy($arrayDisciplinaSecundaria,array('data_inicial' => 'ASC', 'hora_inicio' => 'ASC'));

            // Para cada horário da disciplina secundária
            foreach ($disciplina_secundaria as $ds){
                // Configura busca por data específica (dia inteiro)
                $arrayDisciplinaPrincipal['data_inicial'] = $ds->getDataInicial()->format('Y-m-d').' 00:00:00';
                $arrayDisciplinaPrincipal['data_final'] = $ds->getDataInicial()->format('Y-m-d').' 23:59:59';

                // Define faixas de horário baseadas no turno da disciplina secundária
                // Manhã: 7:00 às 12:00
                if ($ds->getHoraInicio() <= 1200) {
                    $arrayDisciplinaPrincipal['hora_inicio'] = 700;
                    $arrayDisciplinaPrincipal['hora_final'] = 1200;
                }
                // Tarde: 12:01 às 18:59  
                else if ($ds->getHoraInicio() > 1200 && $ds->getHoraInicio() < 1900){
                    $arrayDisciplinaPrincipal['hora_inicio'] = 1201;
                    $arrayDisciplinaPrincipal['hora_final'] = 1859;
                }
                // Noite: 19:00 às 23:00
                else{
                    $arrayDisciplinaPrincipal['hora_inicio'] = 1900;
                    $arrayDisciplinaPrincipal['hora_final'] = 2300;
                }

                // Busca disciplina principal no mesmo dia e turno
                $select = $this->getObjectManager()
                    ->createQueryBuilder()
                    ->select('DisciplinaHorario')
                    ->from('\Sae\Entity\DisciplinaHorario', 'DisciplinaHorario')
                    ->where('DisciplinaHorario.coddisc = :coddisc')
                    ->andWhere('DisciplinaHorario.codturma = :codturma')
                    ->andWhere('DisciplinaHorario.codgrade = :codgrade')
                    ->andWhere('DisciplinaHorario.anobase = :anobase')
                    ->andWhere('DisciplinaHorario.periodobase = :periodobase')
                    ->andWhere('DisciplinaHorario.data_inicial >= :data_inicial and DisciplinaHorario.data_inicial <= :data_final')
                    ->andWhere('(DisciplinaHorario.hora_inicio BETWEEN :hora_inicio and :hora_final)')
                    ->setParameters($arrayDisciplinaPrincipal);
                $disciplina_principal = $select->getQuery()->getResult();

                // Se encontrou disciplina principal compatível
                if (isset($disciplina_principal[0])) {

                    // Verifica se não estão já compartilhadas
                    if (!$disciplina_principal[0]->getFinalidadesCompartilhadas()
                        ->contains($ds)) {

                        // Adiciona compartilhamento
                        $disciplina_principal[0]->getFinalidadesCompartilhadas()
                            ->add($ds);
                        $this->getObjectManager()->persist($disciplina_principal[0]);

                        // Se disciplina principal tem espaço alocado, compartilha
                        if (count($disciplina_principal[0]->getEspacoFinalidadeAlocado()) > 0) {
                            $espaco = $disciplina_principal[0]->getEspacoFinalidadeAlocado()[0]->getEspaco();
                            
                            // Limpa cache da disciplina secundária
                            $cache_espaco_alocado_disciplina = 'espaco_alocado_disciplina' . $ds->getAnobase() . $ds->getPeriodobase() . $ds->getCodturma() . $ds->getCodgrade() . $ds->getCoddisc();
                            $this->getService('Cache')->delete($cache_espaco_alocado_disciplina);
                            
                            // Cria nova alocação de espaço para disciplina secundária
                            $espacoFinalidadeAlocado = new \Sae\Entity\EspacoFinalidadeAlocado();
                            $espacoFinalidadeAlocado->setEspaco($espaco);
                            $espacoFinalidadeAlocado->setProcesso($processoAlocacao);
                            $espacoFinalidadeAlocado->setFinalidade($ds);
                            $espacoFinalidadeAlocado->setDataAula($ds->getDataInicial());
                            $espacoFinalidadeAlocado->setHoraInicio($ds->getHoraInicio());
                            $espacoFinalidadeAlocado->setHoraFim($ds->getHoraFinal());
                            $espacoFinalidadeAlocado->setDataAlocacao(new \DateTime());
                            $this->getObjectManager()->persist($espacoFinalidadeAlocado);
                        }
                    }
                    $return = true;
                }
            }
        }        // Salva todas as alterações
        $this->getObjectManager()->flush();

        return $return;
    }

    /**
     * Compartilha o espaço físico de uma disciplina principal com suas disciplinas compartilhadas
     * Método auxiliar que gerencia a alocação física dos espaços entre disciplinas vinculadas
     * 
     * @param DisciplinaHorarioEntity $disciplinaHorario Disciplina principal que possui o espaço
     * @param EspacoEntity $espaco Espaço físico a ser compartilhado
     * @param \Sae\Entity\ProcessoAlocacao $processoAlocacao Processo de alocação ativo
     * @param bool $maisDeUmEspaco Flag para indicar se há múltiplos espaços
     */
    public function compartilhaDisciplinaHorario(
        DisciplinaHorarioEntity $disciplinaHorario,
        EspacoEntity $espaco,
        \Sae\Entity\ProcessoAlocacao $processoAlocacao,
        $maisDeUmEspaco = false
    )
    {
        // Para cada disciplina compartilhada com a principal
        foreach ($disciplinaHorario->getFinalidadesCompartilhadas() as $disciplinaCompartilhada) {
            // Monta chave do cache para esta disciplina
            $cache_espaco_alocado_disciplina = 'espaco_alocado_disciplina' . $disciplinaCompartilhada->getAnobase() . $disciplinaCompartilhada->getPeriodobase() . $disciplinaCompartilhada->getCodturma() . $disciplinaCompartilhada->getCodgrade() . $disciplinaCompartilhada->getCoddisc();
            // Limpa cache da disciplina
            $this->getService('Cache')->delete($cache_espaco_alocado_disciplina);

            // Busca alocação existente da disciplina compartilhada
            if ($maisDeUmEspaco == false) {
                // Busca qualquer alocação da disciplina
                $espacoFinalidadeAlocado = $this->getObjectManager()
                    ->getRepository('\Sae\Entity\EspacoFinalidadeAlocado')
                    ->findOneBy(array('finalidade' => $disciplinaCompartilhada));
            } else {
                // Busca alocação específica para este espaço
                $espacoFinalidadeAlocado = $this->getObjectManager()
                    ->getRepository('\Sae\Entity\EspacoFinalidadeAlocado')
                    ->findOneBy(array('finalidade' => $disciplinaCompartilhada, 'espaco' => $espaco));
            }

            // Remove alocação anterior se existir
            if ($espacoFinalidadeAlocado)
                $this->getService('Sae\Service\Alocacao')
                    ->removeEspacoFinalidadeAlocado($espacoFinalidadeAlocado);

            // Cria nova alocação para a disciplina compartilhada
            $espacoFinalidadeAlocado = new \Sae\Entity\EspacoFinalidadeAlocado();
            $espacoFinalidadeAlocado->setEspaco($espaco);
            $espacoFinalidadeAlocado->setProcesso($processoAlocacao);
            $espacoFinalidadeAlocado->setFinalidade($disciplinaCompartilhada);
            $espacoFinalidadeAlocado->setDataAula($disciplinaCompartilhada->getDataInicial());
            $espacoFinalidadeAlocado->setHoraInicio($disciplinaCompartilhada->getHoraInicio());
            $espacoFinalidadeAlocado->setHoraFim($disciplinaCompartilhada->getHoraFinal());
            $espacoFinalidadeAlocado->setDataAlocacao(new \DateTime());
            
            // Remove possíveis conflitos de horário
            $this->getService('Sae\Service\Alocacao')->removeChoqueFinalidade($disciplinaCompartilhada);
            $this->getObjectManager()->persist($espacoFinalidadeAlocado);
        }

        // Salva todas as alterações
        $this->getObjectManager()->flush();
    }    /**
     * Remove o compartilhamento de espaço quando uma disciplina perde sua alocação
     * Usado quando uma disciplina principal fica sem espaço físico alocado
     * 
     * @param DisciplinaHorarioEntity $disciplinaHorario Disciplina que perdeu o espaço
     */
    public function compartilhaDisciplinaHorarioEspacoVazio(DisciplinaHorarioEntity $disciplinaHorario)
    {
        // Para cada disciplina que estava compartilhando espaço
        foreach ($disciplinaHorario->getFinalidadesCompartilhadas() as $disciplinaCompartilhada) {
            // Limpa cache da disciplina compartilhada
            $cache_espaco_alocado_disciplina = 'espaco_alocado_disciplina' . $disciplinaCompartilhada->getAnobase() . $disciplinaCompartilhada->getPeriodobase() . $disciplinaCompartilhada->getCodturma() . $disciplinaCompartilhada->getCodgrade() . $disciplinaCompartilhada->getCoddisc();
            $this->getService('Cache')->delete($cache_espaco_alocado_disciplina);
            
            // Busca alocação de espaço da disciplina compartilhada
            $espacoFinalidadeAlocado = $this->getObjectManager()->getRepository('\Sae\Entity\EspacoFinalidadeAlocado')
                ->findOneBy(array('finalidade' => $disciplinaCompartilhada));
                
            // Parâmetros para remoção de conflitos
            $params = array(
                'cod_turma' => $disciplinaCompartilhada->getCodturma(),
                'grade' => $disciplinaCompartilhada->getCodgrade(),
                'cod_disc' => $disciplinaCompartilhada->getCoddisc()
                );
            // Remove conflitos de finalidades    
            $this->getService('Sae\Service\Alocacao')->removeChoqueFinalidades($params);

            // Remove a alocação de espaço se existir
            if ($espacoFinalidadeAlocado) {
                $this->getObjectManager()->remove($espacoFinalidadeAlocado);
            }
        }

        // Remove conflitos da disciplina principal também
        $this->getService('Sae\Service\Alocacao')->removeChoqueFinalidade($disciplinaHorario);

        // Salva alterações
        $this->getObjectManager()->flush();
    }    /**
     * Retorna lista de disciplinas que compartilham espaço com uma disciplina específica
     * Útil para exibir na interface quais disciplinas estão vinculadas
     * 
     * @param string $cod_disc Código da disciplina
     * @param string $cod_turma Código da turma
     * @param string $cod_grade Código da grade curricular
     * @return array Lista de disciplinas compartilhadas e principais
     */
    public function getDisciplinasCompartilhadas($cod_disc, $cod_turma, $cod_grade)
    {
        // Obtém período acadêmico atual
        $anoPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')->getAnoEPeriodoBase();
        
        // Busca todos os horários da disciplina informada
        $disciplinaHorario = $this->getObjectManager()->getRepository('\Sae\Entity\DisciplinaHorario')
            ->findBy(array(
                'coddisc' => $cod_disc,
                'codturma' => $cod_turma,
                'codgrade' => $cod_grade,
                'anobase' => $anoPeriodoBase['anobase'],
                'periodobase' => $anoPeriodoBase['periodobase']
            ));

        $compartilhadas = array();

        // Percorre horários para encontrar disciplinas compartilhadas (secundárias)
        foreach($disciplinaHorario as $dh) {
            foreach ($dh->getFinalidadesCompartilhadas() as $finalidadesCompartilhadas) {
                // Usa código da disciplina + turma como chave única
                $chave = $finalidadesCompartilhadas->getCoddisc().$finalidadesCompartilhadas->getCodturma();
                $compartilhadas[$chave]['coddisc'] = $finalidadesCompartilhadas->getCoddisc();
                $compartilhadas[$chave]['codturma'] = $finalidadesCompartilhadas->getCodturma();
                $compartilhadas[$chave]['codgrade'] = $finalidadesCompartilhadas->getCodgrade();
                $compartilhadas[$chave]['nomdisc'] = $finalidadesCompartilhadas->getNomeDisciplina();
            }
        }

        $principais = array();

        // Percorre horários para encontrar disciplinas principais (que esta disciplina compartilha)
        foreach($disciplinaHorario as $dh) {
            foreach ($dh->getFinalidadesPrincipais() as $finalidadesPrincipais) {
                $chave = $finalidadesPrincipais->getCoddisc() . $finalidadesPrincipais->getCodturma();
                $principais[$chave]['coddisc'] = $finalidadesPrincipais->getCoddisc();
                $principais[$chave]['codturma'] = $finalidadesPrincipais->getCodturma();
                $principais[$chave]['codgrade'] = $finalidadesPrincipais->getCodgrade();
                $principais[$chave]['nomdisc'] = $finalidadesPrincipais->getNomeDisciplina();
            }
        }
        
        // Junta disciplinas compartilhadas e principais em um único array
        $result = array_merge($compartilhadas, $principais);

        return $result;
    }    /**
     * Remove o compartilhamento entre duas disciplinas específicas
     * Desfaz a vinculação e remove alocações de espaço da disciplina compartilhada
     * 
     * @param array $params Parâmetros das disciplinas a descompartilhar
     */
    public function removeCompartilhamento($params)
    {
        $anoPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')->getAnoEPeriodoBase();
        
        // Busca as disciplinas principais (que têm o espaço original)
        $finalidades_principais = $this->getObjectManager()
            ->getRepository('\Sae\Entity\DisciplinaHorario')
            ->findBy(array(
                'coddisc' => $params['cod_disc'],
                'codturma' => $params['cod_turma'],
                'codgrade' => $params['cod_grade'],
                'anobase' => $anoPeriodoBase['anobase'],
                'periodobase' => $anoPeriodoBase['periodobase']
            ));

        // Para cada horário da disciplina principal
        foreach ($finalidades_principais as $finalidade_principal) {

            // Procura pela disciplina compartilhada específica para remover
            foreach ($finalidade_principal->getFinalidadesCompartilhadas() as $finalidade_compartilhada) {
                // Verifica se é a disciplina que deve ser removida do compartilhamento
                if ($finalidade_compartilhada->getCoddisc() == $params['cod_disc_compartilhada']
                    && $finalidade_compartilhada->getCodturma() == $params['cod_turma_compartilhada']
                    && $finalidade_compartilhada->getCodgrade() == $params['cod_grade_compartilhada']) {

                    // Remove todas as alocações de espaço da disciplina compartilhada
                    foreach($finalidade_compartilhada->getEspacoFinalidadeAlocado() as $espaco_alocado) {
                        $this->getObjectManager()->remove($espaco_alocado);
                    }

                    // Limpa cache da disciplina
                    $cache_espaco_alocado_disciplina = 'espaco_alocado_disciplina' . $finalidade_compartilhada->getAnobase() . $finalidade_compartilhada->getPeriodobase() . $finalidade_compartilhada->getCodturma() . $finalidade_compartilhada->getCodgrade() . $finalidade_compartilhada->getCoddisc();
                    $this->getService('Cache')->delete($cache_espaco_alocado_disciplina);
                    
                    // Remove a disciplina da lista de compartilhadas
                    $finalidade_principal->getFinalidadesCompartilhadas()->removeElement($finalidade_compartilhada);
                    $this->getObjectManager()->persist($finalidade_principal);
                }
            }
        }

        // Salva alterações
        $this->getObjectManager()->flush();
    }    /**
     * Busca outras turmas que oferecem a mesma disciplina (mesmo código e grade)
     * Usado para sugerir disciplinas candidatas ao compartilhamento
     * 
     * @param string $cod_disc Código da disciplina
     * @param string $cod_turma Turma atual (para excluir da busca)
     * @param string $cod_grade Código da grade curricular
     * @return array Lista de outras turmas da mesma disciplina
     */
    public function getOutrasTurmasDisciplina($cod_disc, $cod_turma, $cod_grade)
    {
        $anoPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')->getAnoEPeriodoBase();
        
        // Query para buscar outras turmas da mesma disciplina e grade
        $select = $this->getObjectManager()
            ->createQueryBuilder()
            ->select('DisciplinaHorario.codturma', 'DisciplinaHorario.nomdisc', 'DisciplinaHorario.coddisc', 'DisciplinaHorario.codgrade')
            ->from('\Sae\Entity\DisciplinaHorario', 'DisciplinaHorario')
            ->where(
                'DisciplinaHorario.coddisc = ?1
                and
                DisciplinaHorario.codgrade = ?2
                and
                DisciplinaHorario.codturma NOT LIKE ?3
                and
                DisciplinaHorario.anobase = ?4
                and
                DisciplinaHorario.periodobase = ?5
                '
            )
            ->setParameters(
                array(
                    '1' => $cod_disc,      // Mesma disciplina
                    '2' => $cod_grade,     // Mesma grade curricular
                    '3' => $cod_turma,     // Exclui a turma atual
                    '4' => $anoPeriodoBase['anobase'],
                    '5' => $anoPeriodoBase['periodobase']
                )
            )
            // Agrupa para evitar duplicatas
            ->groupBy(
                'DisciplinaHorario.codturma',
                'DisciplinaHorario.nomdisc',
                'DisciplinaHorario.coddisc',
                'DisciplinaHorario.codgrade'
            )->orderBy("DisciplinaHorario.codturma");
        $result = $select->getQuery()->getResult();

        return $result;
    }     /**
     * Busca outras disciplinas da mesma fase curricular para compartilhamento
     * Utiliza SQL nativo para fazer join com tabela acadêmica de disciplinas ofertadas
     * 
     * @param string $cod_disc Código da disciplina atual
     * @param string $cod_turma Turma atual
     * @param string $cod_grade Grade curricular
     * @param int $fase Número da fase/período acadêmico
     * @return array Lista de disciplinas da mesma fase
     */
    public function getOutrasDisciplinaMesmaFase($cod_disc, $cod_turma, $cod_grade, $fase)
    {

        $anoEPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')->getAnoEPeriodoBase();
        
        // SQL nativo para fazer join entre tabelas SAE e ACAD
        // Busca disciplinas da mesma fase, excluindo a disciplina atual
        $sql = "SELECT dh.codturma, dh.nomdisc, dh.coddisc, dh.codgrade from sae_disciplina_horario dh, ACAD.DIS_OFERTADA do
                where
                (do.coddisc = dh.coddisc
                and
                do.codturma = dh.codturma
                and
                do.codgrade = dh.codgrade
                and
                do.anobase = dh.anobase
                and
                do.periodobase = dh.periodobase
                and
                do.fase = :fase                    -- Filtra pela fase específica
                and dh.codgrade = :cod_grade 
                )                
                and
                ((dh.coddisc != :cod_disc) or ( dh.codturma != :cod_turma))  -- Exclui disciplina atual
                and dh.anobase = :anobase
                and dh.periodobase = :periodobase
                group by dh.codturma, dh.nomdisc, dh.coddisc, dh.codgrade
                order by dh.nomdisc";        
        $conn = $this->getObjectManager()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':fase', $fase);
        $stmt->bindParam(':cod_grade', $cod_grade);
        $stmt->bindParam(':cod_disc', $cod_disc);
        $stmt->bindParam(':cod_turma', $cod_turma);
        $stmt->bindParam(':anobase', $anoEPeriodoBase['anobase']);
        $stmt->bindParam(':periodobase', $anoEPeriodoBase['periodobase']);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return $result;
    }    /**
     * Obtém todos os horários de uma disciplina específica com sistema de cache
     * Método otimizado para consultas frequentes dos horários
     * 
     * @param array $params Parâmetros da disciplina (ANOBASE, PERIODOBASE, CODTURMA, CODGRADE, CODDISC)
     * @return array Horários formatados da disciplina
     */
    public function getHorariosDisciplina($params)
    {
        // Gera chave única para cache baseada nos parâmetros
        $nome_cache = 'get_horarios_disciplina' . $params['ANOBASE'] . $params['PERIODOBASE'] . $params['CODTURMA'] . $params['CODGRADE'] . $params['CODDISC'];

        // Verifica se os dados estão em cache
        if (!$this->getService('Cache')->contains($nome_cache)) {

            // Suporte para múltiplas turmas (separadas por vírgula)
            if (strstr($params['CODTURMA'], ',')) {
                $turmas = explode(',', $params['CODTURMA']);
            }else{
                $turmas[] = $params['CODTURMA'];
            }

            // Processa cada turma
            foreach ($turmas as $turma) {
                // Query para buscar horários da disciplina
                $select = $this->getObjectManager()
                    ->createQueryBuilder()
                    ->select("Finalidade.hora_inicio_exibe", "Finalidade.hora_final_exibe", "Finalidade.hora_inicio")
                    ->from('\Sae\Entity\DisciplinaHorario', 'Finalidade')
                    ->where("Finalidade.anobase = ?1")
                    ->andWhere("Finalidade.periodobase = ?2")
                    ->andWhere("Finalidade.codturma = ?3")
                    ->andWhere("Finalidade.codgrade = ?4")
                    ->andWhere("Finalidade.coddisc = ?5")
                    ->distinct()
                    ->orderBy("Finalidade.hora_inicio", 'ASC')
                    ->setParameters(array(
                        1 => $params['ANOBASE'],
                        2 => $params['PERIODOBASE'],
                        3 => $turma,
                        4 => $params['CODGRADE'],
                        5 => $params['CODDISC']
                    ));
                $result[] = $select->getQuery()
                    ->getResult();
            }

            $horarios = array();

            // Organiza horários evitando duplicatas usando concatenação de horários como chave
            foreach ($result as $r) {
                foreach($r as $horario) {
                    $horarios[$horario['hora_inicio_exibe'].$horario['hora_final_exibe']] = $horario;
                }
            }

            // Salva no cache por 1 hora (3600 segundos)
            $this->getService('Cache')->save($nome_cache, $horarios, 3600);
        } else {
            // Recupera dados do cache
            $horarios = $this->getService('Cache')->fetch($nome_cache);
        }

        return $horarios;
    }    /**
     * Compartilha finalidades de um dia específico entre duas disciplinas
     * Método para transferir compartilhamentos existentes de uma disciplina para outra
     * 
     * @param int $id_finalidade_secundaria ID da disciplina que será compartilhada
     * @param int $id_finalidade_principal ID da disciplina principal que receberá o compartilhamento
     * @return array Dados do resultado da operação
     */
    public function compartilhaFinalidadeDia($id_finalidade_secundaria, $id_finalidade_principal)
    {
        // Busca as entidades das disciplinas pelos IDs
        $finalidade_principal = $this->getObjectManager()
        ->find('\Sae\Entity\DisciplinaHorario', $id_finalidade_principal);
        $finalidade_secundaria = $this->getObjectManager()
        ->find('\Sae\Entity\DisciplinaHorario', $id_finalidade_secundaria);
        
        // Busca o processo de alocação ativo
        $processoAlocacao = $this->getObjectManager()->getRepository('\Sae\Entity\ProcessoAlocacao')
            ->findOneBy(array('status_parametro' => 1), array('id' => 'desc'));
        $espaco = null;

        // Se a disciplina principal já tem uma principal, usa ela
        if (count($finalidade_principal->getFinalidadesPrincipais()) > 0)
            $finalidade_principal = $finalidade_principal->getFinalidadesPrincipais()[0];

        // Adiciona a disciplina secundária como compartilhada da principal
        if (!$finalidade_principal->getFinalidadesCompartilhadas()->contains($finalidade_secundaria)) {

            if (!$finalidade_principal->getFinalidadesCompartilhadas()->contains($finalidade_secundaria)) {
                $finalidade_principal->getFinalidadesCompartilhadas()->add($finalidade_secundaria);
                $this->getObjectManager()->persist($finalidade_principal);
            }
        }

        // Transfere todas as disciplinas compartilhadas da secundária para a principal
        foreach ($finalidade_secundaria->getFinalidadesCompartilhadas() as $compartilhada) {
            // Remove da secundária
            $finalidade_secundaria->getFinalidadesCompartilhadas()->removeElement($compartilhada);

            // Adiciona na principal se ainda não estiver
            if (!$finalidade_principal->getFinalidadesCompartilhadas()->contains($compartilhada))
                $finalidade_principal->getFinalidadesCompartilhadas()->add($compartilhada);
        }

        // Salva as alterações nas entidades
        $this->getObjectManager()->persist($finalidade_principal);
        $this->getObjectManager()->persist($finalidade_secundaria);

        // Se a principal tem espaço alocado, compartilha com todas as disciplinas
        if (count($finalidade_principal->getEspacoFinalidadeAlocado()) > 0) {
            $espaco = $finalidade_principal->getEspacoFinalidadeAlocado()[0]->getEspaco();
            $this->compartilhaDisciplinaHorario($finalidade_principal, $espaco, $processoAlocacao);
            $espaco = $espaco->getId();
        }

        try{
            $this->getObjectManager()->flush();
        }catch(\Exception $e){
            throw new \Exception("Erro ao compartilhar finalidades: ".$e->getMessage());
        }

        $retorno = array(
            'finalidade_secundaria' => $id_finalidade_secundaria,
            'finalidade_principal' => $id_finalidade_principal,
            'espaco' => $espaco
        );

        return $retorno;
    }    /**
     * Busca espaços para múltiplas disciplinas em lote
     * Processa um array de parâmetros de disciplinas e retorna os espaços alocados para cada uma
     * 
     * @param array $array Array contendo parâmetros de múltiplas disciplinas
     * @return array Array com dados de espaços para cada disciplina processada
     */
    public function espacosVariasDisciplinas($array) {
        $dados = array();

        // Processa cada conjunto de parâmetros de disciplina
        foreach ($array as $params) {
            $dados[] = $this->espacosDisciplinas($params);
        }

        return $dados;
    }    /**
     * Busca espaços alocados para uma disciplina específica em datas determinadas
     * Retorna informações sobre os espaços físicos onde a disciplina terá aulas nas datas especificadas
     * 
     * @param array $params Parâmetros contendo:
     *   - cod_disc: Código da disciplina
     *   - cod_grade: Código da grade curricular
     *   - cod_turma: Código da turma
     *   - datas_aulas: Array com datas e horários das aulas
     * @return array Dados das aulas com espaços alocados
     * @throws ServiceException Em caso de parâmetros inválidos ou disciplina não encontrada
     */
    public function espacosDisciplinas($params)
    {
        // Obtém o ano e período base para consultas
        $anoPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')
            ->getAnoEPeriodoBaseAlunos();
        $params = (array)$params;
        
        // Valida os parâmetros de entrada
        $validator = new \Sae\Validator\EspacoDisciplinasValidator();
        $validator->setData($params);

        if (!$validator->isValid() || !is_array($params['datas_aulas']))
            throw new ServiceException("Parâmetros inválidos");

        // Verifica se a disciplina existe no sistema
        $disciplina_existente = $this->getObjectManager()
            ->getRepository('\Sae\Entity\DisciplinaHorario')
            ->findOneBy(array(
                    'coddisc' => $params['cod_disc'],
                    'codgrade' => $params['cod_grade'],
                    'codturma' => $params['cod_turma'],
                    // Comentados para permitir busca em diferentes períodos
                    //'anobase' => $anoPeriodoBase['anobase'],
                    //'periodobase' => $anoPeriodoBase['periodobase'],
                )
            );

        if (!$disciplina_existente)
            throw new ServiceException("Disciplina inválida ou não localizada");

        $datas_com_espacos = array();

        // Processa cada data de aula solicitada
        foreach ($params['datas_aulas'] as $data_aula) {
            // Valida cada data de aula individualmente
            $validator->getValidacaoDatasAulas()->setData($data_aula);

            if (!$validator->getValidacaoDatasAulas()->isValid())
                throw new ServiceException("Parâmetros inválidos");

            // Converte a data para intervalo de busca (início e fim do dia)
            $data_ini = \DateTime::createFromFormat('d/m/Y H:i:s', $data_aula['data_aula'] . ' ' . '00:00:00');
            $data_fim = \DateTime::createFromFormat('d/m/Y H:i:s', $data_aula['data_aula'] . ' ' . '23:59:59');
            
            // Busca o espaço alocado para a disciplina na data e horário específicos
            $select = $this->getObjectManager()
                ->createQueryBuilder()
                ->select(
                    "DisciplinaHorario.hora_inicio as hora_ini", "DisciplinaHorario.hora_final as hora_fim",
                    "DisciplinaHorario.data_inicial as data_aula",
                    "Espaco.desc_espaco", "Espaco.id AS id_espaco"
                )
                ->from('\Sae\Entity\DisciplinaHorario', 'DisciplinaHorario')
                ->leftJoin("DisciplinaHorario.espaco_finalidade_alocado", "EFA")
                ->leftJoin("EFA.espaco", "Espaco")
                ->where("DisciplinaHorario.hora_inicio = :hora_inicio")
                ->andWhere("DisciplinaHorario.hora_final = :hora_final")
                ->andWhere("DisciplinaHorario.data_inicial >= :data_ini")
                ->andWhere("DisciplinaHorario.data_inicial <= :data_fim")
                ->andWhere("DisciplinaHorario.coddisc = :cod_disc")
                ->andWhere("DisciplinaHorario.codgrade = :cod_grade")
                ->andWhere("DisciplinaHorario.codturma = :cod_turma")
                ->andWhere('EFA.deferido = 1') // Apenas alocações aprovadas
                ->setParameters([
                    ':hora_inicio' => $data_aula['hora_ini'],
                    ':hora_final' => $data_aula['hora_fim'],
                    ':data_ini' => $data_ini,
                    ':data_fim' => $data_fim,
                    ':cod_disc' => $params['cod_disc'],
                    ':cod_grade' => $params['cod_grade'],
                    ':cod_turma' => $params['cod_turma'],
                ]);
            
            $result = $select->getQuery()->getArrayResult();
            $lin = null;

            if (isset($result[0])) {
                if ($result[0]['desc_espaco']) {
                    $result[0]['data_aula'] = $data_aula['data_aula'];

                    // IDs 338 e 344 são espaços especiais que não devem ser exibidos
                    if ($result[0]['id_espaco'] == 338 || $result[0]['id_espaco'] == 344) {
                        $result[0]['desc_espaco'] = '';
                    } else {
                        // Se há múltiplos espaços, concatena as descrições
                        if (count($result) > 1) {
                            $esp = [];

                            foreach ($result as $r) {
                                $esp[$r['id_espaco']] = $r['desc_espaco'];
                            }

                            $result[0]['desc_espaco'] = '';

                            foreach ($esp as $e) {
                                $result[0]['desc_espaco'] .= ' | ' . $e;
                            }
                        }
                    }

                    $lin = $result[0];
                } else {
                    // Caso não tenha espaço alocado
                    $data_aula['desc_espaco'] = "Nenhum espaço alocado para a disciplina nesta data e horário, consulte a coordenação";
                    $lin = $data_aula;
                }
            } else {
                // Caso não encontre registros para a data/horário
                $data_aula['desc_espaco'] = "Nenhum espaço alocado para a disciplina nesta data e horário, consulte a coordenação";
                $lin = $data_aula;
            }

            array_push($datas_com_espacos, $lin);
            
            // Prepara índices para facilitar acesso aos dados
            $datas_com_espacos = $this->disciplinasAlocadasPreparaIndices($datas_com_espacos);
            
            // Cache por 5 minutos (300 segundos)
            $this->getService('Cache')->save($nome_cache, $datas_com_espacos, 300);
        }

        // Retorna dados estruturados da disciplina e suas aulas
        $dados = [
            'cod_disc' => (int)$params['cod_disc'],
            'cod_turma' => $params['cod_turma'],
            'cod_grade' => $params['cod_grade'],
            'datas_aulas' => $datas_com_espacos
        ];

        return $dados;
    }    /**
     * Prepara índices únicos para as datas com espaços alocados
     * Cria um array associativo usando data e horário como chave única para facilitar consultas
     * 
     * @param array $datas_com_espacos Array com dados de datas e espaços
     * @return array Array associativo com índices únicos (formato: DD-MM-YYYY_HH:MM_HH:MM)
     */
    private function disciplinasAlocadasPreparaIndices($datas_com_espacos)
    {
        $dados = array();

        foreach ($datas_com_espacos as $data_com_espaco) {
            // Cria índice único: data_horaInicio_horaFim
            $indice = str_replace('/', '-', $data_com_espaco['data_aula']).'_'
                .$data_com_espaco['hora_ini'].'_'.$data_com_espaco['hora_fim'];
            $dados[$indice] = $data_com_espaco;
        }

        return $dados;
    }    /**
     * Verifica se uma disciplina já está sendo compartilhada
     * 
     * Conta quantas instâncias da disciplina possuem finalidades principais (compartilhamentos),
     * indicando se a disciplina já participa de um arranjo de compartilhamento de espaço.
     * Disciplines coletivas são automaticamente excluídas da verificação.
     * 
     * @param string $cod_disc Código da disciplina
     * @param string $cod_turma Código da turma
     * @param string $cod_grade Código da grade curricular
     * @param string|null $data Data específica para filtrar (formato YYYY-MM-DD)
     * @param string|null $hora_inicial Hora de início para filtrar (HH:MM)
     * @param string|null $hora_final Hora de fim para filtrar (HH:MM)
     * @return int|null Número de compartilhamentos encontrados, null se disciplina é coletiva
     */
    public function disciplinaJaCompartilhada($cod_disc, $cod_turma, $cod_grade, $data = null, $hora_inicial = null, $hora_final = null)
    {
        // Disciplinas coletivas não participam de compartilhamentos individuais
        if ($this->disciplinaEColetiva($cod_disc, $cod_grade) == 1) {
            return null;
        }        // Obter ano e período base do sistema para filtrar registros atuais
        $anoPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')->getAnoEPeriodoBase();
        $parametros = array(
            'coddisc' => $cod_disc,
            'codturma' => $cod_turma,
            'codgrade' => $cod_grade,
            'anobase' => $anoPeriodoBase['anobase'],
            'periodobase' => $anoPeriodoBase['periodobase']
        );

        // Consulta para contar registros de DisciplinaHorario que possuem finalidades principais
        // Finalidades principais indicam que a disciplina é compartilhada com outras
        $select = $this->getObjectManager()
            ->createQueryBuilder()
            ->select('COUNT(DisciplinaHorario.id) as qtd_comp')
            ->from('\Sae\Entity\DisciplinaHorario', 'DisciplinaHorario')
            ->join('DisciplinaHorario.finalidades_principais', 'FinalidadePrincipal')
            ->where('DisciplinaHorario.coddisc = :coddisc')
            ->andWhere('DisciplinaHorario.codturma = :codturma')
            ->andWhere('DisciplinaHorario.codgrade = :codgrade')
            ->andWhere('DisciplinaHorario.anobase = :anobase')
            ->andWhere('DisciplinaHorario.periodobase = :periodobase');

        // Filtros opcionais por horário específico
        if ($data && $hora_inicial && $hora_final) {
            $parametros['hora_inicio'] = $hora_inicial;
            $parametros['hora_final'] = $hora_final;
            $parametros['data_inicial'] = $data;
            $select->andWhere('DisciplinaHorario.hora_inicio = :hora_inicio');
            $select->andWhere('DisciplinaHorario.hora_final = :hora_final');
            $select->andWhere('DisciplinaHorario.data_inicial = :data_inicial');
        }        $select->setParameters($parametros);
        $result = $select->getQuery()->getResult();

        // Retorna o número de compartilhamentos encontrados
        if (isset($result[0]['qtd_comp']))
            return $result[0]['qtd_comp'];

        return 0;
    }

    /**
     * Obtém a disciplina principal em um arranjo de compartilhamento
     * 
     * Procura entre as turmas especificadas qual possui finalidades principais,
     * identificando a disciplina que atua como "host" no compartilhamento de espaço.
     * A disciplina principal é responsável pelo espaço físico compartilhado.
     * 
     * @param array $params Parâmetros contendo CODTURMA (pode ser CSV), CODDISC, CODGRADE, ANOBASE, PERIODOBASE
     * @return object|null Objeto da finalidade principal encontrada, null se não houver
     */
    public function getDisciplinaPrincipalCompartilhamento($params)
    {
        // Processar múltiplas turmas se fornecidas como string separada por vírgula
        if (strstr(',', $params['CODTURMA'])) {
            $turmas = explode(',', $params['CODTURMA']);
        }else{
            $turmas[] = $params['CODTURMA'];
        }        $disciplinaPrincipal = null;

        // Iterar pelas turmas procurando aquela que possui finalidades principais
        foreach ($turmas as $turma) {
            $disciplinaHorario = $this->getObjectManager()->getRepository('\Sae\Entity\DisciplinaHorario')
                ->findBy(array(
                    'coddisc' => $params['CODDISC'],
                    'codturma' => $turma,
                    'codgrade' => $params['CODGRADE'],
                    'anobase' => $params['ANOBASE'],
                    'periodobase' => $params['PERIODOBASE']
                ));

            foreach ($disciplinaHorario as $disc) {
                // Se possui finalidades principais, é a disciplina principal do compartilhamento
                if (count($disc->getFinalidadesPrincipais()) > 0) {
                    $disciplinaPrincipal = $disc->getFinalidadesPrincipais()[0];
                    break;
                }
            }

            // Parar na primeira disciplina principal encontrada
            if ($disciplinaPrincipal)
                break;
        }

        return $disciplinaPrincipal;
    }

    /**
     * Constrói parâmetros para a disciplina principal do compartilhamento
     * 
     * Substitui os códigos da disciplina, turma e grade pelos valores da disciplina principal,
     * mantendo os demais parâmetros inalterados. Utilizado para operações que devem ser
     * executadas no contexto da disciplina principal.
     * 
     * @param array $params Parâmetros originais
     * @param object $disciplinaPrincipal Objeto da disciplina principal
     * @return array Parâmetros modificados com dados da disciplina principal
     */
    public function parametrosDiscPrincipal($params, $disciplinaPrincipal)
    {
        $paramsDiscPrincipal = $params;
        $paramsDiscPrincipal['CODDISC'] = $disciplinaPrincipal->getCoddisc();
        $paramsDiscPrincipal['CODTURMA'] = $disciplinaPrincipal->getCodturma();
        $paramsDiscPrincipal['CODGRADE'] = $disciplinaPrincipal->getCodgrade();

        return $paramsDiscPrincipal;
    }

    /**
     * Calcula o total de alunos em todas as disciplinas compartilhadas
     * 
     * Soma o número de alunos matriculados na disciplina principal com o número
     * de alunos das disciplinas compartilhadas. Usado para determinar a capacidade
     * necessária do espaço físico compartilhado.
     * 
     * @param array $params Parâmetros da disciplina (CODTURMA pode ser CSV)
     * @return int Total de alunos envolvidos no compartilhamento
     */
    public function getTotalAlunosCompartilhados($params)
    {
        $total = 0;

        // Processar múltiplas turmas se fornecidas
        if (strstr($params['CODTURMA'], ',')) {
            $turmas = explode(',', $params['CODTURMA']);
        }else{
            $turmas[] = $params['CODTURMA'];
        }

        foreach ($turmas as $turma) {
            // Buscar disciplina com finalidades compartilhadas
            $select = $this->getObjectManager()
                    ->createQueryBuilder()
                    ->select("DisciplinaHorario")
                    ->from("\Sae\Entity\DisciplinaHorario", 'DisciplinaHorario')
                    ->join("DisciplinaHorario.finalidades_compartilhadas", "FinalidadesCompartilhadas")
                    ->where("DisciplinaHorario.coddisc = :coddisc and DisciplinaHorario.codturma = :codturma"
                            . " and DisciplinaHorario.codgrade = :codgrade and "
                            . "DisciplinaHorario.anobase = :anobase and "
                            . "DisciplinaHorario.periodobase = :periodobase")
                    ->setParameters(array(
                        'coddisc' => $params['CODDISC'],
                        'codturma' => $turma,
                        'codgrade' => $params['CODGRADE'],
                        'anobase' => $params['ANOBASE'],
                        'periodobase' => $params['PERIODOBASE']
                    ));
            
            $result = $select->getQuery()->getResult();           
            $finalidade = isset($result[0]) ? $result[0] : null;
            
            // Fallback: buscar disciplina sem join se não houver finalidades compartilhadas
            if (!$finalidade){
                $finalidade = $this->getObjectManager()
                    ->getRepository('\Sae\Entity\DisciplinaHorario')
                    ->findOneBy(array(
                        'coddisc' => $params['CODDISC'],
                        'codturma' => $turma,
                        'codgrade' => $params['CODGRADE'],
                        'anobase' => $params['ANOBASE'],
                        'periodobase' => $params['PERIODOBASE']
                    ));
            }

            // Obter número de alunos matriculados na disciplina principal
            $qtd_alunos_disc = $this->getService('Sae\Service\InterfaceAlocacao')
                ->getDiscByCodeAndTurma($params['CODGRADE'], $params['CODCURSO'], $params['CODDISC'], $turma);            if ($finalidade) {
                $qtd_matriculado = 0;
                $qtd_matriculado += isset($qtd_alunos_disc[0]['MAT']) ? $qtd_alunos_disc[0]['MAT'] : 0;
                $qtd_alunos_disc_comp = array();
                
                // Somar alunos das disciplinas compartilhadas
                foreach ($finalidade->getFinalidadesCompartilhadas() as $compartilhada) {
                    // Obter curso habilitado para a grade da disciplina compartilhada
                    $curso = $this->getService('Sae\Service\Curso')->getCursoHabilitadoPorGrade($compartilhada->getCodgrade());
                    $qtd_array = $this->getService('Sae\Service\InterfaceAlocacao')
                        ->getDiscByCode($compartilhada->getCodgrade(), $curso['CODCURSO'], $compartilhada->getCoddisc());
                    $qtd = 0;                    
                    
                    // Somar todas as turmas da disciplina compartilhada
                    foreach ($qtd_array as $qtd_mat){
                        $qtd += isset($qtd_mat['MAT']) ? $qtd_mat['MAT'] : 0;
                    }
                    
                    // Indexar por disciplina+turma para evitar duplicatas
                    $indice = $compartilhada->getCoddisc() . $compartilhada->getCodturma();
                    $qtd_alunos_disc_comp[$indice] = $qtd;
                }
               
                // Total = alunos da disciplina principal + alunos das compartilhadas
                $total = $qtd_matriculado;
              
                foreach ($qtd_alunos_disc_comp as $q)
                    $total += $q;
            }
        }
        
        return $total;
    }

    /**
     * Verifica se uma disciplina é do tipo coletiva
     * 
     * Disciplinas coletivas têm características especiais no sistema acadêmico,
     * como não participarem de compartilhamentos individuais e terem regras
     * diferenciadas de alocação de espaço. Utiliza cache para otimizar consultas.
     * 
     * @param string $cod_disc Código da disciplina
     * @param string $cod_grade Código da grade curricular
     * @return int 1 se é coletiva, 0 se não é coletiva
     */
    public function disciplinaEColetiva($cod_disc, $cod_grade)
    {
        $anoEPeriodoBase = $this->getService('Sae\Service\ProcessoAlocacao')
            ->getAnoEPeriodoBase();
        $nome_cache = 'disciplinas_e_coletiva'.$anoEPeriodoBase['anobase'].$anoEPeriodoBase['periodobase'].$cod_grade.$cod_disc;

        // Verificar cache antes de consultar banco de dados
        if(!$this->getService('Cache')->contains($nome_cache)) {
            // Query complexa unindo várias tabelas para verificar flag coletivo
            $sql = "select distinct dg.flag_coletivo
                    from DIS_OFERTADA do
                    inner join dis_grade dg on do.coddisc = dg.coddisc
                    inner join disciplina dis on do.coddisc = dis.coddisc
                    inner join gra_habilitacao gh on  do.codgrade = gh.codgrade
                    inner join sae_disciplina_horario dh on dh.codgrade = do.codgrade
                    and dh.coddisc = do.coddisc and dh.anobase = do.anobase
                    and dh.periodobase = do.periodobase and dh.codturma = do.codturma
                    where dg.codgrade = ? and do.anobase = ? and do.periodobase = ?
                    and dg.CODDISC = ? and dg.codgrade = do.codgrade";
            $conn = $this->getObjectManager()->getConnection();
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(1, $cod_grade);
            $stmt->bindValue(2, $anoEPeriodoBase['anobase']);
            $stmt->bindValue(3, $anoEPeriodoBase['periodobase']);
            $stmt->bindValue(4, $cod_disc);
            $stmt->execute();
            $result = $stmt->fetchAll();
            
            // Cachear resultado por 5 minutos
            $this->getService('Cache')->save($nome_cache,$result, 300);
        } else {
            $result = $this->getService('Cache')
                ->fetch($nome_cache);
        }

        return isset($result[0]['FLAG_COLETIVO']) ? $result[0]['FLAG_COLETIVO'] : 0;
    }
}