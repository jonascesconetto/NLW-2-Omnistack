import React, { useState, useEffect } from 'react';
import { View, ScrollView, AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';

function Favorites(){

    const [favorites, setFavorites] = useState([]);

    function loadFavorites(){
        // usando banco de dados no dispositivo móvel - aceita somente tipo texto 
        // busca no banco de dados os professores favoritados e salva no array (setFavorites)
        AsyncStorage.getItem('favorites').then(response => {
            if(response){
                const favoritedTeachers = JSON.parse(response);
                
                setFavorites(favoritedTeachers);
            }
        });
    }
    
    // ESSA FUNCAO EXECUTA SEMPRE QUE A TELA ENTRA EM FOCO
    useFocusEffect (() => {
        loadFavorites();
    });

    return(
        <View style={styles.container}>
            
            <PageHeader title="Meus proffys favoritos" />
            
            <ScrollView style={styles.teacherList} contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16,
            }}>
                {favorites.map((teacher: Teacher) => {
                   return (
                    <TeacherItem 
                        key={teacher.id}
                        teacher={teacher}
                        favorited={true}
                    />
                   ) 
                })}
            </ScrollView>
        </View>
    )
}

export default Favorites;