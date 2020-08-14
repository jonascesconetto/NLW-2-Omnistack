import React, { useState, FormEvent } from 'react'
import {useHistory} from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';

import warningIcon from '../../assets/images/icons/warning.svg'

import './styles.css'
import api from '../../services/api';

function TeacherForm(){

    // mecanismo de redirecionamento de páginas
    const history  = useHistory();

    // variaveis e funções de segmentação do formulario para envio no back-end
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [bio, setBio] = useState('');

    const [subject, setSubject] = useState('');
    const [cost, setCost] = useState('');

    // variaveis dentro do react deposi de criadas são imutáveis
    const [scheduleItems, setScheduleItems] = useState([
        { week_day: 0, from: '', to: '' },
    ]);

    // função para indexar um novos elementos na parte do horário do professor
    function addNewScheduleItem(){
        setScheduleItems([
            ...scheduleItems, // spread operator (...) copia todo conteúdo de um array
            { week_day: 0, from: '', to: '' }
        ]);
    }

    // função para enviar os elementos do array de horarios de aula (dia da semana e hora das aulas)
    function setScheduleItemValue(position: number, field: string, value: string){
        
        const updateScheduleItems = scheduleItems.map((scheduleItem, index) => {
            if(index === position){
                return {
                    // retorna um objeto copiando tudo do array porém com o novo field e valor
                    ...scheduleItem,
                    [field]: value // [] mantem o valor que será passado por função neste caso 'week_day'
                };
            }
            return scheduleItem;
        });

        setScheduleItems(updateScheduleItems);
    }
    
    // função para testar se tudo ta funcionando
    function handleCreateClass(e: FormEvent){

        e.preventDefault(); //previnir o comportamento padrão de um formulário no html (page reload)

        api.post('classes', {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost: Number(cost),
            schedule: scheduleItems
        }).then(() => {
            alert('Cadastro realizado com sucesso!!!');

            // se der sucesso encaminha o usuário para a landingPage
            history.push('/')

        }).catch(() => {
            alert('Erro no cadastro');
        })

        // Test
        // console.log({
        //     name,
        //     avatar,
        //     whatsapp,
        //     bio,
        //     subject,
        //     cost,
        //     scheduleItems
        // });
    }

    return(
        <div id="page-teacher-form" className="container">
            <PageHeader 
                title="Que incrível qeu você quer dar aulas."
                description="O primeiro passo é preencher esse fomrulário de inscrição."
            />
            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>

                        <Input 
                            name="name" 
                            label="Nome completo" 
                            value={name} 
                            onChange={(e) => {setName(e.target.value)}} // é necessário usar o evento com um target para captura o valor dos campos
                        />

                        <Input 
                            name="avatar" 
                            label="Avatar"
                            value={avatar} 
                            onChange={(e) => {setAvatar(e.target.value)}}
                        />

                        <Input 
                            name="whatsapp" 
                            label="WhatsApp"
                            value={whatsapp} 
                            onChange={(e) => {setWhatsapp(e.target.value)}}
                        />

                        <Textarea 
                            name="bio" 
                            label="Biografia"
                            value={bio} 
                            onChange={(e) => {setBio(e.target.value)}}
                        />
                    </fieldset>

                    <fieldset>
                        <legend>Sobre a aula</legend>
                        <Select 
                            name="subject" 
                            label="Matéria"
                            value={subject} 
                            onChange={(e) => {setSubject(e.target.value)}}
                            options={[
                                {value: 'Artes', label: 'Artes'},
                                {value: 'Biologia', label: 'Biologia'},
                                {value: 'Ciências', label: 'Ciências'},
                                {value: 'Educação Física', label: 'Educação Física'},
                                {value: 'Geografia', label: 'Geografia'},
                                {value: 'História', label: 'História'},
                                {value: 'Matemática', label: 'Matemática'},
                                {value: 'Potuguês', label: 'Potuguês'},
                                {value: 'Química', label: 'Química'},
                            ]}
                        />

                        <Input 
                            name="cost" 
                            label="Custo da sua hora por aula"
                            value={cost} 
                            onChange={(e) => {setCost(e.target.value)}}
                        />
                    </fieldset>

                    <fieldset>
                        <legend>
                            Horários disponíveis
                            <button type="button" onClick={addNewScheduleItem}>+ Novo horário</button>
                        </legend>
                        
                        {scheduleItems.map((scheduleItem, index) => {
                            return(
                                <div key={scheduleItem.week_day} className="schedule-item">
                            
                                    <Select 
                                        name="week_day" 
                                        label="Dia da semana"
                                        value={scheduleItem.week_day}
                                        onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                                        // por ser um array complica um pouco, por isso é necessário passar outros compos como parametros
                                        options={[
                                            {value: '0', label: 'Domingo'},
                                            {value: '1', label: 'Segunda-feira'},
                                            {value: '2', label: 'Terça-feira'},
                                            {value: '3', label: 'Quarta-feira'},
                                            {value: '4', label: 'Quinta-feira'},
                                            {value: '5', label: 'Sexta-feira'},
                                            {value: '6', label: 'Sábado'},
                                        ]}
                                    />

                                    <Input 
                                        name="from" 
                                        label="Das" 
                                        type="time" 
                                        value={scheduleItem.from}
                                        onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                                    />
                                    
                                    <Input 
                                        name="to" 
                                        label="Até" 
                                        type="time" 
                                        value={scheduleItem.to}
                                        onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                                    />

                                </div>
                            )
                        })}
                    </fieldset>

                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso importante"/>
                            Importante! <br/>
                            Preencha todos os dados 
                        </p>
                        <button type="submit"> 
                            Salvar cadastro
                        </button>
                    </footer>
                </form>
            </main>
       </div>       
    );
}

export default TeacherForm;