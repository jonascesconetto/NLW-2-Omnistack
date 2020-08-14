// métodos http (GET, POST, PUT E DELETE ...)
// Corpo (Request Body): dados para criação ou atualização de um registro 
// Route Params: identifica qual recurso atualizar ou deletar
// Query Params: paginação

import { Request, Response} from 'express'

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem{
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController{

    async index (request: Request, response: Response){
        const filters = request.query;

        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string;

        if (!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        // const timeInMinutes = convertHourToMinutes(filters.time as string); // existem várias formas de fazer esse cast
        // console.log(timeInMinutes);
        const timeInMinutes = convertHourToMinutes(time);

        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']); // o [] é utilizado para o retornar toods os objetos 

        return response.json(classes);
    }

    async create (request: Request, response: Response) {
        const { //desestruturação
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        // utilizar o transaction para realizar a inserção no banco, 
        // assim se algum erro ocorrer todas as outras transações são retrocedidas
        // a variavel db é alterada para trx em todas as ocorrencias
        const trx = await db.transaction();
    
        try{
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
        
            const user_id = insertedUsersIds[0];
        
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id,
            });
        
            const class_id = insertedClassesIds[0];
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return{
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to)
                };
            })
        
            await trx('class_schedule').insert(classSchedule);
        
            // por utilizar trx é necessário realizar um comando final que realiza as operacões em banco
            await trx.commit();
        
            // mensagem de sucesso
            return response.status(201).send(); // 201 = creado com sucesso
    
        }catch(err){
            // caso tenha erro o trx precisa fazer um rollback em toda operação
            await trx.rollback();
    
            // mensagem de erro no console
            console.log(err);
    
            // mensagem de erro
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }
    }
}